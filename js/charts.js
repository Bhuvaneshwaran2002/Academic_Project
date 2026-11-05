// High-performance Grafana Canvas Chart Renderer with Live Streaming & Analytics Support
class GrafanaChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      yMin: 0,
      yMax: 100,
      yUnit: '%',
      yTicks: [0, 25, 50, 75, 100],
      xLabels: ['11:30', '11:45', '12:00', '12:15'],
      lineColor: '#73bf69',
      fillColor: 'rgba(115, 191, 105, 0.12)',
      lineWidth: 1.6,
      series: [], // for multi-line charts
      showGrid: true,
      showLivePulse: true,
      showDots: false,
      dotColor: null,
      isSparkline: false,
      gridColor: '#1e222a',
      textColor: '#5e6470',
      font: '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }, options);

    this.data = options.data || [];
    this.tooltipEl = document.getElementById('chartTooltip') || this.createTooltipElement();
    this.initCanvas();
    this.setupEvents();
    this.render();
  }

  createTooltipElement() {
    let el = document.getElementById('chartTooltip');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chartTooltip';
      el.className = 'chart-tooltip';
      document.body.appendChild(el);
    }
    return el;
  }

  initCanvas() {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width || (this.options.isSparkline ? 180 : 300);
    this.height = rect.height || (this.options.isSparkline ? 38 : 140);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Padding for axes
    if (this.options.isSparkline) {
      this.padding = { top: 4, bottom: 4, left: 4, right: 4 };
    } else {
      this.padding = {
        top: 12,
        bottom: 20,
        left: this.options.yUnit.includes('MB') ? 48 : (this.options.yUnit.includes('s') ? 34 : 32),
        right: 12
      };
    }
  }

  resize() {
    this.initCanvas();
    this.render();
  }

  setData(newData) {
    this.data = newData;
    this.render();
  }

  pushDataPoint(newVal) {
    if (this.data && this.data.length > 0) {
      this.data.shift();
      this.data.push(newVal);
      this.render();
    }
  }

  pushSeriesPoint(newVals) {
    if (this.options.series && this.options.series.length > 0) {
      this.options.series.forEach((s, idx) => {
        if (newVals[idx] !== undefined) {
          s.data.shift();
          s.data.push(newVals[idx]);
        }
      });
      this.render();
    }
  }

  setSeries(newSeries) {
    this.options.series = newSeries;
    this.render();
  }

  setXLabels(labels) {
    this.options.xLabels = labels;
    this.render();
  }

  setupEvents() {
    if (this.options.isSparkline) return;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX >= this.padding.left && mouseX <= this.width - this.padding.right) {
        this.render(mouseX);
        this.showTooltip(e.clientX, e.clientY, mouseX);
      } else {
        this.render();
        this.hideTooltip();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.render();
      this.hideTooltip();
    });

    window.addEventListener('resize', () => {
      this.initCanvas();
      this.render();
    });
  }

  showTooltip(pageX, pageY, mouseX) {
    const plotWidth = this.width - this.padding.left - this.padding.right;
    const normX = (mouseX - this.padding.left) / plotWidth;
    
    let html = '';
    
    if (this.options.series && this.options.series.length > 0) {
      const idx = Math.min(Math.floor(normX * this.options.series[0].data.length), this.options.series[0].data.length - 1);
      html += `<div style="font-weight:600;margin-bottom:3px;color:#cfd3db;">${this.getApproxTime(normX)}</div>`;
      this.options.series.forEach(s => {
        const val = s.data[idx] !== undefined ? s.data[idx].toFixed(2) : '0';
        html += `<div style="display:flex;align-items:center;gap:6px;font-size:10.5px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:1px;background:${s.color};"></span>
          <span style="color:#9e9e9e;">${s.name}:</span>
          <span style="color:#fff;font-weight:600;font-family:monospace;">${val}${this.options.yUnit}</span>
        </div>`;
      });
    } else if (this.data && this.data.length > 0) {
      const idx = Math.min(Math.floor(normX * this.data.length), this.data.length - 1);
      const val = this.data[idx] !== undefined ? this.data[idx].toFixed(1) : '0';
      html = `<div style="color:#cfd3db;font-size:10px;">${this.getApproxTime(normX)}</div>
              <div style="font-weight:700;color:${this.options.lineColor};font-family:monospace;">
                ${val} ${this.options.yUnit}
              </div>`;
    }

    if (html) {
      this.tooltipEl.innerHTML = html;
      this.tooltipEl.style.display = 'block';
      this.tooltipEl.style.left = `${pageX + 12}px`;
      this.tooltipEl.style.top = `${pageY - 20}px`;
    }
  }

  getApproxTime(normX) {
    const labels = this.options.xLabels;
    if (!labels || labels.length === 0) return '';
    const idx = Math.min(Math.floor(normX * labels.length), labels.length - 1);
    return labels[idx];
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  render(hoverX = null) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const pad = this.padding;

    ctx.clearRect(0, 0, w, h);

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    if (!this.options.isSparkline) {
      // Draw Y grid lines and labels
      ctx.font = this.options.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this.options.textColor;
      ctx.lineWidth = 1;

      const yTicks = this.options.yTicks;
      yTicks.forEach(tick => {
        const yNorm = (tick - this.options.yMin) / (this.options.yMax - this.options.yMin);
        const yPos = pad.top + plotH * (1 - yNorm);

        if (this.options.showGrid) {
          ctx.strokeStyle = this.options.gridColor;
          ctx.beginPath();
          ctx.moveTo(pad.left, yPos);
          ctx.lineTo(w - pad.right, yPos);
          ctx.stroke();
        }

        let labelText = `${tick}`;
        if (this.options.yUnit && this.options.yUnit !== '%' && this.options.yUnit !== 's') {
          labelText += ` ${this.options.yUnit}`;
        } else if (this.options.yUnit === '%') {
          labelText += '%';
        }
        ctx.fillText(labelText, pad.left - 4, yPos);
      });

      // Draw X labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const xLabels = this.options.xLabels;
      xLabels.forEach((label, i) => {
        const xPos = pad.left + (plotW / (xLabels.length - 1)) * i;
        ctx.fillText(label, xPos, h - pad.bottom + 6);
      });
    }

    // Draw Series
    if (this.options.series && this.options.series.length > 0) {
      this.options.series.forEach(s => {
        this.drawLine(s.data, s.color, s.fillColor || null, plotW, plotH, pad, false);
      });
    } else if (this.data && this.data.length > 0) {
      this.drawLine(this.data, this.options.lineColor, this.options.fillColor, plotW, plotH, pad, this.options.showLivePulse);
    }

    // Draw hover cursor line
    if (hoverX !== null && !this.options.isSparkline) {
      ctx.strokeStyle = '#5794f2';
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoverX, pad.top);
      ctx.lineTo(hoverX, h - pad.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawLine(data, strokeColor, fillColor, plotW, plotH, pad, showPulse) {
    if (!data || data.length < 2) return;
    const ctx = this.ctx;
    const yMin = this.options.yMin;
    const yMax = this.options.yMax;

    const points = [];
    for (let i = 0; i < data.length; i++) {
      const x = pad.left + (i / (data.length - 1)) * plotW;
      const yNorm = (data[i] - yMin) / (yMax - yMin);
      const clampedYNorm = Math.max(0, Math.min(1, yNorm));
      const y = pad.top + plotH * (1 - clampedYNorm);
      points.push({ x, y });
    }

    // Path for line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = this.options.lineWidth;
    ctx.stroke();

    // Fill under path if enabled
    if (fillColor) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[points.length - 1].x, pad.top + plotH);
      ctx.lineTo(points[0].x, pad.top + plotH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw little point dots on line (like DORA analytics graphs)
    if (this.options.showDots) {
      points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.options.dotColor || strokeColor;
        ctx.fill();
        ctx.strokeStyle = '#181b1f';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Draw glowing pulsing head on the active edge (live indicator)
    if (showPulse && points.length > 0) {
      const last = points[points.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1.0;
      ctx.fill();
    }
  }
}

// Stacked Bar Chart for "Deployments Over Time"
class GrafanaStackedBarChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      yMin: 0,
      yMax: 25,
      yTicks: [0, 5, 10, 15, 20, 25],
      xLabels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
      successColor: '#2ea043',
      failedColor: '#da3633',
      gridColor: '#1e222a',
      textColor: '#5e6470',
      data: [] // [{ success: 10, failed: 2, day: 'May 1' }, ...]
    }, options);

    this.options.data = options.data || [];
    this.tooltipEl = document.getElementById('chartTooltip');
    this.initCanvas();
    this.setupEvents();
    this.render();
  }

  updateLatestDay(success, failed) {
    if (this.options.data && this.options.data.length > 0) {
      const last = this.options.data[this.options.data.length - 1];
      last.success = success;
      last.failed = failed;
      this.render();
    }
  }

  initCanvas() {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 140;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.padding = { top: 12, bottom: 22, left: 32, right: 12 };
  }

  resize() {
    this.initCanvas();
    this.render();
  }

  setupEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const data = this.options.data;
      if (!data || data.length === 0) return;

      const plotW = this.width - this.padding.left - this.padding.right;
      const barSpacing = plotW / data.length;
      const barIdx = Math.floor((mouseX - this.padding.left) / barSpacing);

      if (barIdx >= 0 && barIdx < data.length) {
        this.render(barIdx);
        this.showTooltip(e.clientX, e.clientY, data[barIdx]);
      } else {
        this.render();
        this.hideTooltip();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.render();
      this.hideTooltip();
    });

    window.addEventListener('resize', () => {
      this.initCanvas();
      this.render();
    });
  }

  showTooltip(pageX, pageY, item) {
    if (!this.tooltipEl) return;
    const total = item.success + item.failed;
    this.tooltipEl.innerHTML = `
      <div style="font-weight:600;color:#fff;margin-bottom:3px;">${item.day}</div>
      <div style="display:flex;align-items:center;gap:6px;color:#73bf69;font-size:10.5px;">
        <span>Successful:</span><strong style="color:#fff;">${item.success}</strong>
      </div>
      <div style="display:flex;align-items:center;gap:6px;color:#f2495c;font-size:10.5px;">
        <span>Failed:</span><strong style="color:#fff;">${item.failed}</strong>
      </div>
      <div style="margin-top:2px;border-top:1px solid #323742;padding-top:2px;font-size:10px;color:#8e929c;">
        Total: ${total} Deployments
      </div>
    `;
    this.tooltipEl.style.display = 'block';
    this.tooltipEl.style.left = `${pageX + 12}px`;
    this.tooltipEl.style.top = `${pageY - 20}px`;
  }

  hideTooltip() {
    if (this.tooltipEl) this.tooltipEl.style.display = 'none';
  }

  render(hoverIdx = null) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const pad = this.padding;

    ctx.clearRect(0, 0, w, h);

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Draw Y grid and labels
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.options.textColor;
    ctx.lineWidth = 1;

    this.options.yTicks.forEach(tick => {
      const yNorm = tick / this.options.yMax;
      const yPos = pad.top + plotH * (1 - yNorm);

      ctx.strokeStyle = this.options.gridColor;
      ctx.beginPath();
      ctx.moveTo(pad.left, yPos);
      ctx.lineTo(w - pad.right, yPos);
      ctx.stroke();

      ctx.fillText(`${tick}`, pad.left - 4, yPos);
    });

    // Draw X labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xLabels = this.options.xLabels;
    xLabels.forEach((label, i) => {
      const xPos = pad.left + (plotW / (xLabels.length - 1)) * i;
      ctx.fillText(label, xPos, h - pad.bottom + 6);
    });

    // Draw Bars
    const data = this.options.data;
    if (!data || data.length === 0) return;

    const totalBars = data.length;
    const slotW = plotW / totalBars;
    const barW = Math.max(3, slotW * 0.65);

    data.forEach((d, i) => {
      const x = pad.left + i * slotW + (slotW - barW) / 2;
      const successH = (d.success / this.options.yMax) * plotH;
      const failedH = (d.failed / this.options.yMax) * plotH;

      const isHovered = (hoverIdx === i);

      // Successful Bar (Green)
      ctx.fillStyle = isHovered ? '#3fb950' : this.options.successColor;
      ctx.fillRect(x, pad.top + plotH - successH, barW, successH);

      // Failed Bar (Red, stacked on top)
      if (d.failed > 0) {
        ctx.fillStyle = isHovered ? '#f85149' : this.options.failedColor;
        ctx.fillRect(x, pad.top + plotH - successH - failedH, barW, failedH);
      }
    });
  }
}

// Generate realistic oscillating server metrics that match the reference screenshot
function generateStableOscillation(count, baseline, variance, minVal, maxVal) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i * 0.35) * (variance * 0.5) + Math.cos(i * 0.8) * (variance * 0.3);
    const noise = (Math.random() - 0.5) * (variance * 0.5);
    let val = baseline + wave + noise;
    val = Math.max(minVal, Math.min(maxVal, val));
    data.push(val);
  }
  return data;
}
