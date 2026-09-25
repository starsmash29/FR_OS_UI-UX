import React, { useState, useEffect } from 'react';
import { ViewId, SystemStats } from './types.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Footer } from './components/Footer.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';

// Views
import { DashboardView } from './views/DashboardView.tsx';
import { InterfacesView } from './views/InterfacesView.tsx';
import { FirewallNatView } from './views/FirewallNatView.tsx';
import { LiveSessionsView } from './views/LiveSessionsView.tsx';
import { ThreatIntelView } from './views/ThreatIntelView.tsx';
import { PacketInspectorView } from './views/PacketInspectorView.tsx';
import { VpnTunnelsView } from './views/VpnTunnelsView.tsx';
import { AuditLogsView } from './views/AuditLogsView.tsx';
import { AiIdsIpsView } from './views/AiIdsIpsView.tsx';
import { TlsSniFilterView } from './views/TlsSniFilterView.tsx';
import { AdBlockView } from './views/AdBlockView.tsx';
import { IoTDevicesView } from './views/IoTDevicesView.tsx';
import { ZtnaGateView } from './views/ZtnaGateView.tsx';
import { DhcpView } from './views/DhcpView.tsx';
import { FirmwareUpdateView } from './views/FirmwareUpdateView.tsx';
import { SystemSettingsView } from './views/SystemSettingsView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Real-time simulated appliance metrics
  const [stats, setStats] = useState<SystemStats>({
    cpu: 18,
    ram: 24,
    temp: 44,
    uptime: '42d 1h 14m',
    wireThroughputIn: 4.82,
    wireThroughputOut: 1.24,
    packetsPerSec: '142.8 kpps',
    blockedThreats24h: 14289,
    conntrackCount: 14291,
    conntrackMax: 262144,
    dnsQueries: 84120,
    dnsBlocked: 19402,
  });

  // Minor live telemetry heartbeat jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        cpu: Math.min(65, Math.max(12, prev.cpu + (Math.random() * 6 - 3))),
        wireThroughputIn: Number((prev.wireThroughputIn + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        wireThroughputOut: Number((prev.wireThroughputOut + (Math.random() * 0.2 - 0.1)).toFixed(2)),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'interfaces':
        return <InterfacesView onNavigate={setCurrentView} />;
      case 'firewall-and-nat':
        return <FirewallNatView onNavigate={setCurrentView} />;
      case 'live-sessions':
      case 'applications-filter':
        return <LiveSessionsView onNavigate={setCurrentView} />;
      case 'threat-intel':
        return <ThreatIntelView onNavigate={setCurrentView} />;
      case 'packet-inspector':
        return <PacketInspectorView onNavigate={setCurrentView} />;
      case 'vpn-tunnels':
        return <VpnTunnelsView onNavigate={setCurrentView} />;
      case 'audit-logs':
        return <AuditLogsView onNavigate={setCurrentView} />;
      case 'ai-ids-ips':
        return <AiIdsIpsView onNavigate={setCurrentView} />;
      case 'tls-sni-filter':
      case 'tls-fingerprints':
        return <TlsSniFilterView onNavigate={setCurrentView} />;
      case 'ad-block':
        return <AdBlockView onNavigate={setCurrentView} />;
      case 'iot-devices':
        return <IoTDevicesView onNavigate={setCurrentView} />;
      case 'ztna-gate':
        return <ZtnaGateView onNavigate={setCurrentView} />;
      case 'dhcp':
        return <DhcpView onNavigate={setCurrentView} />;
      case 'firmware-update':
        return <FirmwareUpdateView onNavigate={setCurrentView} />;
      case 'system-settings':
      case 'user-management':
        return <SystemSettingsView onNavigate={setCurrentView} stats={stats} />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary/30 selection:text-primary">
      {/* Persistent Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        stats={stats}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      <div className="flex flex-1 pt-14 pb-8">
        {/* Persistent Side Navigation Drawer */}
        <Sidebar currentView={currentView} onNavigate={setCurrentView} stats={stats} />

        {/* Main Operational View Content Area */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Persistent Bottom Operational Telemetry Footer Bar */}
      <Footer stats={stats} />

      {/* ⌘K Command Palette Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsSearchOpen(false);
        }}
      />

      {/* Security Incident Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsNotificationsOpen(false);
        }}
      />
    </div>
  );
}
