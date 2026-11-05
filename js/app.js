// Application State & Controller for Grafana DevOps Observability Dashboard

let currentActiveView = 'overview';

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTopPods();
  initWaterfall();
  initOverviewCharts();
  initControls();
  initModals();
  initClock();
  setupSidebarNavigation();
  startUnifiedLiveStreaming();
});

// ----------------------------------------------------------------------------
// 1. Icon Initializer
// ----------------------------------------------------------------------------
function initIcons() {
  const iconMappings = {
    'logo-grafana': ICONS.grafanaLogo,
    'logo-grafana-tech': ICONS.grafanaLogo,
    'icon-home': ICONS.home,
    'icon-infra': ICONS.infrastructure,
    'icon-apps': ICONS.applications,
    'icon-logs': ICONS.logs,
    'icon-traces': ICONS.traces,
    'icon-alerts': ICONS.alerts,
    'icon-analytics': ICONS.analytics,
    'icon-reports': ICONS.reports,
    'icon-settings': ICONS.settings,
    'icon-settings-top': ICONS.settings,
    'avatar-user': ICONS.user,
    'icon-clock-nav': ICONS.clock,
    'icon-clock-system': ICONS.clock,
    'icon-chevron-time': ICONS.chevronDown,
    'icon-chevron-interval': ICONS.chevronDown,
    'icon-refresh': ICONS.refresh,
    'icon-refresh-interval': ICONS.refresh,
    'icon-fullscreen': ICONS.fullscreen,
    'icon-check-status': ICONS.checkCircle,
    'icon-pods-cube': ICONS.cube,
    'icon-k8s-nodes': ICONS.server,
    'icon-k8s-pods': ICONS.cube,
    'icon-k8s-deployments': ICONS.syncArrows,
    'icon-k8s-services': ICONS.nodes,
    'icon-stage-code': ICONS.code,
    'icon-stage-build': ICONS.gearSuccess,
    'icon-stage-test': ICONS.flask,
    'icon-stage-deploy': ICONS.rocket,
    'logo-kubernetes': ICONS.kubernetes,
    'logo-prometheus': ICONS.prometheus,
    'logo-loki': ICONS.loki,
    'logo-jaeger': ICONS.jaeger,
    'logo-opentelemetry': ICONS.opentelemetry,
    'logo-githubactions': ICONS.githubActions,
    'logo-docker': ICONS.docker,
    'logo-aws': ICONS.aws,

    // CI/CD Analytics specific icons
    'icon-dora-rocket': ICONS.rocket,
    'icon-dora-check': ICONS.checkCircle,
    'icon-dora-warn': ICONS.warningTriangle,
    'icon-dora-clock': ICONS.clockReload,
    'icon-summary-deploy': ICONS.rocket,
    'icon-summary-success': ICONS.checkCircle,
    'icon-summary-failed': ICONS.xCircle,
    'icon-summary-buildtime': ICONS.clock,
    'icon-summary-downtime': ICONS.clockReload,

    // Infrastructure specific icons
    'icon-infra-health': ICONS.checkCircle,
    'icon-infra-nodes': ICONS.server,
    'icon-infra-pods': ICONS.cube,

    // Applications specific icons
    'icon-apps-active': ICONS.nodes
  };

  for (const [id, svgHtml] of Object.entries(iconMappings)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svgHtml;
  }
}

// ----------------------------------------------------------------------------
// 2. Top 5 Pods Horizontal Bars (Active Real-Time Telemetry)
// ----------------------------------------------------------------------------
const topPodsData = [
  { name: 'payment-service-7f9c8', base: 72, percent: 72 },
  { name: 'order-service-5d6c7', base: 65, percent: 65 },
  { name: 'user-service-6b7d8', base: 58, percent: 58 },
  { name: 'inventory-service-6c8d9', base: 45, percent: 45 },
  { name: 'notification-service-7d8e9', base: 34, percent: 34 }
];

let podRowRefs = [];

function initTopPods() {
  const container = document.getElementById('podBarsContainer');
  if (!container) return;
  container.innerHTML = '';
  podRowRefs = [];

  topPodsData.forEach(pod => {
    const row = document.createElement('div');
    row.className = 'pod-bar-row';
    row.title = `${pod.name}: ${pod.percent}% CPU usage (${(pod.percent * 0.02).toFixed(2)} / 2.0 Cores)`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'pod-name';
    nameSpan.textContent = pod.name;

    const track = document.createElement('div');
    track.className = 'pod-progress-track';

    const bar = document.createElement('div');
    bar.className = 'pod-progress-bar' + (pod.percent >= 70 ? ' high-load' : '');
    bar.style.width = pod.percent + '%';
    track.appendChild(bar);

    const percentSpan = document.createElement('span');
    percentSpan.className = 'pod-percent';
    percentSpan.textContent = pod.percent + '%';

    row.appendChild(nameSpan);
    row.appendChild(track);
    row.appendChild(percentSpan);
    container.appendChild(row);

    podRowRefs.push({
      pod,
      bar,
      percentSpan,
      row,
      base: pod.base
    });
  });
}

function updateTopPodsLive(tick) {
  if (!podRowRefs || podRowRefs.length === 0) return;

  podRowRefs.forEach((item, idx) => {
    const delta = Math.sin(tick * 0.4 + idx * 1.5) * 4 + (Math.random() - 0.5) * 3;
    const currentPercent = Math.max(18, Math.min(96, Math.round(item.base + delta)));
    item.pod.percent = currentPercent;

    item.bar.style.width = currentPercent + '%';
    item.percentSpan.textContent = currentPercent + '%';
    item.row.title = `${item.pod.name}: ${currentPercent}% CPU usage (${(currentPercent * 0.02).toFixed(2)} / 2.0 Cores)`;

    if (currentPercent >= 70) {
      item.bar.classList.add('high-load');
      item.percentSpan.style.color = '#ffc078';
    } else {
      item.bar.classList.remove('high-load');
      item.percentSpan.style.color = '#e0e0e0';
    }
  });
}

// ----------------------------------------------------------------------------
// 3. Distributed Traces (Jaeger) Waterfall
// ----------------------------------------------------------------------------
const jaegerSpans = [
  { name: 'API Gateway', startMs: 0, durationMs: 912, color: '#73BF69', service: 'api-gateway', method: 'POST /checkout' },
  { name: 'user-service', startMs: 460, durationMs: 215, color: '#5794F2', service: 'user-service', method: 'GET /validate-session' },
  { name: 'order-service', startMs: 490, durationMs: 342, color: '#FF9830', service: 'order-service', method: 'POST /orders' },
  { name: 'inventory-service', startMs: 700, durationMs: 178, color: '#B877D9', service: 'inventory-service', method: 'POST /reserve' },
  { name: 'payment-service', startMs: 510, durationMs: 286, color: '#00D2D3', service: 'payment-service', method: 'POST /charge' }
];

function initWaterfall() {
  const container = document.getElementById('waterfallContainer');
  if (!container) return;
  container.innerHTML = '';

  const totalTimeMs = 1000;

  jaegerSpans.forEach(span => {
    const leftPct = (span.startMs / totalTimeMs) * 100;
    const widthPct = Math.max(3, (span.durationMs / totalTimeMs) * 100);

    const row = document.createElement('div');
    row.className = 'waterfall-span-row';
    row.style.cursor = 'pointer';
    row.title = `Click to inspect span: ${span.name} (${span.durationMs}ms)`;

    row.innerHTML = `
      <span class="span-name">${span.name}</span>
      <div class="span-bar-track">
        <div class="span-bar-fill" style="left: ${leftPct}%; width: ${widthPct}%; background-color: ${span.color};"></div>
      </div>
      <span class="span-duration">${span.durationMs}ms</span>
    `;

    row.addEventListener('click', () => openTraceInspector(span));
    container.appendChild(row);
  });
}

// ----------------------------------------------------------------------------
// 4. Overview Line Charts Initialization
// ----------------------------------------------------------------------------
let cpuChart, memoryChart, networkChart, responseTimeChart;
let liveTickIndex = 40;

