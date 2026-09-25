import React from 'react';
import { ViewId, SystemStats } from '../types.ts';
import { FROSIcon } from './FROSIcon.tsx';

interface HeaderProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  stats: SystemStats;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  hasUnreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  stats,
  onOpenSearch,
  onOpenNotifications,
  hasUnreadNotifications = true,
}) => {
  // Map top-level menu item to active state
  const isTopActive = (view: ViewId) => {
    if (view === 'dashboard' && currentView === 'dashboard') return true;
    if (view === 'interfaces' && currentView === 'interfaces') return true;
    if (view === 'firewall-and-nat' && currentView === 'firewall-and-nat') return true;
    if (
      view === 'threat-intel' &&
      ['threat-intel', 'ai-ids-ips', 'tls-sni-filter', 'ad-block', 'iot-devices', 'applications-filter', 'tls-fingerprints', 'ztna-gate'].includes(currentView)
    ) return true;
    if (view === 'dhcp' && currentView === 'dhcp') return true;
    if (view === 'packet-inspector' && currentView === 'packet-inspector') return true;
    if (view === 'system-settings' && ['system-settings', 'firmware-update', 'user-management'].includes(currentView)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur-xl z-50 flex items-center justify-between px-space-lg shadow-[0_4px_24px_rgba(0,0,0,0.65)] border-b border-surface-variant/40">
      {/* Left: Brand & Machine Telemetry */}
      <div className="flex items-center gap-space-lg">
        {/* Brand Lockup */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-space-sm cursor-pointer text-left focus:outline-none"
        >
          <FROSIcon size={28} />
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-md text-headline-md tracking-tight font-bold text-on-surface">
              FR<span className="text-primary">·</span>OS
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              v4.8.2
            </span>
          </div>
        </button>

        <div className="h-4 w-px bg-surface-variant hidden sm:block"></div>

        {/* Node status */}
        <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-secondary font-label-sm text-label-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>node-01.lab.internal</span>
          <span className="text-on-surface-variant font-normal">[Online]</span>
        </div>

        {/* CPU / RAM / Temp gauges */}
        <div className="hidden xl:flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
            <span className="text-outline">CPU</span>
            <span className="font-bold text-on-surface">{stats.cpu}%</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
            <span className="text-outline">RAM</span>
            <span className="font-bold text-on-surface">{stats.ram}%</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
            <span className="text-outline">TEMP</span>
            <span className="font-bold text-secondary">{stats.temp}°C</span>
          </div>
        </div>
      </div>

      {/* Center: Top Global Route Navigation */}
      <nav className="hidden lg:flex items-center gap-space-xs font-headline-sm text-headline-sm">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('dashboard')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('interfaces')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('interfaces')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          Interfaces
        </button>
        <button
          onClick={() => onNavigate('firewall-and-nat')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('firewall-and-nat')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          Firewall &amp; NAT
        </button>
        <button
          onClick={() => onNavigate('threat-intel')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('threat-intel')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          Protection &amp; IPS
        </button>
        <button
          onClick={() => onNavigate('dhcp')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('dhcp')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          DNS &amp; DHCP
        </button>
        <button
          onClick={() => onNavigate('packet-inspector')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('packet-inspector')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          Diagnostics
        </button>
        <button
          onClick={() => onNavigate('system-settings')}
          className={`px-space-md py-space-xs rounded transition-all ${
            isTopActive('system-settings')
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          System Settings
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        {/* Engine active status indicator button */}
        <div className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container-high text-on-surface font-label-md text-label-md">
          <span className="material-symbols-outlined text-[16px] text-primary">security_update_good</span>
          <span>Engine Active</span>
        </div>

        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-space-sm px-space-sm py-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm border border-outline-variant/30 hover:border-primary/40 transition-colors"
          type="button"
          title="Search anything (Command+K)"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="hidden md:inline text-outline">Quick Search</span>
          <kbd className="hidden md:inline px-1 py-0.5 rounded bg-surface-container font-mono text-[9px] text-outline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={onOpenNotifications}
            className="relative p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            type="button"
            title="Active Security Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error-container ring-2 ring-surface-container-lowest animate-ping"></span>
            )}
          </button>
        </div>

        {/* User Identity */}
        <button
          onClick={() => onNavigate('system-settings')}
          className="flex items-center gap-space-xs pl-space-xs hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="font-label-md text-label-md text-on-surface leading-none">secops-admin</span>
            <span className="font-label-sm text-label-sm text-outline leading-tight mt-0.5">Superuser</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-outline hover:text-on-surface cursor-pointer hidden sm:block">
            arrow_drop_down
          </span>
        </button>
      </div>
    </header>
  );
};
