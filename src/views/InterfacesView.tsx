import React, { useState } from 'react';
import { ViewId, PhysicalPort, VlanMapping } from '../types.ts';

interface InterfacesViewProps {
  onNavigate: (view: ViewId) => void;
}

export const InterfacesView: React.FC<InterfacesViewProps> = ({ onNavigate }) => {
  const [selectedPort, setSelectedPort] = useState<string>('sfp0');
  const [mtuVal, setMtuVal] = useState<number>(9000);
  const [flowControl, setFlowControl] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'ports' | 'vlans' | 'bonding'>('ports');

  const ports: PhysicalPort[] = [
    {
      id: 'sfp0',
      name: 'eth0 (SFP+ 1)',
      type: 'SFP+',
      speed: '10 Gbps Full Duplex',
      description: 'WAN Primary Uplink (Fiber Optic LC, SMF 1310nm)',
      status: 'active',
      rxSpeed: '4.82 Gbps',
      txSpeed: '1.24 Gbps',
      opticalDdm: {
        txPower: '-2.14 dBm (Normal)',
        rxPower: '-6.82 dBm (Excellent)',
        temp: '44.8 °C',
        voltage: '3.31 V',
        serial: 'FTLX1471D3BCL-F2',
        vendor: 'Finisar Corp / Mellanox Gen3',
      },
    },
    {
      id: 'sfp1',
      name: 'eth1 (SFP+ 2)',
      type: 'SFP+',
      speed: '10 Gbps Full Duplex',
      description: 'Core LAN Trunk / Switch Fabric Link',
      status: 'active',
      rxSpeed: '2.10 Gbps',
      txSpeed: '4.55 Gbps',
      opticalDdm: {
        txPower: '-1.90 dBm (Normal)',
        rxPower: '-5.12 dBm (Excellent)',
        temp: '46.1 °C',
        voltage: '3.29 V',
        serial: 'FTLX1471D3BCL-G9',
        vendor: 'Finisar Corp / Cisco Compatible',
      },
    },
    {
      id: 'eth2',
      name: 'eth2 (RJ45 2.5G)',
      type: 'RJ45',
      speed: '2.5 Gbps Full Duplex',
      description: 'DMZ Public Services & Honeypot Sandbox',
      status: 'active',
      rxSpeed: '320 Mbps',
      txSpeed: '84 Mbps',
    },
    {
      id: 'eth3',
      name: 'eth3 (RJ45 1G)',
      type: 'RJ45',
      speed: '1.0 Gbps Full Duplex',
      description: 'Management OOB (Out-of-band IPMI / Dedicated)',
      status: 'active',
      rxSpeed: '12 kbps',
      txSpeed: '48 kbps',
    },
    {
      id: 'eth4',
      name: 'eth4 (RJ45 1G)',
      type: 'RJ45',
      speed: 'Down',
      description: 'Auxiliary Failover LTE / 5G Modem Backup',
      status: 'standby',
      rxSpeed: '0 bps',
      txSpeed: '0 bps',
    },
  ];

  const vlans: VlanMapping[] = [
    { vid: 1, name: 'Default LAN', subnet: '192.168.1.0/24', description: 'Administrative Core Workstations', zone: 'TRUST', dhcpScope: '192.168.1.100 - 250', ports: { sfp0: '—', sfp1: 'U', eth2: '—', eth3: '—' } },
    { vid: 10, name: 'DMZ Public', subnet: '10.0.10.0/24', description: 'Nginx Reverse Proxy, Git, Web clusters', zone: 'DMZ', dhcpScope: 'Static Only', ports: { sfp0: '—', sfp1: 'T', eth2: 'U', eth3: '—' } },
    { vid: 50, name: 'IoT Isolated', subnet: '172.16.50.0/24', description: 'Smart Home, Camera feeds, ESP32, Zigbee Bridges', zone: 'ISOLATED_IOT', dhcpScope: '172.16.50.10 - 200', ports: { sfp0: '—', sfp1: 'T', eth2: '—', eth3: '—' } },
    { vid: 99, name: 'Guest Quarantine', subnet: '192.168.99.0/24', description: 'Zero-trust guest captive portal', zone: 'GUEST', dhcpScope: '192.168.99.50 - 240', ports: { sfp0: '—', sfp1: 'T', eth2: '—', eth3: '—' } },
    { vid: 200, name: 'WireGuard Overlay', subnet: '10.8.0.0/24', description: 'Encrypted Remote Access Mesh', zone: 'VPN', dhcpScope: 'Dynamic Cryptokey', ports: { sfp0: '—', sfp1: '—', eth2: '—', eth3: '—' } },
  ];

  const currentPortObj = ports.find((p) => p.id === selectedPort) || ports[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">PHY & Virtual Interface Subsystem</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-primary font-semibold">
              Intel X520-DA2 / Mellanox ConnectX-4
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            eBPF XDP Native Driver Offload active on eth0, eth1. Jumbo Frames MTU 9000 enabled for low-latency line-rate fabric.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab('ports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedTab === 'ports' ? 'bg-primary text-on-primary shadow-sm shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Physical Ports (5)
          </button>
          <button
            onClick={() => setSelectedTab('vlans')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedTab === 'vlans' ? 'bg-primary text-on-primary shadow-sm shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            802.1Q VLANs (5)
          </button>
          <button
            onClick={() => setSelectedTab('bonding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedTab === 'bonding' ? 'bg-primary text-on-primary shadow-sm shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            LACP Link Aggregation
          </button>
        </div>
      </div>

      {selectedTab === 'ports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Physical Port Visualizer */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
                <span className="text-sm font-semibold text-on-surface">Chassis Front-Panel Interface Matrix</span>
                <span className="text-xs text-emerald-400 font-mono">4/5 Links Active (10 Gbps Agg: 20 Gbps)</span>
              </div>

              {/* Physical ports visual rack */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
                {ports.map((port) => {
                  const isSel = port.id === selectedPort;
                  return (
                    <div
                      key={port.id}
                      onClick={() => setSelectedPort(port.id)}
                      className={`cursor-pointer p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : port.status === 'active'
                          ? 'border-outline-variant/30 bg-surface-container/40 hover:border-outline-variant'
                          : 'border-outline-variant/10 bg-surface-container-lowest/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-on-surface">{port.name.split(' ')[0]}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            port.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-center py-3">
                        <div
                          className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-mono font-bold ${
                            port.type === 'SFP+'
                              ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                              : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                          }`}
                        >
                          {port.type}
                        </div>
                      </div>
                      <div className="text-center pt-2 border-t border-outline-variant/20">
                        <div className="text-[11px] font-semibold text-on-surface">{port.speed}</div>
                        <div className="text-[9px] text-on-surface-variant font-mono">
                          RX: {port.rxSpeed}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Port Table Summary */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                    <tr>
                      <th className="py-2.5 px-3">Port</th>
                      <th className="py-2.5 px-3">Media</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Speed</th>
                      <th className="py-2.5 px-3">Throughput (RX / TX)</th>
                      <th className="py-2.5 px-3">Zone Assignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                    {ports.map((port) => (
                      <tr
                        key={port.id}
                        onClick={() => setSelectedPort(port.id)}
                        className={`cursor-pointer transition-colors ${
                          port.id === selectedPort ? 'bg-primary/10' : 'hover:bg-surface-container/50'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-primary flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${port.status === 'active' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                          {port.name}
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">{port.type}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            port.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {port.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">{port.speed}</td>
                        <td className="py-3 px-3 text-on-surface font-mono">
                          <span className="text-emerald-400">↓ {port.rxSpeed}</span> / <span className="text-cyan-400">↑ {port.txSpeed}</span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant font-sans text-xs">
                          {port.id === 'sfp0' ? 'WAN (Internet Gateway)' : port.id === 'sfp1' ? 'LAN Core Trunk (VLAN 1,10,50,99)' : port.id === 'eth2' ? 'DMZ Zone (Isolated)' : 'OOB MGMT'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detailed Port Diagnostics & Optical DDM */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
                <span className="text-sm font-semibold text-on-surface">Port Inspector: {currentPortObj.name}</span>
                <span className="text-xs font-mono text-primary font-bold">{currentPortObj.type}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <div className="text-[10px] text-on-surface-variant uppercase font-mono">Assigned Role</div>
                  <div className="text-xs font-medium text-on-surface mt-0.5">{currentPortObj.description}</div>
                </div>

                {currentPortObj.opticalDdm ? (
                  <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold font-mono">
                      <span>Optical DDM Telemetry</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">DOM Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                        <span className="text-[9px] text-on-surface-variant block">TX Optical Power</span>
                        <span className="text-emerald-400 font-bold">{currentPortObj.opticalDdm.txPower}</span>
                      </div>
                      <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                        <span className="text-[9px] text-on-surface-variant block">RX Optical Power</span>
                        <span className="text-emerald-400 font-bold">{currentPortObj.opticalDdm.rxPower}</span>
                      </div>
                      <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                        <span className="text-[9px] text-on-surface-variant block">Laser Temp</span>
                        <span className="text-on-surface font-bold">{currentPortObj.opticalDdm.temp}</span>
                      </div>
                      <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                        <span className="text-[9px] text-on-surface-variant block">Supply Voltage</span>
                        <span className="text-on-surface font-bold">{currentPortObj.opticalDdm.voltage}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-mono pt-1 border-t border-outline-variant/20">
                      Module: {currentPortObj.opticalDdm.vendor} | S/N: {currentPortObj.opticalDdm.serial}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-xs">
                    Copper RJ45 PHY link negotiated at IEEE 802.3bz 2.5GBASE-T. Autonegotiation OK, no cable faults detected.
                  </div>
                )}

                {/* MTU & Driver Control */}
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-on-surface font-medium">MTU Payload Size</label>
                    <select
                      value={mtuVal}
                      onChange={(e) => setMtuVal(Number(e.target.value))}
                      className="text-xs font-mono bg-surface-container px-2 py-1 rounded border border-outline-variant/40 text-on-surface"
                    >
                      <option value={1500}>1500 (Standard Ethernet)</option>
                      <option value={9000}>9000 (Jumbo Frame)</option>
                      <option value={9216}>9216 (Super Jumbo)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-medium">802.3x Flow Control</span>
                    <button
                      onClick={() => setFlowControl(!flowControl)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        flowControl ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {flowControl ? 'RX/TX ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onNavigate('firewall-and-nat')}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold font-mono transition-colors text-center"
                  >
                    View Port Firewall Rules
                  </button>
                  <button
                    onClick={() => onNavigate('packet-inspector')}
                    className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
                  >
                    Sniff PCAP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'vlans' && (
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <h3 className="text-base font-bold text-on-surface font-headline">IEEE 802.1Q VLAN Tagging & Subnet Partitioning</h3>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">U = Untagged (Native PVID) | T = Tagged Trunk | — = Not Member</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-mono font-bold">
              + Create VLAN
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                <tr>
                  <th className="py-2.5 px-3">VLAN ID</th>
                  <th className="py-2.5 px-3">Network Name</th>
                  <th className="py-2.5 px-3">Subnet / CIDR</th>
                  <th className="py-2.5 px-3">Security Zone</th>
                  <th className="py-2.5 px-3 text-center">eth0 (WAN)</th>
                  <th className="py-2.5 px-3 text-center">eth1 (LAN TRUNK)</th>
                  <th className="py-2.5 px-3 text-center">eth2 (DMZ)</th>
                  <th className="py-2.5 px-3 text-center">eth3 (MGMT)</th>
                  <th className="py-2.5 px-3">DHCP Pool</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                {vlans.map((v) => (
                  <tr key={v.vid} className="hover:bg-surface-container/40">
                    <td className="py-3 px-3 font-bold text-primary">VLAN {v.vid}</td>
                    <td className="py-3 px-3 font-semibold text-on-surface font-sans">{v.name}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{v.subnet}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        v.zone === 'TRUST' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        v.zone === 'DMZ' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        v.zone === 'ISOLATED_IOT' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {v.zone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-on-surface-variant">{v.ports.sfp0}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">{v.ports.sfp1}</td>
                    <td className="py-3 px-3 text-center font-bold text-cyan-400">{v.ports.eth2}</td>
                    <td className="py-3 px-3 text-center font-bold text-on-surface-variant">{v.ports.eth3}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{v.dhcpScope}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('dhcp')}
                        className="text-primary hover:underline text-xs mr-2"
                      >
                        DHCP
                      </button>
                      <button
                        onClick={() => onNavigate('firewall-and-nat')}
                        className="text-amber-400 hover:underline text-xs"
                      >
                        Rules
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'bonding' && (
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <h3 className="text-base font-bold text-on-surface font-headline">IEEE 802.3ad Dynamic Link Aggregation (LACP)</h3>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">Bonding Mode: 802.3ad (LACP v4) with Layer 3+4 Hash Transmit Policy</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              BOND0: 20 Gbps (2 Slaves Active)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-on-surface">Bond Interface: bond0 (Core Trunk)</div>
              <div className="text-xs font-mono text-on-surface-variant space-y-1">
                <div>Slave 1: <span className="text-emerald-400 font-bold">eth0 (SFP+ 1)</span> - Link UP 10000 Mbps</div>
                <div>Slave 2: <span className="text-emerald-400 font-bold">eth1 (SFP+ 2)</span> - Link UP 10000 Mbps</div>
                <div>LACP Rate: <span className="text-on-surface">fast (1000ms periodic exchange)</span></div>
                <div>Hash Policy: <span className="text-on-surface">layer3+4 (IP + Port tuple)</span></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-on-surface">Failover & Telemetry</div>
              <div className="text-xs font-mono text-on-surface-variant space-y-1">
                <div>MII Link Monitoring: <span className="text-emerald-400 font-bold">Every 100ms</span></div>
                <div>Updelay: 200ms | Downdelay: 200ms</div>
                <div>Aggregator ID: 00:e0:67:12:44:90</div>
                <div>Actor Oper Key: 9 | Partner Oper Key: 9</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