function initOverviewCharts() {
  const timeLabels = ['11:30', '11:45', '12:00', '12:15'];

  const cpuData = generateStableOscillation(40, 52, 28, 25, 75);
  const memData = generateStableOscillation(40, 68, 6, 62, 73);
  const networkData = generateStableOscillation(40, 60, 48, 15, 120);

  const userResp = generateStableOscillation(25, 0.95, 0.35, 0.55, 1.25);
  const orderResp = generateStableOscillation(25, 1.25, 0.45, 0.85, 1.55);
  const payResp = generateStableOscillation(25, 0.52, 0.22, 0.30, 0.70);
  const invResp = generateStableOscillation(25, 0.28, 0.15, 0.12, 0.42);

  cpuChart = new GrafanaChart('cpuLineChart', {
    yMin: 0,
    yMax: 100,
    yUnit: '%',
    yTicks: [0, 25, 50, 75, 100],
    xLabels: timeLabels,
    lineColor: '#73bf69',
    fillColor: 'rgba(115, 191, 105, 0.14)',
    showLivePulse: true,
    data: cpuData
  });

  memoryChart = new GrafanaChart('memoryLineChart', {
    yMin: 0,
    yMax: 100,
    yUnit: '%',
    yTicks: [0, 25, 50, 75, 100],
    xLabels: timeLabels,
    lineColor: '#5794f2',
    fillColor: 'rgba(87, 148, 242, 0.14)',
    showLivePulse: true,
    data: memData
  });

  networkChart = new GrafanaChart('networkLineChart', {
    yMin: 0,
    yMax: 150,
    yUnit: 'MB/s',
    yTicks: [0, 50, 100, 150],
    xLabels: timeLabels,
    lineColor: '#b877d9',
    fillColor: 'rgba(184, 119, 217, 0.14)',
    showLivePulse: true,
    data: networkData
  });

  responseTimeChart = new GrafanaChart('responseTimeChart', {
    yMin: 0,
    yMax: 2.0,
    yUnit: 's',
    yTicks: [0, 0.5, 1.0, 1.5, 2.0],
    xLabels: timeLabels,
    showLivePulse: false,
    series: [
      { name: 'user-service', color: '#73bf69', data: userResp },
      { name: 'order-service', color: '#ff9830', data: orderResp },
      { name: 'payment-service', color: '#5794f2', data: payResp },
      { name: 'inventory-service', color: '#b877d9', data: invResp }
    ]
  });
}

// ----------------------------------------------------------------------------
// 5. CI/CD Analytics Charts Initializer
// ----------------------------------------------------------------------------
let cicdChartsInitialized = false;
let deployBarChart, buildSuccessChart, changeFailureChart, mttrChart;
let sparkDeploy, sparkBuild, sparkFailure, sparkMttr;

function initCicdAnalyticsCharts() {
  if (cicdChartsInitialized) return;
  cicdChartsInitialized = true;

  sparkDeploy = new GrafanaChart('sparklineDeploy', {
    isSparkline: true,
    yMin: 4,
    yMax: 14,
    lineColor: '#5794f2',
    fillColor: 'rgba(87, 148, 242, 0.15)',
    showDots: true,
    showLivePulse: true,
    data: [6.5, 7.8, 6.2, 8.4, 7.9, 9.1, 8.5, 10.2, 8.8, 9.4, 8.6, 9.8, 8.42]
  });

  sparkBuild = new GrafanaChart('sparklineBuild', {
    isSparkline: true,
    yMin: 90,
    yMax: 100,
    lineColor: '#73bf69',
    fillColor: 'rgba(115, 191, 105, 0.15)',
    showDots: true,
    showLivePulse: true,
    data: [93.5, 95.1, 94.2, 96.5, 95.8, 97.2, 96.4, 97.1, 96.0, 96.7]
  });

  sparkFailure = new GrafanaChart('sparklineFailure', {
    isSparkline: true,
    yMin: 1.5,
    yMax: 5.5,
    lineColor: '#ff9830',
    fillColor: 'rgba(255, 152, 48, 0.15)',
    showDots: true,
    showLivePulse: true,
    data: [4.8, 4.3, 4.5, 3.8, 3.5, 3.7, 3.1, 2.9, 2.6, 2.4, 2.31]
  });

  sparkMttr = new GrafanaChart('sparklineMttr', {
    isSparkline: true,
    yMin: 0.8,
    yMax: 3.5,
    lineColor: '#b877d9',
    fillColor: 'rgba(184, 119, 217, 0.15)',
    showDots: true,
    showLivePulse: true,
    data: [2.5, 2.2, 2.6, 2.1, 1.8, 1.9, 1.7, 1.5, 1.6, 1.42]
  });

  const deploymentsData = [
    { day: 'May 1', success: 10, failed: 1 },
    { day: 'May 2', success: 8, failed: 2 },
    { day: 'May 3', success: 12, failed: 0 },
    { day: 'May 4', success: 11, failed: 1 },
    { day: 'May 5', success: 10, failed: 2 },
    { day: 'May 6', success: 13, failed: 1 },
    { day: 'May 7', success: 11, failed: 0 },
    { day: 'May 8', success: 15, failed: 2 },
    { day: 'May 9', success: 12, failed: 1 },
    { day: 'May 10', success: 10, failed: 1 },
    { day: 'May 11', success: 8, failed: 0 },
    { day: 'May 12', success: 10, failed: 1 },
    { day: 'May 13', success: 11, failed: 1 },
    { day: 'May 14', success: 9, failed: 0 },
    { day: 'May 15', success: 6, failed: 1 },
    { day: 'May 16', success: 11, failed: 1 },
    { day: 'May 17', success: 12, failed: 0 },
    { day: 'May 18', success: 10, failed: 1 },
    { day: 'May 19', success: 9, failed: 0 },
    { day: 'May 20', success: 13, failed: 3 },
    { day: 'May 21', success: 7, failed: 1 },
    { day: 'May 22', success: 7, failed: 1 },
    { day: 'May 23', success: 12, failed: 1 },
    { day: 'May 24', success: 7, failed: 1 },
    { day: 'May 25', success: 12, failed: 0 },
    { day: 'May 26', success: 16, failed: 4 },
    { day: 'May 27', success: 6, failed: 0 }
  ];

  deployBarChart = new GrafanaStackedBarChart('chartDeploymentsOverTime', {
    yMax: 25,
    yTicks: [0, 5, 10, 15, 20, 25],
    xLabels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
    successColor: '#2ea043',
    failedColor: '#da3633',
    data: deploymentsData
  });

  const buildDays = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'];
  const buildPoints = [
    92.0, 95.5, 96.5, 95.8, 97.0, 95.5, 97.2, 94.8, 95.2, 94.6,
    97.2, 92.5, 91.8, 86.2, 93.5, 96.5, 96.2, 96.0, 97.4, 94.2,
    96.8, 96.4, 95.8, 96.2, 98.2, 97.2, 97.5
  ];

  buildSuccessChart = new GrafanaChart('chartBuildSuccessOverTime', {
    yMin: 70,
    yMax: 100,
    yUnit: '%',
    yTicks: [70, 75, 80, 85, 90, 95, 100],
    xLabels: buildDays,
    lineColor: '#5794f2',
    fillColor: 'rgba(87, 148, 242, 0.08)',
    showDots: true,
    showLivePulse: true,
    data: buildPoints
  });

  const failurePoints = [
    4.3, 5.1, 5.5, 4.9, 5.0, 5.6, 5.2, 5.1, 4.7, 4.1,
    3.9, 4.2, 3.8, 3.2, 3.7, 3.6, 3.4, 3.4, 3.2, 2.9,
    2.7, 2.4, 2.6, 2.2, 2.1
  ];

  changeFailureChart = new GrafanaChart('chartChangeFailureOverTime', {
    yMin: 0,
    yMax: 6,
    yUnit: '%',
    yTicks: [0, 1, 2, 3, 4, 5, 6],
    xLabels: buildDays,
    lineColor: '#ff9830',
    fillColor: 'rgba(255, 152, 48, 0.08)',
    showDots: true,
    showLivePulse: true,
    data: failurePoints
  });

  const mttrPoints = [
    2.0, 1.8, 3.7, 2.9, 2.9, 1.8, 1.7, 1.9, 1.3, 2.1,
    2.4, 2.8, 1.7, 2.0, 1.8, 1.9, 1.5, 1.9, 1.4, 1.3,
    1.6, 1.4, 1.2, 1.3, 1.4, 1.0, 1.6, 1.0, 1.0
  ];

  mttrChart = new GrafanaChart('chartMttrOverTime', {
    yMin: 0,
    yMax: 5,
    yUnit: '',
    yTicks: [0, 1, 2, 3, 4, 5],
    xLabels: buildDays,
    lineColor: '#b877d9',
    fillColor: 'rgba(184, 119, 217, 0.08)',
    showDots: true,
    showLivePulse: true,
    data: mttrPoints
  });
}

