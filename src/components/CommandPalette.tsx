import React, { useState, useEffect } from 'react';
import { ViewId } from '../types.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // trigger toggle outside
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { title: 'Overview & Wire Telemetry', subtitle: 'Live throughput graphs and node health', view: 'dashboard' as ViewId, icon: 'space_dashboard', category: 'Views' },
    { title: 'Interfaces & 1U Chassis Frontplane', subtitle: '802.1Q port assignment matrix and SFP+ DDM', view: 'interfaces' as ViewId, icon: 'settings_ethernet', category: 'Views' },
    { title: 'Firewall & NAT Rules', subtitle: 'nftables & eBPF XDP filter rules and DNAT', view: 'firewall-and-nat' as ViewId, icon: 'security', category: 'Views' },
    { title: 'Live Conntrack Sessions', subtitle: 'Stateful 4-tuple stream with JA4 TLS inspection', view: 'live-sessions' as ViewId, icon: 'swap_horiz', category: 'Views' },
    { title: 'Threat Intel & DNS Sinkhole', subtitle: 'Suricata IPS signatures and content shield', view: 'threat-intel' as ViewId, icon: 'shield', category: 'Protection' },
    { title: 'Zero-Trust IoT Sandbox', subtitle: 'VLAN 20 device jailing and behavioral pinhole', view: 'iot-devices' as ViewId, icon: 'devices', category: 'Protection' },
    { title: 'Ad-Block & TLS SNI Filtering', subtitle: 'Unencrypted ad neutralizing and DoH trapping', view: 'ad-block' as ViewId, icon: 'filter_alt', category: 'Protection' },
    { title: 'TLS Cryptographic Fingerprinting', subtitle: 'JA3 / JA4+ ClientHello profiling without TLS decryption', view: 'tls-fingerprints' as ViewId, icon: 'fingerprint', category: 'Protection' },
    { title: 'ZTNA WireGuard Gate', subtitle: 'Point-to-point kernel tunnels with device posture', view: 'ztna-gate' as ViewId, icon: 'vpn_lock', category: 'Protection' },
    { title: 'AI IDS/IPS & Suricata Engine', subtitle: 'Unsupervised eBPF flow anomaly detection', view: 'ai-ids-ips' as ViewId, icon: 'psychology', category: 'Protection' },
    { title: 'Application Control & L7 DPI Matrix', subtitle: 'Protocol DNA, traffic shaping and QoS buckets', view: 'applications-filter' as ViewId, icon: 'apps', category: 'Protection' },
    { title: 'DHCP Scope Manager & Host Inventory', subtitle: 'Kea multi-threaded daemon with eBPF lease table', view: 'dhcp' as ViewId, icon: 'dynamic_form', category: 'Network' },
    { title: 'Firmware & eBPF Bytecode Updates', subtitle: 'Dual-partition A/B rollback and JIT hot-reloading', view: 'firmware-update' as ViewId, icon: 'system_update', category: 'System' },
    { title: 'System Configuration & Parameters', subtitle: 'Chrony NTP, Intel QAT crypto, lifecycle guardrails', view: 'system-settings' as ViewId, icon: 'tune', category: 'System' },
  ];

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-surface-container-lowest/80 backdrop-blur-md p-4">
      <div className="bg-surface-container-low max-w-2xl w-full rounded-xl shadow-2xl border border-surface-variant flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-3 border-b border-surface-variant/50 flex items-center gap-3 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-primary text-[20px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, security modules, IP addresses, or rules..."
            className="w-full bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-outline text-[10px] font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-outline font-label-md text-label-md">
              No matching modules or actions found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-high transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-surface-container-lowest border-t border-surface-variant/40 flex items-center justify-between text-outline font-label-sm text-label-sm">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>FR_OS Next-Gen Shell v4.8.2</span>
        </div>
      </div>
    </div>
  );
};
