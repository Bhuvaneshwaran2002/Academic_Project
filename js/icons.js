// SVG Icon library for Grafana DevOps Observability Dashboard
const ICONS = {
  grafanaLogo: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-svg">
    <path d="M19.98 2C10.05 2 2 10.05 2 19.98c0 7.82 5.01 14.48 12.01 16.89-.13-.71-.24-1.63-.03-2.39.22-.8.88-2.6 1.34-3.87-.27-.55-.44-1.28-.44-2.09 0-1.85 1.07-3.23 2.41-3.23 1.13 0 1.68.85 1.68 1.88 0 1.14-.73 2.85-1.1 4.43-.31 1.33.67 2.41 1.98 2.41 2.38 0 3.99-3.05 3.99-6.68 0-2.76-1.86-4.83-5.24-4.83-4 0-6.52 2.98-6.52 6.34 0 1.15.39 1.96.99 2.68.28.33.32.47.23.82-.08.31-.26 1.04-.33 1.34-.11.45-.44.61-.82.43-2.31-1.07-3.38-3.93-3.38-6.33 0-4.69 3.95-10.33 11.83-10.33 6.31 0 10.49 4.56 10.49 9.53 0 6.51-3.62 11.36-8.94 11.36-1.8 0-3.49-.97-4.07-2.08l-1.1 4.41c-.4 1.54-1.48 3.47-2.21 4.64C18.3 37.89 19.13 38 20 38c9.93 0 18-8.07 18-18S29.93 2 19.98 2z" fill="#F46800"/>
    <circle cx="20" cy="20" r="4.5" fill="#FF8833"/>
  </svg>`,

  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  
  infrastructure: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  
  applications: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  
  logs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  
  traces: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  
  alerts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
  
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg chevron"><polyline points="6 9 12 15 18 9"/></svg>`,
  
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,

  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

  checkCircle: `<svg viewBox="0 0 24 24" fill="none" class="icon-svg"><circle cx="12" cy="12" r="11" fill="#73BF69"/><path d="M7 12.5l3.5 3.5 7-7" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  cube: `<svg viewBox="0 0 24 24" fill="none" class="icon-svg"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#205493" stroke="#5794F2" stroke-width="1.5"/><path d="M12 12L3 7m9 5v10m0-10l9-5" stroke="#5794F2" stroke-width="1.5"/><path d="M12 2l9 5-9 5-9-5 9-5z" fill="#5794F2" fill-opacity="0.3"/></svg>`,

  server: `<svg viewBox="0 0 24 24" fill="none" stroke="#5794F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,

  syncArrows: `<svg viewBox="0 0 24 24" fill="none" stroke="#5794F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,

  nodes: `<svg viewBox="0 0 24 24" fill="none" stroke="#5794F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,

  code: `<svg viewBox="0 0 24 24" fill="none" stroke="#5794F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,

  gearSuccess: `<svg viewBox="0 0 24 24" fill="none" stroke="#73BF69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,

  flask: `<svg viewBox="0 0 24 24" fill="none" stroke="#73BF69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>`,

  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="#73BF69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,

  // Tech stack logos
  kubernetes: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><path d="M11.968 2L3 7.177v10.354L11.968 22l8.97-4.469V7.177L11.968 2zm-.03 2.115l6.762 3.904-2.585 1.493-4.177-2.411-4.178 2.411-2.584-1.493 6.762-3.904zm-7.07 5.753l2.584 1.492v4.823l-2.584 1.493V9.868zm8.07 10.05l-4.177-2.412 2.584-1.492 1.593.92 1.593-.92 2.584 1.492-4.177 2.412zm-3.176-5.498l1.583-.914v-2.02l-1.583-.914-1.75 1.01 1.75 2.838zm4.767 0l1.75-2.838-1.75-1.01-1.583.914v2.02l1.583.914zm3.903-1.04v-4.823l2.584-1.492v7.808l-2.584-1.493z" fill="#326CE5"/></svg>`,

  warningTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="#FF9830" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,

  clockReload: `<svg viewBox="0 0 24 24" fill="none" stroke="#B877D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><polyline points="12 7 12 12 15 15"/></svg>`,

  xCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="#F2495C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,

  prometheus: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><circle cx="12" cy="12" r="10" stroke="#E6522C" stroke-width="1.8"/><path d="M12 4.5c0 3-3 4.5-3 7.5a3 3 0 0 0 6 0c0-3-3-4.5-3-7.5z" fill="#E6522C"/><circle cx="12" cy="12" r="1.5" fill="#fff"/></svg>`,

  loki: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><rect x="3" y="15" width="18" height="4" rx="1" fill="#F59E0B"/><path d="M5 14l2-8 3 4 2-6 3 5 4-5v10H5z" fill="#FBBF24"/><rect x="6" y="17" width="12" height="2" rx="0.5" fill="#D97706"/></svg>`,

  jaeger: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><ellipse cx="12" cy="13" rx="7" ry="8" fill="#60D1E6"/><circle cx="9" cy="11" r="2.2" fill="#fff"/><circle cx="15" cy="11" r="2.2" fill="#fff"/><circle cx="9.5" cy="11" r="1.1" fill="#1C3F53"/><circle cx="14.5" cy="11" r="1.1" fill="#1C3F53"/><path d="M11 15h2v2h-2z" fill="#fff"/><ellipse cx="12" cy="14" rx="1.5" ry="1" fill="#1C3F53"/><path d="M7 6l2 2m8-2l-2 2" stroke="#60D1E6" stroke-width="1.8" stroke-linecap="round"/></svg>`,

  opentelemetry: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><circle cx="12" cy="12" r="9" stroke="#425CC7" stroke-width="2"/><path d="M7 16l4-5 3 2 4-5" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="8" r="1.5" fill="#425CC7"/><circle cx="7" cy="16" r="1.5" fill="#425CC7"/></svg>`,

  githubActions: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><circle cx="12" cy="12" r="9.5" stroke="#2088FF" stroke-width="1.5" fill="#161B22"/><path d="M8 12a4 4 0 0 1 8 0v2a2 2 0 0 1-2 2h-1" stroke="#2088FF" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="12" r="1.8" fill="#2088FF"/><circle cx="16" cy="12" r="1.8" fill="#5794F2"/><circle cx="13" cy="16" r="1.5" fill="#2088FF"/></svg>`,

  docker: `<svg viewBox="0 0 24 24" fill="none" class="brand-logo"><rect x="5" y="11" width="2" height="2" fill="#2496ED"/><rect x="8" y="11" width="2" height="2" fill="#2496ED"/><rect x="11" y="11" width="2" height="2" fill="#2496ED"/><rect x="8" y="8" width="2" height="2" fill="#2496ED"/><rect x="11" y="8" width="2" height="2" fill="#2496ED"/><rect x="14" y="11" width="2" height="2" fill="#2496ED"/><path d="M22 12.5c-.5-.2-1.5-.2-2.2.3-.4-.5-1-.8-1.8-.8-1.5 0-3 1-3.5 2H2.5c-.3 1 0 3 1.5 4.5 2 2 5.5 2 10.5 2 5.5 0 8.5-3.5 8.5-7.5 0-.2 0-.3-.1-.5h-.9z" fill="#2496ED"/></svg>`,

  aws: `<svg viewBox="0 0 32 20" fill="none" class="brand-logo-wide"><path d="M10.8 10.4c0-1.4-.8-2-2.3-2-.9 0-1.7.3-2.3.8l-.5-1.1c.8-.6 1.8-1 3.1-1 2.3 0 3.6 1.1 3.6 3.3v4.7c0 .5.1.9.3 1.2h-1.5c-.1-.2-.2-.5-.3-.9-.6.7-1.5 1.1-2.5 1.1-1.7 0-2.8-1.1-2.8-2.6 0-1.8 1.4-2.6 3.6-2.6h1.1v-.9zm0 1.9h-1c-1.3 0-2.1.5-2.1 1.5 0 .9.6 1.4 1.5 1.4 1 0 1.6-.7 1.6-1.7v-1.2zm6.2-5h1.7l1.7 6.4 1.7-6.4h1.7l-2.4 8h-1.8l-1.6-6-1.7 6h-1.8l-2.5-8h1.8l1.7 6.4 1.6-6.4zm10.7 2.3c-.7-.4-1.6-.7-2.5-.7-1 0-1.6.4-1.6.9 0 .6.5.8 1.5 1.1 1.6.4 2.7 1.1 2.7 2.5 0 1.6-1.3 2.6-3.2 2.6-1.1 0-2.2-.4-2.9-1l.6-1.2c.7.5 1.5.9 2.4.9 1 0 1.5-.4 1.5-1 0-.6-.5-.8-1.5-1.1-1.6-.4-2.7-1-2.7-2.4 0-1.5 1.2-2.5 3-2.5 1 0 1.9.3 2.5.7l-.8 1.2z" fill="#fff"/><path d="M5 16.5c4 2.5 12 3 19-1.5" stroke="#FF9900" stroke-width="1.8" stroke-linecap="round"/><path d="M24 15l2 1-1.8 1.5" fill="#FF9900"/></svg>`
};