// ----------------------------------------------------------------------------
// 6. Infrastructure & Applications Charts Initializers
// ----------------------------------------------------------------------------
let infraChartsInitialized = false;
let infraCpuChart, infraMemChart, infraIopsChart;

function initInfraCharts() {
  if (infraChartsInitialized) return;
  infraChartsInitialized = true;

  const timeLabels = ['11:30', '11:45', '12:00', '12:15'];
  const cpuPoints = generateStableOscillation(30, 18.4, 6, 8, 30);
  const memPoints1 = generateStableOscillation(30, 28, 4, 15, 32);
  const memPoints2 = generateStableOscillation(30, 24, 3, 12, 30);
  const iopsPoints = generateStableOscillation(30, 3420, 1200, 1000, 4800);

  infraCpuChart = new GrafanaChart('chartInfraCpuCores', {
    yMin: 0,
    yMax: 32,
    yUnit: 'Cores',
    yTicks: [0, 8, 16, 24, 32],
    xLabels: timeLabels,
    lineColor: '#73bf69',
    fillColor: 'rgba(115, 191, 105, 0.12)',
    showLivePulse: true,
    data: cpuPoints
  });

  infraMemChart = new GrafanaChart('chartInfraMemNodes', {
    yMin: 0,
    yMax: 64,
    yUnit: 'GB',
    yTicks: [0, 16, 32, 48, 64],
    xLabels: timeLabels,
    series: [
      { name: 'worker-01', color: '#5794f2', data: memPoints1 },
      { name: 'worker-02', color: '#73bf69', data: memPoints2 }
    ]
  });

  infraIopsChart = new GrafanaChart('chartInfraDiskIops', {
    yMin: 0,
    yMax: 5000,
    yUnit: '',
    yTicks: [0, 1250, 2500, 3750, 5000],
    xLabels: timeLabels,
    lineColor: '#ff9830',
    fillColor: 'rgba(255, 152, 48, 0.12)',
    showLivePulse: true,
    data: iopsPoints
  });
}

let appsChartsInitialized = false;
let appsThroughputChart, appsLatencyChart;

function initAppsCharts() {
  if (appsChartsInitialized) return;
  appsChartsInitialized = true;

  const timeLabels = ['11:30', '11:45', '12:00', '12:15'];
  const gwRate = generateStableOscillation(30, 1240, 250, 600, 1600);
  const userRate = generateStableOscillation(30, 890, 180, 400, 1200);
  const orderRate = generateStableOscillation(30, 520, 110, 250, 800);

  const gwLat = generateStableOscillation(30, 42, 12, 20, 80);
  const payLat = generateStableOscillation(30, 286, 60, 150, 450);
  const orderLat = generateStableOscillation(30, 342, 80, 200, 520);

  appsThroughputChart = new GrafanaChart('chartAppsThroughput', {
    yMin: 0,
    yMax: 2000,
    yUnit: 'r/s',
    yTicks: [0, 500, 1000, 1500, 2000],
    xLabels: timeLabels,
    series: [
      { name: 'api-gateway', color: '#5794f2', data: gwRate },
      { name: 'user-service', color: '#73bf69', data: userRate },
      { name: 'order-service', color: '#ff9830', data: orderRate }
    ]
  });

  appsLatencyChart = new GrafanaChart('chartAppsLatency', {
    yMin: 0,
    yMax: 600,
    yUnit: 'ms',
    yTicks: [0, 150, 300, 450, 600],
    xLabels: timeLabels,
    series: [
      { name: 'order-service', color: '#ff9830', data: orderLat },
      { name: 'payment-service', color: '#f2495c', data: payLat },
      { name: 'api-gateway', color: '#5794f2', data: gwLat }
    ]
  });
}

// ----------------------------------------------------------------------------
// 7. Unified Live Streaming Engine (ALL GRAPHS ACTIVE ON EVERY VIEW)
// ----------------------------------------------------------------------------
let streamingTimer = null;
let isStreamingActive = true;
const STREAM_INTERVAL_MS = 1200;

function startUnifiedLiveStreaming() {
  if (streamingTimer) clearInterval(streamingTimer);

  streamingTimer = setInterval(() => {
    if (!isStreamingActive) return;
    liveTickIndex++;

    if (currentActiveView === 'overview') {
      advanceOverviewLiveStream(liveTickIndex);
    } else if (currentActiveView === 'cicd') {
      advanceCicdLiveStream(liveTickIndex);
    } else if (currentActiveView === 'infrastructure') {
      advanceInfraLiveStream(liveTickIndex);
    } else if (currentActiveView === 'applications') {
      advanceAppsLiveStream(liveTickIndex);
    } else if (currentActiveView === 'logs') {
      advanceLogsLiveStream(liveTickIndex);
    }
  }, STREAM_INTERVAL_MS);
}

// Stream Overview Graphs
function advanceOverviewLiveStream(i) {
  const nextCpu = Math.max(25, Math.min(80, 
    48 + Math.sin(i * 0.4) * 14 + Math.cos(i * 0.9) * 8 + (Math.random() - 0.5) * 8
  ));
  if (cpuChart) cpuChart.pushDataPoint(nextCpu);

  const nextMem = Math.max(64, Math.min(74, 
    68 + Math.sin(i * 0.2) * 2.5 + (Math.random() - 0.5) * 2.0
  ));
  if (memoryChart) memoryChart.pushDataPoint(nextMem);

  const burst = (i % 24 > 14) ? 35 : 0;
  const nextNet = Math.max(15, Math.min(135, 
    55 + burst + Math.sin(i * 0.5) * 25 + (Math.random() - 0.5) * 20
  ));
  if (networkChart) networkChart.pushDataPoint(nextNet);

  const nextUser = Math.max(0.6, Math.min(1.25, 0.95 + Math.sin(i * 0.3) * 0.2 + (Math.random() - 0.5) * 0.15));
  const nextOrder = Math.max(0.85, Math.min(1.5, 1.22 + Math.cos(i * 0.3) * 0.22 + (Math.random() - 0.5) * 0.18));
  const nextPay = Math.max(0.35, Math.min(0.68, 0.52 + Math.sin(i * 0.4) * 0.1 + (Math.random() - 0.5) * 0.08));
  const nextInv = Math.max(0.15, Math.min(0.38, 0.26 + Math.cos(i * 0.5) * 0.06 + (Math.random() - 0.5) * 0.05));
  if (responseTimeChart) responseTimeChart.pushSeriesPoint([nextUser, nextOrder, nextPay, nextInv]);

  const elCpu = document.getElementById('liveCpuVal');
  const elMem = document.getElementById('liveMemVal');
  const elNet = document.getElementById('liveNetVal');
  if (elCpu) elCpu.innerText = `${Math.round(nextCpu)}%`;
  if (elMem) elMem.innerText = `${Math.round(nextMem)}%`;
  if (elNet) elNet.innerText = `${Math.round(nextNet)} MB/s`;

  const cpuGaugePercent = Math.round(nextCpu);
  const cpuDash = 125.66 * (1 - cpuGaugePercent / 100);
  const elCpuGauge = document.getElementById('cpuGaugeVal');
  const elCpuPath = document.getElementById('cpuGaugePath');
  if (elCpuGauge) elCpuGauge.innerText = `${cpuGaugePercent}%`;
  if (elCpuPath) elCpuPath.style.strokeDashoffset = cpuDash;

  const memGaugePercent = Math.round(nextMem);
  const memDash = 125.66 * (1 - memGaugePercent / 100);
  const elMemGauge = document.getElementById('memGaugeVal');
  const elMemPath = document.getElementById('memGaugePath');
  if (elMemGauge) elMemGauge.innerText = `${memGaugePercent}%`;
  if (elMemPath) elMemPath.style.strokeDashoffset = memDash;

  updateTopPodsLive(i);

  const miniBars = document.querySelectorAll('#miniBarChart .mini-bar');
  if (miniBars && miniBars.length > 0) {
    const randomBar = miniBars[i % miniBars.length];
    const newH = Math.max(8, Math.min(26, 16 + Math.sin(i * 0.6) * 10));
    randomBar.style.height = `${newH}px`;
  }

  if (i % 4 === 0) {
    appendRandomLiveLog();
  }
}

