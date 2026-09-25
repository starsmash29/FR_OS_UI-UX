import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface DashboardViewProps {
  onNavigate: (view: ViewId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [filterMode, setFilterMode] = useState<'filtering' | 'passive'>('filtering');
  const [bypassActive, setBypassActive] = useState(false);
  const [timeWindow, setTimeWindow] = useState<'live' | '1h' | '24h' | '7d'>('live');
  const [selectedInterface, setSelectedInterface] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [restartingDaemon, setRestartingDaemon] = useState<string | null>(null);

  // Daemons state
  const [daemons, setDaemons] = useState([
    { id: 'ebpf', name: 'eBPF XDP Packet Filter', detail: 'PID: 841 · Wire Fastpath · 0.4% CPU', status: 'RUNNING', badgeColor: 'secondary' },
    { id: 'suricata', name: 'Suricata / Snort Engine', detail: 'Ruleset v2.6 · 481k signatures · 2.1% CPU', status: 'RUNNING', badgeColor: 'secondary' },
    { id: 'coredns', name: 'CoreDNS Sinkhole Resolver', detail: 'Port 53 · 0.2ms resolution cache · DoH Active', status: 'RUNNING', badgeColor: 'secondary' },
    { id: 'wireguard', name: 'WireGuard Site-to-Site Gateway', detail: 'wg0 interface · 4 connected peers', status: 'ACTIVE', badgeColor: 'secondary' },
    { id: 'duckdb', name: 'DuckDB Telemetry & Analytics DB', detail: 'Embedded WAL · 412 MB store size', status: 'HEALTHY', badgeColor: 'secondary' },
  ]);

  const handleRestartDaemon = (id: string) => {
    setRestartingDaemon(id);
    setTimeout(() => {
      setRestartingDaemon(null);
    }, 1200);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Timestamp,Inbound_Mbps,Outbound_Mbps,Packets_pps,Drops_pps\n" +
      "14:23:00,618.2,224.4,94200,0\n" +
      "14:23:15,680.1,210.3,95400,0\n" +
      "14:23:30,712.4,198.5,98100,0\n" +
      "14:23:45,742.0,198.5,99200,0\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fros_traffic_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-margin py-margin flex flex-col gap-space-lg">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-space-md p-space-md rounded bg-surface-container-lowest shadow-[0_4px_20px_-2px_rgba(0,0,0,0.65)]">
        <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-primary">dns</span>
          <span className="text-on-surface font-semibold">FR_OS Appliance Control</span>
          <span className="text-outline">/</span>
          <span>Global Telemetry Mesh</span>
          <span className="text-outline">/</span>
          <span className="text-secondary font-bold">Subsystem Operational</span>
        </div>
        <div className="flex items-center gap-space-md font-label-sm text-label-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="text-outline">Bypass Mode:</span>
            <span className={`font-bold uppercase ${bypassActive ? 'text-error' : 'text-secondary'}`}>
              {bypassActive ? 'ARMED [ENGAGED]' : 'ARMED [OFF]'}
            </span>
          </div>
          <div className="h-3 w-px bg-surface-variant"></div>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="text-outline">Cluster:</span>
            <span className="text-on-surface font-mono">DC-EAST-01</span>
          </div>
        </div>
      </div>

      {/* 1. Top Node Information & Action Bar */}
      <section className="flex flex-col gap-space-sm">
        {/* Notice Banner */}
        {showBanner && (
          <div className="flex items-center justify-between gap-space-md px-space-md py-space-xs rounded bg-surface-container text-on-surface shadow-sm transition-all duration-300">
            <div className="flex items-center gap-space-sm font-body-sm text-body-sm min-w-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/10 text-secondary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </span>
              <span className="font-bold text-secondary tracking-tight">Active Engine Notice:</span>
              <span className="truncate text-on-surface-variant">
                Threat database signature update v2025.04.12 loaded (481,209 rules active). All interfaces operating at wire speed.
              </span>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <span className="font-label-sm text-label-sm text-outline hidden md:inline">Sync Hash: 8f4a..09c2</span>
              <button
                onClick={() => setShowBanner(false)}
                className="p-space-xs rounded text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Node Identity & Appliance Control Row */}
        <div className="p-space-md rounded bg-surface-container-low shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          {/* Left: Identity & Specs */}
          <div className="flex flex-wrap items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="relative flex items-center justify-center w-10 h-10 rounded bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                    core-fw01.lab.internal
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-highest font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Primary GW
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
                  <span>FR_OS 2.4.1-lts</span>
                  <span className="text-outline">·</span>
                  <span className="text-outline">Kernel: 6.6.21-frfw-ebpf</span>
                  <span className="text-outline">·</span>
                  <span className="hidden sm:inline text-outline">Intel Xeon E-2336 @ 2.90GHz (8C/16T)</span>
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-surface-variant hidden md:block"></div>
            {/* Protection Pill */}
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-secondary font-label-md text-label-md">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-bold tracking-tight">ENGINE ACTIVE</span>
              <span className="text-on-surface-variant font-normal hidden lg:inline">— eBPF/XDP Accelerated</span>
            </div>
          </div>

          {/* Right: Action Toggles & Time Sync */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
              <span className="text-outline">Threat Intel:</span>
              <span className="text-on-surface font-semibold">14m ago</span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-outline">timer</span>
              <span className="text-outline">Uptime:</span>
              <span className="text-on-surface font-semibold">42d 18h 33m</span>
            </div>

            {/* Mode Toggle Group */}
            <div className="flex items-center p-0.5 rounded bg-surface-container-lowest">
              <button
                onClick={() => setFilterMode('filtering')}
                className={`px-space-sm py-space-xs rounded font-label-md text-label-md font-bold transition-all shadow-sm ${
                  filterMode === 'filtering'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Filtering
              </button>
              <button
                onClick={() => setFilterMode('passive')}
                className={`px-space-sm py-space-xs rounded font-label-md text-label-md transition-all ${
                  filterMode === 'passive'
                    ? 'bg-surface-container-high text-on-surface font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Passive
              </button>
            </div>

            {/* Bypass Trigger */}
            <button
              onClick={() => setBypassActive(b => !b)}
              className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded transition-colors font-label-md text-label-md ${
                bypassActive
                  ? 'bg-error-container text-error font-bold'
                  : 'bg-surface-container-high hover:bg-surface-bright text-tertiary hover:text-on-surface'
              }`}
              title="Force Hardware Packet Passthrough"
            >
              <span className="material-symbols-outlined text-[16px]">alt_route</span>
              <span>{bypassActive ? 'Bypass Engaged' : 'Bypass Mode'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics & Threat Summary KPI Cards (4-Column Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Active Wire Throughput */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active Wire Throughput</span>
              <div className="flex items-baseline gap-space-xs mt-space-xs">
                <span className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">842.6</span>
                <span className="font-label-md text-label-md font-semibold text-primary">Mbps</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div className="my-space-md">
            <svg className="w-full h-9 overflow-visible" fill="none" viewBox="0 0 160 36">
              <path
                className="text-primary"
                d="M0,28 L20,24 L40,30 L60,18 L80,22 L100,10 L120,16 L140,6 L160,12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <path
                className="text-primary/10"
                d="M0,28 L20,24 L40,30 L60,18 L80,22 L100,10 L120,16 L140,6 L160,12 L160,36 L0,36 Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-xs">
            <div className="flex items-center gap-space-xs text-primary font-mono">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              <span className="font-bold">618.2 Mbps</span>
              <span className="text-outline">IN</span>
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-mono">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span className="font-bold">224.4 Mbps</span>
              <span className="text-outline">OUT</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blocked Threats */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Blocked Threats (24h)</span>
              <div className="flex items-baseline gap-space-xs mt-space-xs">
                <span className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">1,428</span>
                <span className="font-label-sm text-label-sm px-space-xs rounded bg-error-container text-error font-bold">+12% vs prev</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-surface-container-high text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">gpp_bad</span>
            </div>
          </div>
          {/* Segmented Bar */}
          <div className="my-space-md">
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden flex gap-0.5">
              <div className="bg-error h-full" style={{ width: '59%' }} title="Botnets / Malware (842)"></div>
              <div className="bg-tertiary h-full" style={{ width: '29%' }} title="Parked / Suspicious (412)"></div>
              <div className="bg-primary h-full" style={{ width: '12%' }} title="Port Scans (174)"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-space-xs font-label-sm text-label-sm">
            <div>
              <div className="text-outline">Malware</div>
              <div className="font-bold text-error">842</div>
            </div>
            <div>
              <div className="text-outline">Suspicious</div>
              <div className="font-bold text-tertiary">412</div>
            </div>
            <div>
              <div className="text-outline">Scans</div>
              <div className="font-bold text-primary">174</div>
            </div>
          </div>
        </div>

        {/* Card 3: Conntrack Capacity */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Conntrack Capacity</span>
              <div className="flex items-baseline gap-space-xs mt-space-xs">
                <span className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">14,892</span>
                <span className="font-label-md text-label-md text-outline">/ 128k</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-surface-container-high text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
          </div>
          <div className="my-space-md flex flex-col gap-1">
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Table Load</span>
              <span className="text-secondary font-bold">11.6%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '11.6%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-outline">Hardware Fastpath</span>
            <div className="flex items-center gap-space-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-bold text-secondary">94.2% eBPF Offload</span>
            </div>
          </div>
        </div>

        {/* Card 4: DNS Sinkhole Activity */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">DNS Sinkhole Activity</span>
              <div className="flex items-baseline gap-space-xs mt-space-xs">
                <span className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">184,920</span>
                <span className="font-label-sm text-label-sm text-outline">Queries</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
          </div>
          <div className="my-space-md flex flex-col gap-1">
            <div className="flex justify-between font-label-sm text-label-sm">
              <span className="text-outline">Blocked / Sinkholed</span>
              <span className="text-error font-bold">38,109 (20.6%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="bg-error h-full rounded-full" style={{ width: '20.6%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-outline">Avg Query Latency</span>
            <span className="font-bold text-primary">1.4 ms (Local Cache)</span>
          </div>
        </div>
      </section>

      {/* 3. Real-Time Network Traffic Throughput Graph (Large Zenarmor-Style Panel) */}
      <section className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Real-Time Traffic Throughput
              </h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                L2/L3 Wire Rate Telemetry (eBPF Stream Socket)
              </p>
            </div>
          </div>
          {/* Time Window Selectors */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center p-0.5 rounded bg-surface-container-lowest font-label-sm text-label-sm">
              <button
                onClick={() => setTimeWindow('live')}
                className={`px-space-sm py-space-xs rounded ${
                  timeWindow === 'live' ? 'bg-surface-container-high text-primary font-bold shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                Live (60s)
              </button>
              <button
                onClick={() => setTimeWindow('1h')}
                className={`px-space-sm py-space-xs rounded ${
                  timeWindow === '1h' ? 'bg-surface-container-high text-primary font-bold shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                1 Hour
              </button>
              <button
                onClick={() => setTimeWindow('24h')}
                className={`px-space-sm py-space-xs rounded ${
                  timeWindow === '24h' ? 'bg-surface-container-high text-primary font-bold shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setTimeWindow('7d')}
                className={`px-space-sm py-space-xs rounded ${
                  timeWindow === '7d' ? 'bg-surface-container-high text-primary font-bold shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                7 Days
              </button>
            </div>
            <button
              onClick={() => setIsPaused(p => !p)}
              className={`p-space-xs rounded transition-colors ${
                isPaused ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
              title={isPaused ? "Resume Stream" : "Pause Stream"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            <button
              onClick={handleExportCsv}
              className="p-space-xs rounded bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              title="Export CSV Data"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>

        {/* Interface Filter Tags Bar */}
        <div className="flex flex-wrap items-center gap-space-xs font-label-sm text-label-sm">
          <span className="text-outline mr-space-xs">Interfaces:</span>
          {['all', 'wan0', 'lan0', 'vlan10_mgmt', 'vlan20_iot', 'vlan30_dmz'].map((iface) => (
            <button
              key={iface}
              onClick={() => setSelectedInterface(iface)}
              className={`px-space-sm py-space-xs rounded transition-colors ${
                selectedInterface === iface
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {iface === 'all' ? 'All Interfaces' : iface === 'wan0' ? 'wan0 (2.5G SFP+)' : iface === 'lan0' ? 'lan0 (10G DAC)' : iface}
            </button>
          ))}
        </div>

        {/* Vector Chart Area */}
        <div className="relative w-full h-72 sm:h-80 bg-surface-container-lowest rounded p-space-md overflow-hidden flex flex-col justify-between">
          {/* Axis Lines Grid Background */}
          <div className="absolute inset-0 flex flex-col justify-between p-space-md pointer-events-none opacity-20">
            <div className="w-full border-b border-surface-variant flex justify-between font-label-sm text-label-sm text-outline">
              <span>1.0 Gbps</span><span></span>
            </div>
            <div className="w-full border-b border-surface-variant flex justify-between font-label-sm text-label-sm text-outline">
              <span>750 Mbps</span><span></span>
            </div>
            <div className="w-full border-b border-surface-variant flex justify-between font-label-sm text-label-sm text-outline">
              <span>500 Mbps</span><span></span>
            </div>
            <div className="w-full border-b border-surface-variant flex justify-between font-label-sm text-label-sm text-outline">
              <span>250 Mbps</span><span></span>
            </div>
            <div className="w-full border-b border-surface-variant flex justify-between font-label-sm text-label-sm text-outline">
              <span>0 Mbps</span><span></span>
            </div>
          </div>

          {/* Inspection Marker & Tooltip (Hover Simulation) */}
          <div className="absolute top-12 left-2/3 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
            <div className="px-space-sm py-space-xs rounded bg-surface-container-high shadow-lg text-on-surface font-label-sm text-label-sm flex flex-col gap-0.5 border border-primary/20">
              <div className="text-outline font-normal">14:23:40 [Sample #48]</div>
              <div className="flex items-center gap-space-sm">
                <span className="text-primary font-bold">IN: 742.0 Mbps</span>
                <span className="text-secondary font-bold">OUT: 198.5 Mbps</span>
              </div>
            </div>
            <div className="w-px h-44 bg-primary/40 mt-1"></div>
          </div>

          {/* Main Dual Area Chart SVG */}
          <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 1000 240">
            <defs>
              <linearGradient id="grad-in" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="grad-out" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* INBOUND AREA (Cyan) */}
            <path
              d="M0,180 Q60,160 120,170 T240,110 T360,130 T480,70 T600,95 T720,50 T840,90 T960,65 L1000,75 L1000,240 L0,240 Z"
              fill="url(#grad-in)"
            />
            <path
              d="M0,180 Q60,160 120,170 T240,110 T360,130 T480,70 T600,95 T720,50 T840,90 T960,65 L1000,75"
              fill="none"
              stroke="#4cd7f6"
              strokeWidth="2.5"
            />
            {/* OUTBOUND AREA (Emerald) */}
            <path
              d="M0,210 Q60,205 120,200 T240,180 T360,190 T480,160 T600,175 T720,140 T840,165 T960,150 L1000,155 L1000,240 L0,240 Z"
              fill="url(#grad-out)"
            />
            <path
              d="M0,210 Q60,205 120,200 T240,180 T360,190 T480,160 T600,175 T720,140 T840,165 T960,150 L1000,155"
              fill="none"
              stroke="#4edea3"
              strokeWidth="2.5"
            />
            {/* Inspection point highlight */}
            <circle cx="666" cy="62" r="5" fill="#4cd7f6" className="shadow-md" />
            <circle cx="666" cy="148" r="5" fill="#4edea3" className="shadow-md" />
          </svg>

          {/* Bottom Timeline Axis */}
          <div className="relative z-10 flex justify-between font-label-sm text-label-sm text-outline pt-space-xs font-mono">
            <span>-60s</span>
            <span>-45s</span>
            <span>-30s</span>
            <span>-15s</span>
            <span className="text-primary font-bold">Now</span>
          </div>
        </div>

        {/* Packet Legend & Offload Health Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-md p-space-sm rounded bg-surface-container-lowest font-label-sm text-label-sm">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-sm bg-primary"></span>
              <span className="text-on-surface font-semibold">Inbound (RX):</span>
              <span className="text-primary font-bold font-mono">618.2 Mbps</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-sm bg-secondary"></span>
              <span className="text-on-surface font-semibold">Outbound (TX):</span>
              <span className="text-secondary font-bold font-mono">224.4 Mbps</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-mono">
            <div><span className="text-outline">Packets:</span> <span className="font-bold text-on-surface">94,200 pps</span></div>
            <div><span className="text-outline">Drops:</span> <span className="font-bold text-secondary">0 pps (0.00%)</span></div>
            <div><span className="text-outline">eBPF Redirect:</span> <span className="font-bold text-primary">99.8%</span></div>
          </div>
        </div>
      </section>

      {/* 4. Three Top Analytics Charts (Zenarmor 3-Column Style) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Col 1: Top Blocked Threats (24h) */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-error">security_update_warning</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Top Blocked Threats</h3>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-outline">Last 24h</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-space-md my-space-xs">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#232a36" strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ffb4ab" strokeWidth="12" strokeDasharray="100.2 238.7" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#d0bcff" strokeWidth="12" strokeDasharray="66.8 238.7" strokeDashoffset="-100.2" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#4cd7f6" strokeWidth="12" strokeDasharray="42.9 238.7" strokeDashoffset="-167" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#4edea3" strokeWidth="12" strokeDasharray="28.6 238.7" strokeDashoffset="-209.9" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">1,428</span>
                <span className="font-label-sm text-label-sm text-outline">Events</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-space-xs w-full font-label-sm text-label-sm">
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="text-on-surface">C2 / Botnets</span>
                </div>
                <span className="font-bold text-error">42% (600)</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="text-on-surface">Cryptomining</span>
                </div>
                <span className="font-bold text-tertiary">28% (400)</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-on-surface">Phishing / Scam</span>
                </div>
                <span className="font-bold text-primary">18% (257)</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="text-on-surface">Port Recon</span>
                </div>
                <span className="font-bold text-secondary">12% (171)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('threat-intel')}
            className="w-full py-space-xs rounded bg-surface-container text-center font-label-md text-label-md text-primary hover:bg-surface-container-high transition-colors"
          >
            Open Live Threat Explorer →
          </button>
        </div>

        {/* Col 2: Top Bandwidth Hosts (Ranked Meters) */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-secondary">lan</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Top Bandwidth Hosts</h3>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-outline">Today</span>
          </div>

          <div className="flex flex-col gap-space-sm font-label-sm text-label-sm">
            {/* Host 1 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-space-xs truncate">
                  <span className="text-secondary font-bold font-mono">192.168.1.140</span>
                  <span className="text-outline truncate">(backup-nas.local)</span>
                </div>
                <span className="font-bold text-on-surface shrink-0 font-mono">48.2 GB (38%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            {/* Host 2 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-space-xs truncate">
                  <span className="text-primary font-bold font-mono">192.168.1.85</span>
                  <span className="text-outline truncate">(workstation-01.local)</span>
                </div>
                <span className="font-bold text-on-surface shrink-0 font-mono">31.4 GB (25%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            {/* Host 3 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-space-xs truncate">
                  <span className="text-tertiary font-bold font-mono">192.168.20.14</span>
                  <span className="text-outline truncate">(tv-streamer-4k)</span>
                </div>
                <span className="font-bold text-on-surface shrink-0 font-mono">19.8 GB (16%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            {/* Host 4 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-space-xs truncate">
                  <span className="text-on-surface font-semibold font-mono">192.168.1.92</span>
                  <span className="text-outline truncate">(dev-server.local)</span>
                </div>
                <span className="font-bold text-on-surface shrink-0 font-mono">14.1 GB (11%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-surface-variant rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>

            {/* Host 5 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-space-xs truncate">
                  <span className="text-outline">Others (12 active clients)</span>
                </div>
                <span className="font-bold text-outline shrink-0 font-mono">12.5 GB (10%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-surface-variant/50 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('live-sessions')}
            className="w-full py-space-xs rounded bg-surface-container text-center font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors"
          >
            Inspect Host Flow Matrices →
          </button>
        </div>

        {/* Col 3: Top Application Protocols */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-tertiary">category</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Application Categories</h3>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-outline">L7 DPI</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-space-md my-space-xs">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#232a36" strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#4cd7f6" strokeWidth="12" strokeDasharray="107.4 238.7" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#4edea3" strokeWidth="12" strokeDasharray="62.0 238.7" strokeDashoffset="-107.4" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#d0bcff" strokeWidth="12" strokeDasharray="35.8 238.7" strokeDashoffset="-169.4" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ffb4ab" strokeWidth="12" strokeDasharray="21.5 238.7" strokeDashoffset="-205.2" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#869397" strokeWidth="12" strokeDasharray="12.0 238.7" strokeDashoffset="-226.7" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">126 GB</span>
                <span className="font-label-sm text-label-sm text-outline">Total L7</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-space-xs w-full font-label-sm text-label-sm">
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-on-surface">HTTPS / Web</span>
                </div>
                <span className="font-bold text-primary">45%</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="text-on-surface">Media Streams</span>
                </div>
                <span className="font-bold text-secondary">26%</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="text-on-surface">SSH / Transfers</span>
                </div>
                <span className="font-bold text-tertiary">15%</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="text-on-surface">Cloud / S3 Sync</span>
                </div>
                <span className="font-bold text-error">9%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('applications-filter')}
            className="w-full py-space-xs rounded bg-surface-container text-center font-label-md text-label-md text-tertiary hover:bg-surface-container-high transition-colors"
          >
            Configure L7 Policies →
          </button>
        </div>
      </section>

      {/* 5. Core Services Status & Hardware System Utilization (2-Column Bottom Row) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Left Panel: Core Services Status */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">terminal</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Core Daemons &amp; Protection Services</h3>
            </div>
            <button
              onClick={() => {
                setRestartingDaemon('all');
                setTimeout(() => setRestartingDaemon(null), 1000);
              }}
              className="flex items-center gap-space-xs px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm"
            >
              <span className={`material-symbols-outlined text-[14px] ${restartingDaemon === 'all' ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>Check All</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-xs">
            {daemons.map((daemon) => (
              <div key={daemon.id} className="p-space-sm rounded bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <div>
                    <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">{daemon.name}</div>
                    <div className="font-label-sm text-label-sm text-outline">{daemon.detail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold">
                    {restartingDaemon === daemon.id ? 'RESTARTING...' : daemon.status}
                  </span>
                  <button
                    onClick={() => handleRestartDaemon(daemon.id)}
                    className="p-space-xs rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
                    title={`Restart ${daemon.name}`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${restartingDaemon === daemon.id ? 'animate-spin' : ''}`}>
                      restart_alt
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Hardware & System Utilization */}
        <div className="p-space-lg rounded bg-surface-container-low shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary">memory</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Hardware &amp; System Resource Load</h3>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Node Nominal</span>
          </div>

          <div className="flex flex-col gap-space-md">
            {/* CPU Usage Section */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex justify-between items-center font-label-sm text-label-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="text-on-surface font-bold">CPU Load:</span>
                  <span className="text-primary font-bold">14%</span>
                  <span className="text-outline font-mono">(Load avg: 0.24, 0.18, 0.15)</span>
                </div>
                <span className="text-outline font-mono">8-Cores / 16-Threads</span>
              </div>
              {/* Multi-core mini bar preview */}
              <div className="grid grid-cols-8 gap-1 h-3 rounded bg-surface-container-highest p-0.5">
                {[22, 14, 32, 10, 8, 16, 6, 4].map((load, idx) => (
                  <div key={idx} className="bg-primary/80 rounded-xs h-full" style={{ width: `${load}%` }} title={`Core #${idx}: ${load}%`}></div>
                ))}
              </div>
            </div>

            {/* RAM Usage Section */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex justify-between items-center font-label-sm text-label-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="text-on-surface font-bold">Memory (ECC RAM):</span>
                  <span className="text-secondary font-bold font-mono">6.1 GB</span>
                  <span className="text-outline font-mono">/ 16.0 GB (38.1%)</span>
                </div>
                <span className="text-outline font-mono">Cache: 4.2 GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden flex gap-0.5">
                <div className="bg-secondary h-full" style={{ width: '38.1%' }}></div>
                <div className="bg-secondary/40 h-full" style={{ width: '26.2%' }}></div>
              </div>
            </div>

            {/* Storage Mounts */}
            <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded bg-surface-container flex flex-col gap-1">
                <div className="flex justify-between items-baseline font-label-sm text-label-sm">
                  <span className="text-on-surface font-semibold truncate">Mount: / (NVMe OS)</span>
                  <span className="text-primary font-bold">5.6%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '5.6%' }}></div>
                </div>
                <div className="font-label-sm text-label-sm text-outline font-mono">14.2 GB / 250 GB</div>
              </div>
              <div className="p-space-sm rounded bg-surface-container flex flex-col gap-1">
                <div className="flex justify-between items-baseline font-label-sm text-label-sm">
                  <span className="text-on-surface font-semibold truncate">Mount: /var/log (Logs)</span>
                  <span className="text-tertiary font-bold">16.8%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="bg-tertiary h-full" style={{ width: '16.8%' }}></div>
                </div>
                <div className="font-label-sm text-label-sm text-outline font-mono">8.4 GB / 50 GB</div>
              </div>
            </div>

            {/* Hardware Health Sensors */}
            <div className="grid grid-cols-3 gap-space-xs pt-space-xs font-label-sm text-label-sm font-mono">
              <div className="p-space-xs rounded bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[14px]">thermostat</span>
                  <span>Temp</span>
                </div>
                <span className="font-bold text-secondary">41°C</span>
              </div>
              <div className="p-space-xs rounded bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[14px]">mode_fan</span>
                  <span>Fan</span>
                </div>
                <span className="font-bold text-on-surface">1,450 RPM</span>
              </div>
              <div className="p-space-xs rounded bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>Power</span>
                </div>
                <span className="font-bold text-primary">24 W</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
