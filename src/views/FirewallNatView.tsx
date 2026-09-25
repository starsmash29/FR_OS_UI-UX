import React, { useState } from 'react';
import { ViewId, FirewallRule } from '../types.ts';

interface FirewallNatViewProps {
  onNavigate: (view: ViewId) => void;
}

export const FirewallNatView: React.FC<FirewallNatViewProps> = ({ onNavigate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [ebpfOffloadEnabled, setEbpfOffloadEnabled] = useState<boolean>(true);

  const [rules, setRules] = useState<FirewallRule[]>([
    {
      id: 100,
      active: true,
      verdict: 'DROP',
      interfaceZone: 'WAN (eth0)',
      proto: 'ALL',
      source: 'Threat Feed: CrowdSec + AlienVault',
      sourceLabel: '412,809 Malicious IPs',
      port: 'ANY',
      destination: 'FIREWALL_SELF',
      hits: '2.4M',
      bandwidth: '840 GB',
      title: 'Global Ingress Threat Blacklist',
      badge: 'eBPF XDP DROP',
      badgeType: 'blocklist',
      description: 'Zero-copy kernel bypass packet drop at NIC driver ring buffer for known C2 & botnets',
    },
    {
      id: 110,
      active: true,
      verdict: 'DROP',
      interfaceZone: 'WAN (eth0)',
      proto: 'TCP/UDP',
      source: 'GEO_IP: Russian Fed, DPRK, Iran',
      port: 'ANY',
      destination: 'LAN_ALL',
      hits: '984.1k',
      bandwidth: '312 MB',
      title: 'High-Risk Sovereign Geo-Fence',
      badge: 'GeoIP ACL',
      badgeType: 'isolation',
      description: 'Pre-routing geo-ip table filter blocking ingress connection attempts from embargoed zones',
    },
    {
      id: 200,
      active: true,
      verdict: 'PASS',
      interfaceZone: 'WAN (eth0)',
      proto: 'UDP',
      source: 'ANY',
      port: '51820',
      destination: 'FIREWALL_SELF (wg0)',
      destLabel: 'WireGuard Kernel',
      hits: '14.8M',
      bandwidth: '4.2 TB',
      title: 'WireGuard Site-to-Site & Roaming VPN',
      badge: 'Kernel FastPath',
      badgeType: 'vpn',
      description: 'Allow Noise IK crypto handshakes directly into wg0 interface',
    },
    {
      id: 300,
      active: true,
      verdict: 'PASS',
      interfaceZone: 'WAN (eth0)',
      proto: 'TCP',
      source: 'Cloudflare Proxies (CIDRs)',
      port: '443, 80',
      destination: 'DMZ (10.0.10.5:443)',
      destLabel: 'Nginx Reverse Proxy',
      hits: '5.6M',
      bandwidth: '1.9 TB',
      title: 'DNAT: Public HTTPS to Reverse Proxy',
      badge: 'DNAT Port Forward',
      badgeType: 'dnat',
      description: 'Forward incoming HTTPS traffic through Cloudflare tunnel to DMZ edge reverse proxy',
    },
    {
      id: 400,
      active: true,
      verdict: 'PASS',
      interfaceZone: 'LAN (eth1.1)',
      proto: 'TCP/UDP/ICMP',
      source: 'LAN_NET (192.168.1.0/24)',
      port: 'ANY',
      destination: 'WAN (Internet)',
      hits: '32.1M',
      bandwidth: '8.4 TB',
      title: 'LAN Outbound Full Internet Access',
      badge: 'NAT Masquerade',
      badgeType: 'outbound',
      description: 'Stateful conntrack NAT table translation with full TCP sequence tracking and MSS clamping',
    },
    {
      id: 500,
      active: true,
      verdict: 'DROP',
      interfaceZone: 'VLAN 50 (IoT)',
      proto: 'IP',
      source: 'IOT_NET (172.16.50.0/24)',
      port: 'ANY',
      destination: 'LAN_NET (192.168.1.0/24)',
      hits: '74.2k',
      bandwidth: '4.2 MB',
      title: 'IoT Micro-segmentation: Block LAN Cross-Talk',
      badge: 'Zero-Trust Isolation',
      badgeType: 'isolation',
      description: 'Strict inter-VLAN quarantine. IoT devices cannot reach workstations, NAS, or management',
    },
    {
      id: 510,
      active: true,
      verdict: 'PASS',
      interfaceZone: 'VLAN 50 (IoT)',
      proto: 'UDP',
      source: '172.16.50.15 (HomeAssistant)',
      port: '8123',
      destination: '192.168.1.50 (Admin Desktop)',
      hits: '182.4k',
      bandwidth: '42 MB',
      title: 'IoT Pin-Hole: Home Assistant Webhook',
      badge: 'Pin-Hole Pin',
      badgeType: 'core',
      description: 'Explicit pin-hole exception allowing Home Assistant to notify workstation status',
    },
    {
      id: 999,
      active: true,
      verdict: 'DROP',
      interfaceZone: 'ALL INTERFACES',
      proto: 'ALL',
      source: 'ANY',
      port: 'ANY',
      destination: 'ANY',
      hits: '14.1k',
      bandwidth: '1.1 MB',
      title: 'Default Deny Implicit Drop',
      badge: 'Catch-All Default',
      badgeType: 'default',
      description: 'Zero-trust security baseline: anything not explicitly matched above is silently dropped and logged',
    },
  ]);

  const toggleRule = (id: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const filteredRules = rules.filter((r) => {
    if (filterCategory === 'inbound' && !r.interfaceZone.includes('WAN')) return false;
    if (filterCategory === 'outbound' && !r.badgeType.includes('outbound')) return false;
    if (filterCategory === 'dnat' && r.badgeType !== 'dnat') return false;
    if (filterCategory === 'isolation' && r.badgeType !== 'isolation') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.port.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and eBPF acceleration status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Stateful Firewall & NAT Engine</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              eBPF / XDP Driver Hook: Active
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Packet processing evaluated top-to-bottom. Wire-speed line-rate enforcement with sub-microsecond lookup caches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30">
            <span className="text-xs font-mono text-on-surface-variant">XDP Offload:</span>
            <button
              onClick={() => setEbpfOffloadEnabled(!ebpfOffloadEnabled)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                ebpfOffloadEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {ebpfOffloadEnabled ? 'KERNEL BYPASS 10G' : 'LINUX STACK'}
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold shadow-md shadow-primary/20 transition-all"
          >
            <span className="text-sm font-bold">+</span> Add Rule
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Chains (8)' },
            { id: 'inbound', label: 'Inbound WAN (3)' },
            { id: 'outbound', label: 'LAN Outbound (1)' },
            { id: 'dnat', label: 'Port Forward (DNAT)' },
            { id: 'isolation', label: 'IoT & Geo Isolation (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                filterCategory === cat.id
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search rules, IPs, ports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-3 pr-8 py-1.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Firewall Rules Table */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Rule Name & Details</th>
                <th className="py-2.5 px-3">Zone / Interface</th>
                <th className="py-2.5 px-3">Proto</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Port</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3 text-right">Packets / Hits</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {filteredRules.map((rule) => {
                const isPass = rule.verdict === 'PASS';
                const isDrop = rule.verdict === 'DROP';
                return (
                  <tr
                    key={rule.id}
                    className={`transition-colors ${
                      !rule.active ? 'opacity-40 bg-surface-container-lowest/30' : 'hover:bg-surface-container/40'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`w-8 h-4 rounded-full relative transition-colors p-0.5 ${
                          rule.active ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                        title={rule.active ? 'Rule is active' : 'Rule disabled'}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            rule.active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-3 font-bold text-on-surface-variant">#{rule.id}</td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          isPass
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isDrop
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {rule.verdict}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-xs text-on-surface flex items-center gap-2">
                        {rule.title}
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface-container-highest border border-outline-variant/40 text-primary">
                          {rule.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-mono mt-0.5 line-clamp-1">
                        {rule.description}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-on-surface-variant">{rule.interfaceZone}</td>
                    <td className="py-3 px-3 font-bold text-cyan-300">{rule.proto}</td>
                    <td className="py-3 px-3 text-on-surface">
                      <div>{rule.source}</div>
                      {rule.sourceLabel && <div className="text-[10px] text-on-surface-variant">{rule.sourceLabel}</div>}
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-300">{rule.port}</td>
                    <td className="py-3 px-3 text-on-surface">
                      <div>{rule.destination}</div>
                      {rule.destLabel && <div className="text-[10px] text-on-surface-variant">{rule.destLabel}</div>}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-on-surface">{rule.hits}</td>
                    <td className="py-3 px-3 text-right text-on-surface-variant">{rule.bandwidth}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onNavigate('live-sessions')}
                          className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary"
                          title="Inspect live sessions matching rule"
                        >
                          🔍
                        </button>
                        <button
                          onClick={() => {
                            setRules(rules.filter((r) => r.id !== rule.id));
                          }}
                          className="p-1 hover:bg-rose-500/20 rounded text-on-surface-variant hover:text-rose-400"
                          title="Delete rule"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NAT Masquerade & Port Forward Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface font-headline">NAT Port Forwarding Table (DNAT)</span>
            <span className="text-[10px] font-mono text-emerald-400">3 Active Mappings</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">WAN:443 (HTTPS)</span>
                <span className="text-on-surface-variant mx-2">→</span>
                <span className="text-on-surface font-semibold">10.0.10.5:443 (DMZ Nginx)</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">TCP Synched</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">WAN:80 (HTTP)</span>
                <span className="text-on-surface-variant mx-2">→</span>
                <span className="text-on-surface font-semibold">10.0.10.5:80 (ACME Challenge)</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">TCP Synched</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">WAN:51820 (WireGuard)</span>
                <span className="text-on-surface-variant mx-2">→</span>
                <span className="text-on-surface font-semibold">127.0.0.1:51820 (Kernel wg0)</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">UDP Direct</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface font-headline">Stateful Conntrack & NAT Overflow</span>
            <span className="text-[10px] font-mono text-cyan-400">Table Capacity: 262,144</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-mono">Current Active Flows:</span>
              <span className="font-bold text-primary font-mono">14,291 / 262,144 (5.4%)</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '5.4%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
              <div className="p-1.5 rounded bg-surface-container/60">
                <span className="text-on-surface-variant block">TCP ESTABLISHED</span>
                <span className="text-emerald-400 font-bold">11,402</span>
              </div>
              <div className="p-1.5 rounded bg-surface-container/60">
                <span className="text-on-surface-variant block">UDP FLOWS</span>
                <span className="text-cyan-400 font-bold">2,780</span>
              </div>
              <div className="p-1.5 rounded bg-surface-container/60">
                <span className="text-on-surface-variant block">SYN TIMEOUT</span>
                <span className="text-on-surface font-bold">60s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to add rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl p-5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface font-headline">Create New Firewall Access Rule</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-on-surface-variant block mb-1">Rule Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Block Port 23 Telnet scans"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-on-surface-variant block mb-1">Verdict Action</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface">
                    <option value="PASS">PASS (Allow packet)</option>
                    <option value="DROP">DROP (Silent eBPF discard)</option>
                    <option value="REJECT">REJECT (TCP Reset / ICMP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-on-surface-variant block mb-1">Protocol</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface">
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                    <option value="ALL">ALL (Any Protocol)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-on-surface-variant block mb-1">Source Address / Subnet</label>
                  <input
                    type="text"
                    defaultValue="ANY"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant block mb-1">Destination Address / Subnet</label>
                  <input
                    type="text"
                    defaultValue="LAN_NET"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-on-surface-variant block mb-1">Destination Port(s)</label>
                  <input
                    type="text"
                    defaultValue="ANY"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant block mb-1">Security Zone</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface">
                    <option value="WAN">WAN Ingress</option>
                    <option value="LAN">LAN Core</option>
                    <option value="DMZ">DMZ Isolated</option>
                    <option value="IOT">IoT Network</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold"
              >
                Save & Compile Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