// Stream CI/CD Analytics Graphs
function advanceCicdLiveStream(i) {
  if (!cicdChartsInitialized) return;

  const nextDeploy = Math.max(5, Math.min(13, 8.42 + Math.sin(i * 0.4) * 1.5 + (Math.random() - 0.5)));
  if (sparkDeploy) sparkDeploy.pushDataPoint(nextDeploy);

  const nextBuild = Math.max(92, Math.min(99.5, 96.7 + Math.sin(i * 0.3) * 1.2 + (Math.random() - 0.5) * 0.6));
  if (sparkBuild) sparkBuild.pushDataPoint(nextBuild);

  const nextFailure = Math.max(1.8, Math.min(3.8, 2.31 + Math.sin(i * 0.35) * 0.4 + (Math.random() - 0.5) * 0.2));
  if (sparkFailure) sparkFailure.pushDataPoint(nextFailure);

  const nextMttr = Math.max(0.9, Math.min(2.2, 1.42 + Math.sin(i * 0.25) * 0.3 + (Math.random() - 0.5) * 0.15));
  if (sparkMttr) sparkMttr.pushDataPoint(nextMttr);

  if (buildSuccessChart) buildSuccessChart.pushDataPoint(nextBuild);
  if (changeFailureChart) changeFailureChart.pushDataPoint(nextFailure);
  if (mttrChart) mttrChart.pushDataPoint(nextMttr);

  if (deployBarChart) {
    const liveSuccess = Math.max(4, Math.min(22, Math.round(6 + Math.sin(i * 0.5) * 4 + 4)));
    const liveFailed = (i % 5 === 0) ? 1 : 0;
    deployBarChart.updateLatestDay(liveSuccess, liveFailed);
  }

  const doraDeployNum = document.querySelector('#viewCicd .dora-kpi-card:nth-child(1) .dora-big-num');
  if (doraDeployNum) doraDeployNum.textContent = nextDeploy.toFixed(2);

  const doraBuildNum = document.querySelector('#viewCicd .dora-kpi-card:nth-child(2) .dora-big-num');
  if (doraBuildNum) doraBuildNum.textContent = `${nextBuild.toFixed(1)}%`;

  const doraFailureNum = document.querySelector('#viewCicd .dora-kpi-card:nth-child(3) .dora-big-num');
  if (doraFailureNum) doraFailureNum.textContent = `${nextFailure.toFixed(2)}%`;

  const doraMttrNum = document.querySelector('#viewCicd .dora-kpi-card:nth-child(4) .dora-big-num');
  if (doraMttrNum) doraMttrNum.textContent = nextMttr.toFixed(2);
}

// Stream Infrastructure Graphs
function advanceInfraLiveStream(i) {
  if (!infraChartsInitialized) return;

  const nextCores = Math.max(10, Math.min(30, 18.4 + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 2));
  if (infraCpuChart) infraCpuChart.pushDataPoint(nextCores);

  const w1Mem = Math.max(16, Math.min(31, 28 + Math.sin(i * 0.2) * 3 + (Math.random() - 0.5)));
  const w2Mem = Math.max(14, Math.min(29, 24 + Math.cos(i * 0.2) * 2.5 + (Math.random() - 0.5)));
  if (infraMemChart) infraMemChart.pushSeriesPoint([w1Mem, w2Mem]);

  const nextIops = Math.max(1200, Math.min(4600, Math.round(3420 + Math.sin(i * 0.4) * 800 + (Math.random() - 0.5) * 400)));
  if (infraIopsChart) infraIopsChart.pushDataPoint(nextIops);

  const elCpuCores = document.getElementById('liveInfraCpuCores');
  if (elCpuCores) elCpuCores.textContent = `${nextCores.toFixed(1)} / 32 Cores`;

  const elMemGb = document.getElementById('liveInfraMemGb');
  if (elMemGb) elMemGb.textContent = `${(w1Mem + w2Mem + 26).toFixed(1)} / 128 GB`;

  const elIops = document.getElementById('liveInfraIops');
  if (elIops) elIops.textContent = `${nextIops.toLocaleString()} IOPS`;

  const elDiskIo = document.getElementById('infraDiskIo');
  if (elDiskIo) elDiskIo.textContent = `${Math.round(nextIops * 0.1)} MB/s`;

  const elNetThroughput = document.getElementById('infraNetThroughput');
  if (elNetThroughput) elNetThroughput.textContent = `${(1.2 + Math.sin(i * 0.3) * 0.3).toFixed(2)} Gbps`;
}

// Stream Applications APM Graphs
function advanceAppsLiveStream(i) {
  if (!appsChartsInitialized) return;

  const gwRate = Math.max(800, Math.min(1800, Math.round(1240 + Math.sin(i * 0.3) * 200 + (Math.random() - 0.5) * 100)));
  const userRate = Math.max(600, Math.min(1300, Math.round(890 + Math.cos(i * 0.3) * 150 + (Math.random() - 0.5) * 80)));
  const orderRate = Math.max(300, Math.min(850, Math.round(520 + Math.sin(i * 0.4) * 100 + (Math.random() - 0.5) * 50)));
  if (appsThroughputChart) appsThroughputChart.pushSeriesPoint([gwRate, userRate, orderRate]);

  const gwLat = Math.max(25, Math.min(70, Math.round(42 + Math.sin(i * 0.2) * 10 + (Math.random() - 0.5) * 5)));
  const payLat = Math.max(180, Math.min(420, Math.round(286 + Math.cos(i * 0.25) * 45 + (Math.random() - 0.5) * 20)));
  const orderLat = Math.max(220, Math.min(480, Math.round(342 + Math.sin(i * 0.3) * 50 + (Math.random() - 0.5) * 25)));
  if (appsLatencyChart) appsLatencyChart.pushSeriesPoint([orderLat, payLat, gwLat]);

  const elRate = document.getElementById('appsReqRate');
  if (elRate) elRate.textContent = `${(gwRate + userRate + orderRate).toLocaleString()} req/s`;

  const elAvgLat = document.getElementById('appsAvgLatency');
  if (elAvgLat) elAvgLat.textContent = `${Math.round((gwLat + payLat + orderLat) / 3)} ms`;

  const elErrRate = document.getElementById('appsErrRate');
  if (elErrRate) elErrRate.textContent = `${(0.06 + Math.sin(i * 0.5) * 0.03).toFixed(2)}%`;
}

