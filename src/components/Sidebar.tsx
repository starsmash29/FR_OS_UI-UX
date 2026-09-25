import React, { useState } from 'react';
import { ViewId, SystemStats } from '../types.ts';

interface SidebarProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  stats: SystemStats;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, stats }) => {
  const [navMode, setNavMode] = useState<'noc' | 'tree'>('noc');

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest z-40 flex flex-col justify-between py-space-md shadow-[2px_0_12px_rgba(0,0,0,0.45)] border-r border-surface-variant/30 select-none">
      <div className="flex flex-col gap-space-sm px-space-md overflow-y-auto">
        {/* Active Engine & Nav Mode switcher */}
        <div className="px-space-sm py-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider bg-surface-container/40 rounded">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>ENGINE:</span>
            <span className="text-secondary font-bold">L7 DPI</span>
          </div>
          <button
            onClick={() => setNavMode(m => m === 'noc' ? 'tree' : 'noc')}
            className="text-[10px] text-primary hover:underline font-mono uppercase"
            title="Toggle between Quick Stream and Full Tree navigation"
          >
            {navMode === 'noc' ? 'ALL VIEWS ▾' : 'NOC VIEW ▾'}
          </button>
        </div>

        {/* Mode 1: Quick NOC / Primary Telemetry Navigation */}
        {navMode === 'noc' ? (
          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'dashboard'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
              <span>Overview</span>
            </button>

            <button
              onClick={() => onNavigate('live-sessions')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'live-sessions'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span className="flex-1">Live Sessions</span>
              <span className="text-[10px] font-mono opacity-80">1.8k</span>
            </button>

            <button
              onClick={() => onNavigate('threat-intel')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'threat-intel'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span className="flex-1">Threat Intel</span>
              <span className="px-1 py-0.2 rounded bg-error-container text-on-error-container text-[9px] font-bold">14</span>
            </button>

            <button
              onClick={() => onNavigate('packet-inspector')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'packet-inspector'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
              <span>Packet Inspector</span>
            </button>

            <button
              onClick={() => onNavigate('ztna-gate')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'ztna-gate'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">vpn_lock</span>
              <span className="flex-1">VPN &amp; ZTNA</span>
              <span className="text-[10px] font-mono text-secondary">42</span>
            </button>

            <button
              onClick={() => onNavigate('audit-logs')}
              className={`flex items-center gap-space-md px-space-md py-space-sm rounded transition-all text-left ${
                currentView === 'audit-logs'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Audit Logs</span>
            </button>

            {/* Quick jump to Deep Security Subsystems */}
            <div className="pt-space-xs border-t border-surface-variant/40 flex flex-col gap-1">
              <span className="px-space-md py-1 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Specialized Protection
              </span>
              <button
                onClick={() => onNavigate('iot-devices')}
                className={`flex items-center gap-space-md px-space-md py-1.5 rounded transition-all text-left font-body-sm text-body-sm ${
                  currentView === 'iot-devices'
                    ? 'bg-primary-container/20 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">devices</span>
                <span>Zero-Trust IoT</span>
              </button>
              <button
                onClick={() => onNavigate('ad-block')}
                className={`flex items-center gap-space-md px-space-md py-1.5 rounded transition-all text-left font-body-sm text-body-sm ${
                  currentView === 'ad-block' || currentView === 'tls-sni-filter'
                    ? 'bg-primary-container/20 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                <span>Ad-Block / SNI</span>
              </button>
              <button
                onClick={() => onNavigate('ai-ids-ips')}
                className={`flex items-center gap-space-md px-space-md py-1.5 rounded transition-all text-left font-body-sm text-body-sm ${
                  currentView === 'ai-ids-ips'
                    ? 'bg-primary-container/20 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>AI IDS/IPS</span>
              </button>
            </div>
          </nav>
        ) : (
          /* Mode 2: Full Operating System Appliance Tree (CORE, NETWORK, PROTECTION, SYSTEM) */
          <nav className="flex flex-col gap-space-sm text-left">
            {/* Core */}
            <div className="flex flex-col gap-0.5">
              <span className="px-space-sm py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                CORE
              </span>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span>Dashboard</span>
              </button>
            </div>

            {/* Network */}
            <div className="flex flex-col gap-0.5">
              <span className="px-space-sm py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                NETWORK
              </span>
              <button
                onClick={() => onNavigate('interfaces')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'interfaces'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">settings_ethernet</span>
                <span>Interfaces &amp; VLANs</span>
              </button>
              <button
                onClick={() => onNavigate('firewall-and-nat')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'firewall-and-nat'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">security</span>
                <span>Firewall &amp; NAT Rules</span>
              </button>
              <button
                onClick={() => onNavigate('dhcp')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'dhcp'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">dynamic_form</span>
                <span>DHCP Leases &amp; IP Pool</span>
              </button>
            </div>

            {/* Protection */}
            <div className="flex flex-col gap-0.5">
              <span className="px-space-sm py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                PROTECTION
              </span>
              <button
                onClick={() => onNavigate('ai-ids-ips')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'ai-ids-ips'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>AI IDS/IPS</span>
              </button>
              <button
                onClick={() => onNavigate('ad-block')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'ad-block' || currentView === 'tls-sni-filter'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                <span>TLS SNI / Ad-Block</span>
              </button>
              <button
                onClick={() => onNavigate('iot-devices')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'iot-devices'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">devices</span>
                <span>IoT Devices</span>
              </button>
              <button
                onClick={() => onNavigate('applications-filter')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'applications-filter'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">apps</span>
                <span>Applications &amp; DPI</span>
              </button>
              <button
                onClick={() => onNavigate('tls-fingerprints')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'tls-fingerprints'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                <span>TLS Fingerprints (JA4)</span>
              </button>
              <button
                onClick={() => onNavigate('ztna-gate')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'ztna-gate'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">vpn_lock</span>
                <span>ZTNA WireGuard Gate</span>
              </button>
            </div>

            {/* System */}
            <div className="flex flex-col gap-0.5">
              <span className="px-space-sm py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                SYSTEM
              </span>
              <button
                onClick={() => onNavigate('firmware-update')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'firmware-update'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">system_update</span>
                <span>Firmware &amp; Kernel Update</span>
              </button>
              <button
                onClick={() => onNavigate('system-settings')}
                className={`flex items-center gap-2 px-space-sm py-1.5 rounded text-left font-body-sm text-body-sm transition-colors ${
                  currentView === 'system-settings'
                    ? 'bg-primary-container/20 text-primary font-semibold border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>System Parameters</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Persistent Bottom Hardware Telemetry Gauge Box */}
      <div className="px-space-md flex flex-col gap-space-sm pt-space-xs border-t border-surface-variant/30">
        <div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Throughput</span>
            <span className="text-primary font-bold">4.2 Gbps</span>
          </div>
          <div className="w-full h-1 rounded bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-primary rounded" style={{ width: '68%' }}></div>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Packets/s</span>
            <span className="text-on-surface">{stats.packetsPerSec}</span>
          </div>
        </div>

        <div className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between">
          <span className="text-outline">Uptime</span>
          <span className="text-on-surface font-bold">{stats.uptime}</span>
        </div>
      </div>
    </aside>
  );
};
