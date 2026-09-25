import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface DhcpViewProps {
  onNavigate: (view: ViewId) => void;
}

interface DhcpLease {
  id: string;
  ip: string;
  mac: string;
  hostname: string;
  type: 'DYNAMIC' | 'STATIC_RESERVED';
  status: 'ACTIVE' | 'EXPIRED' | 'OFFERED';
  leaseTime: string;
  vendor: string;
}

export const DhcpView: React.FC<DhcpViewProps> = ({ onNavigate }) => {
  const [selectedSubnet, setSelectedSubnet] = useState<string>('vlan1');
  const [showAddReservation, setShowAddReservation] = useState<boolean>(false);
  const [selectedLease, setSelectedLease] = useState<DhcpLease | null>(null);

  const leases: DhcpLease[] = [
    {
      id: 'lease-1',
      ip: '192.168.1.140',
      mac: '3c:06:30:4f:9b:11',
      hostname: 'macbook-pro-m3',
      type: 'DYNAMIC',
      status: 'ACTIVE',
      leaseTime: '18h 42m remaining',
      vendor: 'Apple Inc.',
    },
    {
      id: 'lease-2',
      ip: '192.168.1.110',
      mac: 'e8:40:f2:11:44:aa',
      hostname: 'gaming-rig-win11',
      type: 'STATIC_RESERVED',
      status: 'ACTIVE',
      leaseTime: 'Permanent Reservation',
      vendor: 'ASUSTeK Computer Inc.',
    },
    {
      id: 'lease-3',
      ip: '192.168.1.180',
      mac: '00:d8:61:9b:22:15',
      hostname: 'dev-workstation-linux',
      type: 'DYNAMIC',
      status: 'ACTIVE',
      leaseTime: '22h 10m remaining',
      vendor: 'Micro-Star INT\'L CO., LTD',
    },
    {
      id: 'lease-4',
      ip: '192.168.1.10',
      mac: '00:11:32:89:a0:14',
      hostname: 'enterprise-nas.internal',
      type: 'STATIC_RESERVED',
      status: 'ACTIVE',
      leaseTime: 'Permanent Reservation',
      vendor: 'Synology Inc.',
    },
    {
      id: 'lease-5',
      ip: '192.168.1.130',
      mac: 'f0:18:98:bb:cc:dd',
      hostname: 'apple-tv-4k',
      type: 'DYNAMIC',
      status: 'ACTIVE',
      leaseTime: '14h 05m remaining',
      vendor: 'Apple Inc.',
    },
  ];

  const transactionStream = [
    { time: '13:28:44.200', type: 'DHCPACK', ip: '192.168.1.140', mac: '3c:06:30:4f:9b:11', host: 'macbook-pro-m3', dur: '86400s' },
    { time: '13:28:44.180', type: 'DHCPREQUEST', ip: '192.168.1.140', mac: '3c:06:30:4f:9b:11', host: 'macbook-pro-m3', dur: 'Requested' },
    { time: '13:28:44.150', type: 'DHCPOFFER', ip: '192.168.1.140', mac: '3c:06:30:4f:9b:11', host: 'macbook-pro-m3', dur: 'Offer 192.168.1.140' },
    { time: '13:28:44.110', type: 'DHCPDISCOVER', ip: '0.0.0.0', mac: '3c:06:30:4f:9b:11', host: 'macbook-pro-m3', dur: 'Broadcast 255.255.255.255' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">DHCP Engine & IP Allocation Matrix</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              ISC Kea v2.6.1 + DHCP Snooping Guard
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            High-availability dual-stack IPv4/IPv6 lease allocation with rogue DHCP probe suppression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddReservation(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold shadow-md shadow-primary/20 transition-all"
          >
            + Static Reservation
          </button>
        </div>
      </div>

      {/* Scope Subnet Selector & Rogue DHCP Defense Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Active Subnet Scope</div>
          <select
            value={selectedSubnet}
            onChange={(e) => setSelectedSubnet(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-xs font-mono text-on-surface font-semibold"
          >
            <option value="vlan1">VLAN 1: LAN Default (192.168.1.0/24)</option>
            <option value="vlan50">VLAN 50: IoT Network (172.16.50.0/24)</option>
            <option value="vlan99">VLAN 99: Guest Network (192.168.99.0/24)</option>
          </select>
          <div className="text-[11px] text-on-surface-variant font-mono">
            Dynamic Pool: 192.168.1.100 - 192.168.1.250 (151 IPs)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Pool Utilization</div>
          <div className="text-sm font-bold text-on-surface font-headline">5 Leases Assigned</div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full rounded-full" style={{ width: '3.3%' }}></div>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">146 Available Addresses in Scope</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-on-surface-variant uppercase font-mono">Rogue DHCP Guard</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
              PROTECTED
            </span>
          </div>
          <div className="text-xs font-bold text-emerald-300">DHCP Snooping & Option 82 Active</div>
          <div className="text-[11px] text-on-surface-variant font-mono">
            Untrusted switch ports will drop unauthorized DHCPOFFER/ACK frames instantly.
          </div>
        </div>
      </div>

      {/* Leases Table & Forensic Client Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedLease ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <h3 className="text-sm font-bold text-on-surface font-headline">Allocated IP Leases</h3>
              <span className="text-xs font-mono text-primary font-bold">5 Active Leases</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                  <tr>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">MAC Address & Vendor</th>
                    <th className="py-2.5 px-3">Hostname</th>
                    <th className="py-2.5 px-3">Allocation Type</th>
                    <th className="py-2.5 px-3">Lease Expiry</th>
                    <th className="py-2.5 px-3 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                  {leases.map((l) => {
                    const isSel = selectedLease?.id === l.id;
                    return (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLease(l)}
                        className={`cursor-pointer transition-colors ${
                          isSel ? 'bg-primary/15' : 'hover:bg-surface-container/50'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-cyan-300">{l.ip}</td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-on-surface font-semibold">{l.mac}</div>
                          <div className="text-[10px] text-on-surface-variant font-sans">{l.vendor}</div>
                        </td>
                        <td className="py-3 px-3 font-bold text-on-surface font-sans">{l.hostname}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              l.type === 'STATIC_RESERVED'
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            {l.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">{l.leaseTime}</td>
                        <td className="py-3 px-3 text-center">
                          <button className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-primary text-[10px] font-bold">
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Lease Inspector */}
        {selectedLease && (
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface font-headline">Client Host Inspector</span>
                <button
                  onClick={() => setSelectedLease(null)}
                  className="text-on-surface-variant hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Device Identity</div>
                  <div className="text-sm font-bold text-primary">{selectedLease.hostname}</div>
                  <div className="text-xs text-on-surface">{selectedLease.ip}</div>
                  <div className="text-[11px] text-on-surface-variant font-mono">{selectedLease.mac}</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Manufacturer OUI</div>
                  <div className="text-xs text-on-surface font-sans font-semibold">{selectedLease.vendor}</div>
                  <div className="text-[11px] text-emerald-400">Lease status: {selectedLease.status}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onNavigate('live-sessions')}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs transition-colors text-center"
                  >
                    View Active Flows
                  </button>
                  <button
                    onClick={() => alert(`MAC ${selectedLease.mac} permanently pinned to ${selectedLease.ip}`)}
                    className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-outline-variant/30"
                  >
                    Pin Static IP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Kea Transaction Stream */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <span className="text-xs font-bold text-on-surface font-headline">Kea DHCP Lease Transaction Stream</span>
          <span className="text-[10px] font-mono text-emerald-400">DORA Handshake Stream</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {transactionStream.map((t, idx) => (
            <div key={idx} className="p-2 rounded bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-on-surface-variant">{t.time}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-surface-container-highest text-cyan-300">
                  {t.type}
                </span>
                <span className="font-bold text-on-surface">{t.ip}</span>
                <span className="text-on-surface-variant text-[11px]">{t.mac} ({t.host})</span>
              </div>
              <span className="text-emerald-400 text-[11px]">{t.dur}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface font-headline">New Static DHCP Reservation</h3>
              <button onClick={() => setShowAddReservation(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-on-surface-variant block mb-1">Host Description</label>
                <input
                  type="text"
                  placeholder="e.g. Printer / TrueNAS Core"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-on-surface-variant block mb-1">MAC Address</label>
                  <input
                    type="text"
                    placeholder="aa:bb:cc:dd:ee:ff"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant block mb-1">Assigned Static IP</label>
                  <input
                    type="text"
                    defaultValue="192.168.1.50"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setShowAddReservation(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddReservation(false)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-mono font-bold"
              >
                Save Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