// ----------------------------------------------------------------------------
// 8. Controls & User Interactions
// ----------------------------------------------------------------------------
function initControls() {
  const refreshBtn = document.getElementById('refreshBtn');
  const timeRangeBtn = document.getElementById('timeRangeBtn');
  const refreshIntervalBtn = document.getElementById('refreshIntervalBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const dashSettingsBtn = document.getElementById('dashSettingsBtn');
  const liveBadge = document.getElementById('liveBadge');

  if (liveBadge) {
    liveBadge.addEventListener('click', () => {
      isStreamingActive = !isStreamingActive;
      const textEl = document.getElementById('liveBadgeText');
      if (isStreamingActive) {
        liveBadge.classList.remove('paused');
        if (textEl) textEl.innerText = 'LIVE';
      } else {
        liveBadge.classList.add('paused');
        if (textEl) textEl.innerText = 'PAUSED';
      }
    });
  }

  refreshBtn.addEventListener('click', () => {
    triggerManualRefresh();
  });

  const timeRanges = ['Last 15 minutes', 'Last 1 hour', 'Last 3 hours', 'Last 24 hours', 'Last 7 days'];
  let currentRangeIdx = 1;
  timeRangeBtn.addEventListener('click', () => {
    currentRangeIdx = (currentRangeIdx + 1) % timeRanges.length;
    const selected = timeRanges[currentRangeIdx];
    document.getElementById('selectedTimeRange').innerText = selected;
    updateChartTimeRange(selected);
  });

  const intervals = [
    { label: '5s', sec: 5 },
    { label: '10s', sec: 10 },
    { label: '30s', sec: 30 },
    { label: '1m', sec: 60 },
    { label: 'Off', sec: 0 }
  ];
  let intervalIdx = 1;
  refreshIntervalBtn.addEventListener('click', () => {
    intervalIdx = (intervalIdx + 1) % intervals.length;
    const item = intervals[intervalIdx];
    document.getElementById('selectedInterval').innerText = item.label;
  });

  fullscreenBtn.addEventListener('click', () => {
    toggleFullscreen();
  });

  dashSettingsBtn.addEventListener('click', () => {
    openModal('settingsModal');
  });
}

function triggerManualRefresh() {
  const refreshIcon = document.querySelector('#refreshBtn .icon-svg');
  if (refreshIcon) {
    refreshIcon.classList.remove('spin-animate');
    void refreshIcon.offsetWidth;
    refreshIcon.classList.add('spin-animate');
  }

  liveTickIndex++;
  if (currentActiveView === 'overview') {
    advanceOverviewLiveStream(liveTickIndex);
  } else if (currentActiveView === 'cicd') {
    advanceCicdLiveStream(liveTickIndex);
  } else if (currentActiveView === 'infrastructure') {
    advanceInfraLiveStream(liveTickIndex);
  } else if (currentActiveView === 'applications') {
    advanceAppsLiveStream(liveTickIndex);
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function updateChartTimeRange(rangeName) {
  let labels = ['11:30', '11:45', '12:00', '12:15'];
  if (rangeName === 'Last 15 minutes') {
    labels = ['12:00', '12:05', '12:10', '12:15'];
  } else if (rangeName === 'Last 3 hours') {
    labels = ['09:30', '10:30', '11:30', '12:15'];
  } else if (rangeName === 'Last 24 hours') {
    labels = ['18:00', '00:00', '06:00', '12:15'];
  } else if (rangeName === 'Last 7 days') {
    labels = ['May 20', 'May 22', 'May 24', 'May 26'];
  }

  if (cpuChart) cpuChart.setXLabels(labels);
  if (memoryChart) memoryChart.setXLabels(labels);
  if (networkChart) networkChart.setXLabels(labels);
  if (responseTimeChart) responseTimeChart.setXLabels(labels);
  advanceOverviewLiveStream(liveTickIndex);
}

// ----------------------------------------------------------------------------
// 9. Live Logs Stream
// ----------------------------------------------------------------------------
const mockLogServices = ['payment-service', 'order-service', 'inventory-service', 'user-service', 'auth-service', 'cart-service'];
const mockLogMessages = [
  { level: 'info', msg: 'Batch event processed successfully duration=14ms' },
  { level: 'info', msg: 'Cache hit for session payload key=usr:sess:992' },
  { level: 'warn', msg: 'High thread pool saturation: 82% workers active' },
  { level: 'info', msg: 'HTTP 200 GET /healthz response latency=2ms' },
  { level: 'error', msg: 'Downstream timeout after 1500ms endpoint=/inventory/check' }
];

function appendRandomLiveLog() {
  const container = document.getElementById('lokiLogsContainer');
  if (!container) return;

  const sample = mockLogMessages[Math.floor(Math.random() * mockLogMessages.length)];
  const service = mockLogServices[Math.floor(Math.random() * mockLogServices.length)];
  
  const timeStr = getFormattedCurrentTime();

  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
    <span class="log-time">${timeStr}</span>
    <span class="log-level ${sample.level}">${sample.level.toUpperCase()}</span>
    <span class="log-service">${service}</span>
    <span class="log-msg">${sample.msg}</span>
  `;

  container.insertBefore(logEntry, container.firstChild);
  if (container.children.length > 7) {
    container.removeChild(container.lastChild);
  }
}

// ----------------------------------------------------------------------------
// 10. Modals & Drilldown Managers
// ----------------------------------------------------------------------------
function initModals() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.getElementById('linkViewAlerts')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchDashboardViewByNav('alerts');
  });
  document.getElementById('linkViewAllAlerts')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchDashboardViewByNav('alerts');
  });
  document.getElementById('cardActiveAlerts')?.addEventListener('click', () => switchDashboardViewByNav('alerts'));

  document.getElementById('linkViewLogs')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchDashboardViewByNav('logs');
  });

  document.getElementById('linkViewTrace')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchDashboardViewByNav('traces');
  });

  document.querySelectorAll('#recentAlertsBody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => switchDashboardViewByNav('alerts'));
  });

  document.getElementById('toggleLiveSimulation')?.addEventListener('change', (e) => {
    isStreamingActive = e.target.checked;
    const badge = document.getElementById('liveBadge');
    const textEl = document.getElementById('liveBadgeText');
    if (isStreamingActive) {
      badge?.classList.remove('paused');
      if (textEl) textEl.innerText = 'LIVE';
    } else {
      badge?.classList.add('paused');
      if (textEl) textEl.innerText = 'PAUSED';
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function openTraceInspector(focusedSpan) {
  document.getElementById('modalTraceId').innerText = '4f8c2a7e9b3d1a2c';
  const list = document.getElementById('modalTraceSpansList');
  list.innerHTML = '';

  jaegerSpans.forEach(span => {
    const isSelected = span.name === focusedSpan.name;
    const card = document.createElement('div');
    card.style.cssText = `
      background: ${isSelected ? '#1f293d' : '#14171d'};
      border: 1px solid ${isSelected ? '#5794f2' : '#22252b'};
      padding: 8px 12px;
      margin-bottom: 6px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    card.innerHTML = `
      <div>
        <div style="font-weight:600;color:${span.color};font-size:12px;">${span.name}</div>
        <div style="color:#8e929c;font-size:11px;font-family:monospace;">${span.method} (offset: +${span.startMs}ms)</div>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:700;color:#fff;font-family:monospace;">${span.durationMs}ms</span>
        <div style="font-size:10px;color:#73bf69;">status: 200</div>
      </div>
    `;
    list.appendChild(card);
  });

  openModal('traceModal');
}

function openLokiExplorer() {
  const list = document.getElementById('explorerLogsList');
  list.innerHTML = '';

  const sampleLogs = [
    { time: '12:15:20', level: 'info', svc: 'payment-service', msg: 'Payment processed successfully txnId=7f9e2 userId=1024' },
    { time: '12:15:19', level: 'error', svc: 'order-service', msg: 'Failed to connect to database retrying (attempt 3)' },
    { time: '12:15:18', level: 'warn', svc: 'inventory-service', msg: 'Low stock for productId=PR0123 available=5' },
    { time: '12:15:17', level: 'info', svc: 'user-service', msg: 'User logged in successfully userId=1024' },
    { time: '12:15:16', level: 'error', svc: 'notification-service', msg: 'Email delivery failed userId=1024' },
    { time: '12:15:14', level: 'info', svc: 'api-gateway', msg: 'GET /api/v1/health status=200 duration=1.2ms' },
    { time: '12:15:10', level: 'warn', svc: 'payment-service', msg: 'Payment gateway roundtrip exceeded SLA threshold: 420ms' },
    { time: '12:15:05', level: 'info', svc: 'auth-service', msg: 'Issued JWT bearer token for userId=1024 expires=3600' }
  ];

  sampleLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-entry';
    item.innerHTML = `
      <span class="log-time">${log.time}</span>
      <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
      <span class="log-service">${log.svc}</span>
      <span class="log-msg">${log.msg}</span>
    `;
    list.appendChild(item);
  });

  openModal('logModal');
}

// ----------------------------------------------------------------------------
// 11. System Clock Controller (NEVER STATIC - LIVE TICKING EVERY SECOND)
// ----------------------------------------------------------------------------
let simulatedSeconds = 12 * 3600 + 15 * 60 + 20;
let useRealWorldTime = false;

function initClock() {
  updateClockDisplay();

  setInterval(() => {
    simulatedSeconds++;
    updateClockDisplay();
  }, 1000);

  const clockContainer = document.querySelector('.clock-container');
  if (clockContainer) {
    clockContainer.title = "Click to toggle between Simulated Cluster Time & Real Local Time";
    clockContainer.addEventListener('click', () => {
      useRealWorldTime = !useRealWorldTime;
      updateClockDisplay();
    });
  }
}

function getFormattedCurrentTime() {
  if (useRealWorldTime) {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  } else {
    const totalSec = simulatedSeconds % (24 * 3600);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

function updateClockDisplay() {
  const timeEl = document.getElementById('systemClockTime');
  const dateEl = document.getElementById('systemClockDate');
  if (!timeEl || !dateEl) return;

  if (useRealWorldTime) {
    const now = new Date();
    timeEl.innerText = now.toLocaleTimeString('en-US', { hour12: true });
    dateEl.innerText = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } else {
    const totalSec = simulatedSeconds % (24 * 3600);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const strHrs = String(displayHrs).padStart(2, '0');
    const strMins = String(mins).padStart(2, '0');
    const strSecs = String(secs).padStart(2, '0');

    timeEl.innerText = `${strHrs}:${strMins}:${strSecs} ${ampm}`;
    dateEl.innerText = 'May 26, 2025';
  }
}

// ----------------------------------------------------------------------------
// 12. Sidebar Navigation & View Switching (Supports 8 Dedicated Dashboards)
// ----------------------------------------------------------------------------
function setupSidebarNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      if (view === 'settings') {
        openModal('settingsModal');
        return;
      }
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      switchDashboardView(view);
    });
  });
}

function switchDashboardViewByNav(view) {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(n => {
    if (n.getAttribute('data-view') === view) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });
  switchDashboardView(view);
}

function switchDashboardView(view) {
  const views = {
    'overview': document.getElementById('viewOverview'),
    'infrastructure': document.getElementById('viewInfra'),
    'applications': document.getElementById('viewApps'),
    'cicd': document.getElementById('viewCicd'),
    'logs': document.getElementById('viewLogs'),
    'traces': document.getElementById('viewTraces'),
    'alerts': document.getElementById('viewAlerts'),
    'reports': document.getElementById('viewReports')
  };

  const titles = {
    'overview': 'DevOps Observability Dashboard',
    'infrastructure': 'Infrastructure Monitoring Dashboard',
    'applications': 'Application Performance Monitoring (APM)',
    'cicd': 'CI/CD Analytics Dashboard',
    'logs': 'Loki Log Explorer & Live Tail (Production Namespace)',
    'traces': 'Jaeger Distributed Traces Explorer',
    'alerts': 'Observability Alerts & Incident Management',
    'reports': 'Observability & SLA Reports Hub'
  };

  const titleEl = document.getElementById('dashboardTitle');
  const wrapper = document.querySelector('.main-wrapper');

  if (view === 'settings') {
    openModal('settingsModal');
    return;
  }

  // Hide all views first
  for (const v of Object.values(views)) {
    if (v) v.style.display = 'none';
  }

  if (views[view]) {
    currentActiveView = view;
    views[view].style.display = 'flex';
    if (titleEl && titles[view]) titleEl.innerText = titles[view];
    if (wrapper) wrapper.scrollTop = 0;

    setTimeout(() => {
      if (view === 'overview') {
        if (cpuChart) cpuChart.resize();
        if (memoryChart) memoryChart.resize();
        if (networkChart) networkChart.resize();
        if (responseTimeChart) responseTimeChart.resize();
      } else if (view === 'infrastructure') {
        initInfraCharts();
        if (infraCpuChart) infraCpuChart.resize();
        if (infraMemChart) infraMemChart.resize();
        if (infraIopsChart) infraIopsChart.resize();
      } else if (view === 'applications') {
        initAppsCharts();
        if (appsThroughputChart) appsThroughputChart.resize();
        if (appsLatencyChart) appsLatencyChart.resize();
      } else if (view === 'cicd') {
        initCicdAnalyticsCharts();
        if (deployBarChart) deployBarChart.resize();
        if (buildSuccessChart) buildSuccessChart.resize();
        if (changeFailureChart) changeFailureChart.resize();
        if (mttrChart) mttrChart.resize();
        if (sparkDeploy) sparkDeploy.resize();
        if (sparkBuild) sparkBuild.resize();
        if (sparkFailure) sparkFailure.resize();
        if (sparkMttr) sparkMttr.resize();
      } else if (view === 'logs') {
        initLogsPage();
        if (logsVolumeChart) logsVolumeChart.resize();
      } else if (view === 'traces') {
        initTracesPage();
      } else if (view === 'alerts') {
        initAlertsPage();
      }
    }, 40);
  }
}

// ----------------------------------------------------------------------------
// 13. Logs Page Controller (Loki Log Explorer & Live Tail)
// ----------------------------------------------------------------------------
let logsPageInitialized = false;
let logsVolumeChart;
let isLogsLiveTailActive = true;
let currentLogLevelFilter = 'ALL';
let currentLogSearchFilter = '';

const masterLogsList = [
  { time: '12:15:20', level: 'info', svc: 'payment-service', msg: 'Payment processed successfully txnId=7f9c2 userId=1024 duration=42ms', labels: { pod: 'payment-service-7f9c8', node: 'k8s-node-worker-01', status: '200', trace_id: '4f8c2a7e9b3d1a2c' } },
  { time: '12:15:19', level: 'error', svc: 'order-service', msg: 'Failed to connect to database retrying (attempt 3)', labels: { pod: 'order-service-5d6c7', node: 'k8s-node-worker-02', error: 'dial tcp 10.244.2.14:5432: i/o timeout', stacktrace: 'at DatabasePool.connect (/app/db.js:84)\n    at OrderHandler.create (/app/routes.js:142)' } },
  { time: '12:15:18', level: 'warn', svc: 'inventory-service', msg: 'Low stock for productId=PR0123 available=5 threshold=10', labels: { pod: 'inventory-service-6c8d9', node: 'k8s-node-worker-03', remaining: '5', item_sku: 'PR0123' } },
  { time: '12:15:17', level: 'info', svc: 'user-service', msg: 'User logged in successfully userId=1024 auth_provider=google', labels: { pod: 'user-service-6b7d8', node: 'k8s-node-worker-01', client_ip: '192.168.1.105' } },
  { time: '12:15:16', level: 'error', svc: 'notification-service', msg: 'Email delivery failed userId=1024 error=SMTP_CONN_REFUSED', labels: { pod: 'notification-service-7d8e9', node: 'k8s-node-worker-02', smtp_host: 'smtp.internal:587' } },
  { time: '12:15:14', level: 'info', svc: 'api-gateway', msg: 'GET /api/v1/health status=200 duration=1.2ms', labels: { pod: 'api-gateway-3f2d1', node: 'k8s-node-worker-01', http_code: '200' } },
  { time: '12:15:10', level: 'warn', svc: 'payment-service', msg: 'Payment gateway roundtrip exceeded SLA threshold: 420ms (SLA=200ms)', labels: { pod: 'payment-service-7f9c8', upstream: 'stripe.com', latency_ms: '420' } },
  { time: '12:15:05', level: 'info', svc: 'auth-service', msg: 'Issued JWT bearer token for userId=1024 expires_in=3600s', labels: { pod: 'auth-service-9a1b2', token_type: 'Bearer' } }
];

function initLogsPage() {
  if (logsPageInitialized) return;
  logsPageInitialized = true;

  initLogsVolumeChart();
  renderLogsFeed();

  // Filter Pills
  document.querySelectorAll('.log-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLogLevelFilter = btn.getAttribute('data-level');
      renderLogsFeed();
    });
  });

  // Text search
  const searchInput = document.getElementById('logsTextSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentLogSearchFilter = e.target.value.toLowerCase();
      renderLogsFeed();
    });
  }

  // Live tail toggle
  const tailBtn = document.getElementById('logsLiveTailBtn');
  const tailText = document.getElementById('logsLiveTailText');
  if (tailBtn) {
    tailBtn.addEventListener('click', () => {
      isLogsLiveTailActive = !isLogsLiveTailActive;
      if (isLogsLiveTailActive) {
        tailBtn.classList.remove('paused');
        if (tailText) tailText.innerText = 'LIVE TAIL';
      } else {
        tailBtn.classList.add('paused');
        if (tailText) tailText.innerText = 'PAUSED';
      }
    });
  }

  // Clear feed
  document.getElementById('clearLogStreamBtn')?.addEventListener('click', () => {
    masterLogsList.length = 0;
    renderLogsFeed();
  });

  // Run Query
  document.getElementById('pageRunLogQueryBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('pageRunLogQueryBtn');
    btn.innerHTML = `<span style="color:#5794f2;">&#9696;</span> Executing...`;
    setTimeout(() => {
      btn.innerHTML = `<span style="color:#73bf69;font-size:12px;">&#9654;</span> Run Query`;
      renderLogsFeed();
    }, 400);
  });
}

function initLogsVolumeChart() {
  if (logsVolumeChart) return;
  const initialPoints = [12, 15, 14, 18, 22, 19, 16, 25, 29, 21, 18, 14, 20, 24, 28, 31, 23, 19, 16, 18];
  logsVolumeChart = new GrafanaChart('chartLogsVolume', {
    yMin: 0,
    yMax: 40,
    yUnit: 'eps',
    yTicks: [0, 10, 20, 30, 40],
    xLabels: ['11:30', '11:45', '12:00', '12:15'],
    lineColor: '#5794f2',
    fillColor: 'rgba(87, 148, 242, 0.15)',
    showLivePulse: true,
    data: initialPoints
  });
}

function renderLogsFeed() {
  const container = document.getElementById('pageLogsTerminalList');
  if (!container) return;
  container.innerHTML = '';

  const filtered = masterLogsList.filter(log => {
    const matchesLevel = currentLogLevelFilter === 'ALL' || log.level.toUpperCase() === currentLogLevelFilter;
    const matchesSearch = !currentLogSearchFilter || 
      log.msg.toLowerCase().includes(currentLogSearchFilter) || 
      log.svc.toLowerCase().includes(currentLogSearchFilter);
    return matchesLevel && matchesSearch;
  });

  const countEl = document.getElementById('logStreamCount');
  if (countEl) countEl.innerText = `${filtered.length} entries`;

  filtered.forEach((log, idx) => {
    const row = document.createElement('div');
    row.className = 'log-line-row';
    
    let badgeColor = '#5794f2';
    if (log.level === 'warn') badgeColor = '#ff9830';
    if (log.level === 'error') badgeColor = '#f2495c';

    row.innerHTML = `
      <div class="log-line-main">
        <span style="color:#8e929c;flex-shrink:0;">${log.time}</span>
        <span class="badge" style="background:rgba(255,255,255,0.06);color:${badgeColor};border:1px solid ${badgeColor};padding:0 5px;font-size:10px;font-weight:700;flex-shrink:0;">${log.level.toUpperCase()}</span>
        <span style="color:#82b1ff;font-weight:600;flex-shrink:0;">${log.svc}</span>
        <span style="color:#cfd3db;word-break:break-all;">${log.msg}</span>
      </div>
      <div class="log-labels-drawer" style="display:none;" id="logDrawer_${idx}">
        <div style="font-weight:700;color:#fff;margin-bottom:2px;">Structured JSON Labels:</div>
        <div>cluster: <span style="color:#73bf69;">prod-cluster</span> | namespace: <span style="color:#5794f2;">production</span></div>
        ${Object.entries(log.labels || {}).map(([k, v]) => `<div>${k}: <span style="color:#e0e0e0;">${v}</span></div>`).join('')}
      </div>
    `;

    row.addEventListener('click', () => {
      const drawer = row.querySelector('.log-labels-drawer');
      if (drawer) {
        const isHidden = drawer.style.display === 'none';
        drawer.style.display = isHidden ? 'flex' : 'none';
        row.classList.toggle('expanded', isHidden);
      }
    });

    container.appendChild(row);
  });
}

function advanceLogsLiveStream(i) {
  if (!isLogsLiveTailActive || !logsPageInitialized) return;

  const nextVol = Math.max(8, Math.min(38, Math.round(18 + Math.sin(i * 0.4) * 8 + (Math.random() - 0.5) * 6)));
  if (logsVolumeChart) logsVolumeChart.pushDataPoint(nextVol);

  const ingestEl = document.getElementById('logsIngestRate');
  if (ingestEl) ingestEl.innerText = `${(12 + Math.sin(i * 0.3) * 3 + Math.random()).toFixed(1)} logs/s`;

  if (i % 2 === 0) {
    const services = ['api-gateway', 'payment-service', 'order-service', 'user-service', 'inventory-service'];
    const chosenSvc = services[Math.floor(Math.random() * services.length)];
    const levels = ['info', 'info', 'info', 'warn', 'error'];
    const chosenLevel = levels[Math.floor(Math.random() * levels.length)];

    const msgs = {
      'api-gateway': `GET /api/v1/status client_ip=10.244.0.18 duration=${Math.round(15 + Math.random()*25)}ms status=200`,
      'payment-service': `Processed stripe authorization capture txnId=txn_${Math.random().toString(36).substring(7)} amount=$${(Math.random()*150).toFixed(2)}`,
      'order-service': `Order state updated: ORDER_CONFIRMED orderId=${Math.floor(10000 + Math.random()*90000)}`,
      'user-service': `Session heartbeat verified userId=${Math.floor(1000 + Math.random()*5000)} tokenValid=true`,
      'inventory-service': `Cached stock reservation TTL refreshed key=item_stock_${Math.floor(Math.random()*100)}`
    };

    const newLog = {
      time: getFormattedCurrentTime(),
      level: chosenLevel,
      svc: chosenSvc,
      msg: msgs[chosenSvc] || 'Service health check passed',
      labels: {
        pod: `${chosenSvc}-${Math.random().toString(36).substring(7)}`,
        node: 'k8s-node-worker-01',
        trace_id: Math.random().toString(36).substring(2, 18)
      }
    };

    masterLogsList.unshift(newLog);
    if (masterLogsList.length > 60) masterLogsList.pop();

    renderLogsFeed();
  }
}

// ----------------------------------------------------------------------------
// 14. Traces Page Controller (Jaeger Distributed Tracing)
// ----------------------------------------------------------------------------
let tracesPageInitialized = false;

const sampleTraces = [
  {
    id: '4f8c2a7e9b3d1a2c',
    root: 'api-gateway',
    op: 'POST /api/v1/checkout/process',
    duration: '912ms',
    durationMs: 912,
    status: '200 OK',
    isError: false,
    spansCount: 5,
    time: '12:15:20',
    spans: [
      { name: 'api-gateway', op: 'POST /api/v1/checkout/process', startMs: 0, durationMs: 912, color: '#73bf69', method: 'HTTP POST', tags: { 'http.method': 'POST', 'http.status_code': 200, 'component': 'gin-gonic', 'peer.ip': '10.244.0.18' } },
      { name: 'user-service', op: 'GET /api/v1/users/auth', startMs: 45, durationMs: 215, color: '#5794f2', method: 'gRPC UserAuth', tags: { 'rpc.system': 'grpc', 'rpc.service': 'UserService', 'auth.verified': 'true' } },
      { name: 'order-service', op: 'POST /orders/create', startMs: 270, durationMs: 342, color: '#ff9830', method: 'gRPC OrderCreate', tags: { 'db.system': 'postgresql', 'db.statement': 'INSERT INTO orders ...' } },
      { name: 'inventory-service', op: 'POST /inventory/reserve', startMs: 310, durationMs: 178, color: '#b877d9', method: 'gRPC ReserveStock', tags: { 'stock.reserved': 'true', 'warehouse': 'eu-central-1' } },
      { name: 'payment-service', op: 'POST /payments/charge', startMs: 615, durationMs: 286, color: '#00d2d3', method: 'HTTP StripeCharge', tags: { 'http.url': 'https://api.stripe.com/v1/charges', 'payment.gateway': 'stripe' } }
    ]
  },
  {
    id: '9a1b4c3d2e5f8g7h',
    root: 'order-service',
    op: 'POST /api/v1/orders/create',
    duration: '420ms',
    durationMs: 420,
    status: '201 Created',
    isError: false,
    spansCount: 4,
    time: '12:14:48',
    spans: [
      { name: 'order-service', op: 'POST /api/v1/orders/create', startMs: 0, durationMs: 420, color: '#ff9830', method: 'HTTP POST', tags: { 'http.method': 'POST', 'http.status_code': 201, 'db.pool': 'primary' } },
      { name: 'inventory-service', op: 'GET /inventory/check', startMs: 50, durationMs: 140, color: '#b877d9', method: 'gRPC StockCheck', tags: { 'items.checked': 2 } },
      { name: 'payment-service', op: 'POST /payments/verify', startMs: 200, durationMs: 180, color: '#00d2d3', method: 'gRPC CardVerify', tags: { 'card.valid': 'true' } },
      { name: 'notification-service', op: 'POST /notify/order-created', startMs: 380, durationMs: 40, color: '#73bf69', method: 'Async Event', tags: { 'queue': 'orders.events' } }
    ]
  },
  {
    id: '7f8a9b0c1d2e3f4a',
    root: 'payment-service',
    op: 'POST /api/v1/payments/stripe/charge',
    duration: '1,420ms',
    durationMs: 1420,
    status: '504 Timeout',
    isError: true,
    spansCount: 3,
    time: '12:13:15',
    spans: [
      { name: 'payment-service', op: 'POST /api/v1/payments/stripe/charge', startMs: 0, durationMs: 1420, color: '#f2495c', method: 'HTTP POST', tags: { 'http.status_code': 504, 'error': 'Gateway Timeout' } },
      { name: 'payment-service', op: 'TCP Connect api.stripe.com:443', startMs: 10, durationMs: 1390, color: '#ff9830', method: 'TLS Handshake', tags: { 'tls.handshake_timeout': 'true' } },
      { name: 'notification-service', op: 'POST /alerts/slack', startMs: 1400, durationMs: 20, color: '#73bf69', method: 'Webhook', tags: { 'channel': '#ops-critical' } }
    ]
  }
];

let activeTrace = sampleTraces[0];

function initTracesPage() {
  if (tracesPageInitialized) return;
  tracesPageInitialized = true;

  renderTracesList();
  renderTraceWaterfall(activeTrace);

  document.getElementById('findTracesBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('findTracesBtn');
    btn.innerHTML = `<span style="color:#5794f2;">&#9696;</span> Searching...`;
    setTimeout(() => {
      btn.innerHTML = `<span>&#9737;</span> Search Traces`;
      renderTracesList();
    }, 300);
  });
}

function renderTracesList() {
  const container = document.getElementById('tracesScrollList');
  if (!container) return;
  container.innerHTML = '';

  sampleTraces.forEach(trace => {
    const card = document.createElement('div');
    card.className = `trace-card-item ${trace.id === activeTrace.id ? 'active' : ''}`;
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:monospace;font-size:11.5px;font-weight:700;color:${trace.isError ? '#f2495c' : '#5794f2'};">${trace.id}</span>
        <span class="${trace.isError ? 'badge badge-critical' : 'badge-ready'}" style="font-size:10px;">${trace.status}</span>
      </div>
      <div style="font-size:11.5px;color:#cfd3db;font-weight:600;">${trace.root} &rarr; <span style="color:#8e929c;">${trace.op}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#8e929c;">
        <span>${trace.spansCount} spans</span>
        <span style="font-weight:700;color:${trace.durationMs > 800 ? '#ff9830' : '#73bf69'};">${trace.duration}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.trace-card-item').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeTrace = trace;
      renderTraceWaterfall(trace);
    });

    container.appendChild(card);
  });
}

function renderTraceWaterfall(trace) {
  const idEl = document.getElementById('activeWaterfallTraceId');
  const durEl = document.getElementById('activeTraceTotalDuration');
  const statusEl = document.getElementById('activeTraceStatus');
  const spansList = document.getElementById('pageTraceSpansList');

  if (idEl) idEl.innerText = trace.id;
  if (durEl) durEl.innerText = trace.duration;
  if (statusEl) {
    statusEl.innerText = trace.status;
    statusEl.className = trace.isError ? 'badge badge-critical' : 'badge-ready';
  }

  if (!spansList) return;
  spansList.innerHTML = '';

  const maxDuration = Math.max(1000, trace.durationMs);

  trace.spans.forEach((span) => {
    const row = document.createElement('div');
    row.className = 'page-span-row';

    const leftPercent = (span.startMs / maxDuration) * 100;
    const widthPercent = Math.max(3, (span.durationMs / maxDuration) * 100);

    row.innerHTML = `
      <div style="width:160px;min-width:160px;display:flex;align-items:center;gap:6px;overflow:hidden;">
        <span style="width:8px;height:8px;border-radius:2px;background:${span.color};flex-shrink:0;"></span>
        <span style="font-weight:600;color:${span.color};font-size:11.5px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">${span.name}</span>
      </div>
      <div style="flex:1;position:relative;height:24px;display:flex;align-items:center;padding:0 4px;background:rgba(255,255,255,0.02);border-radius:3px;">
        <div style="position:absolute;left:${leftPercent}%;width:${widthPercent}%;height:14px;background:${span.color};border-radius:2px;opacity:0.85;transition:all 0.2s ease;"></div>
        <span style="position:absolute;left:calc(${leftPercent}% + ${widthPercent}% + 8px);font-size:11px;font-family:monospace;color:#cfd3db;font-weight:600;">${span.durationMs}ms</span>
      </div>
    `;

    row.addEventListener('click', () => {
      inspectSpanDetails(span);
    });

    spansList.appendChild(row);
  });

  if (trace.spans.length > 0) inspectSpanDetails(trace.spans[0]);
}

function inspectSpanDetails(span) {
  const svcEl = document.getElementById('inspectSpanService');
  const opEl = document.getElementById('inspectSpanOp');
  const durEl = document.getElementById('inspectSpanDuration');
  const tagsGrid = document.getElementById('inspectSpanTagsGrid');

  if (svcEl) svcEl.innerText = span.name;
  if (opEl) opEl.innerText = span.op;
  if (durEl) {
    durEl.innerText = `${span.durationMs}ms`;
    durEl.style.color = span.color;
  }

  if (tagsGrid && span.tags) {
    tagsGrid.innerHTML = Object.entries(span.tags).map(([k, v]) => `
      <div class="span-tag-item">
        <span class="tag-k">${k}</span>
        <span class="tag-v">${v}</span>
      </div>
    `).join('');
  }
}

// ----------------------------------------------------------------------------
// 15. Alerts Page Controller (Prometheus Alertmanager)
// ----------------------------------------------------------------------------
function initAlertsPage() {
  // Bound dynamically
}

function ackAlertRow(btn) {
  btn.innerText = 'Acked';
  btn.style.color = '#73bf69';
  btn.disabled = true;
  const row = btn.closest('tr');
  if (row) {
    const stateCell = row.querySelector('.status-firing');
    if (stateCell) {
      stateCell.innerText = 'Acked';
      stateCell.className = 'badge-ready';
    }
  }
}

function silenceAlertRow(btn) {
  btn.innerText = 'Silenced (1h)';
  btn.disabled = true;
  const row = btn.closest('tr');
  if (row) {
    row.style.opacity = '0.4';
  }
}
