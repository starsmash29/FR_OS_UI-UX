import React, { useState } from 'react';
import { ViewId, IoTDevice } from '../types.ts';

interface IoTDevicesViewProps {
  onNavigate: (view: ViewId) => void;
}

export const IoTDevicesView: React.FC<IoTDevicesViewProps> = ({ onNavigate }) => {
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);

  const initialDevices: IoTDevice[] = [
    {
      id: 'iot-1',
      name: 'Outdoor PTZ Security Camera (Tuya)',
      location: 'Front Garden / Perimeter',
      mac: 'b4:e6:2d:41:88:99',
      vendor: 'Tuya Smart / Hangzhou Xiongmai',
      ip: '172.16.50.44',
      vlan: 'VLAN 50 (Isolated IoT)',
      fingerprint: 'Linux 3.18 / BusyBox / Embedded RTSP Server',
      engineOpt: 'Hardware H.265 / Cloud P2P Active',
      tier: 'Tier 2: Cloud Pin-Hole',
      wanFlow: '14.2 MB/h',
      lanFlow: '0 B (Severed)',
      threatScore: 84,
      isFlagged: true,
      pinholeSettings: {
        forwardHomeAssistant: true,
        dropExternalDns: true,
        l2BroadcastFilter: true,
        strictRateLimit: true,
      },
      contactedFqdns: [
        { fqdn: 'a3.tuyaus.com', port: 8886, protocol: 'MQTT/TLS', status: 'ALLOWED', detail: 'Vendor cloud telemetry' },
        { fqdn: 'p2p.tuya.com', port: 10000, protocol: 'UDP STUN', status: 'ALLOWED', detail: 'NAT traversal stream' },
        { fqdn: 'pool.ntp.org', port: 123, protocol: 'UDP NTP', status: 'REDIRECTED', detail: 'Intercepted to local NTP' },
        { fqdn: '8.8.8.8', port: 53, protocol: 'DNS Direct', status: 'SINKHOLED', detail: 'External DNS bypass attempt blocked' },
      ],
    },
    {
      id: 'iot-2',
      name: 'ESP32 Smart Energy Monitor',
      location: 'Main Distribution Panel',
      mac: '24:6f:28:10:22:31',
      vendor: 'Espressif Inc.',
      ip: '172.16.50.88',
      vlan: 'VLAN 50 (Isolated IoT)',
      fingerprint: 'FreeRTOS / ESP-IDF v5.1',
      engineOpt: 'MQTT Telemetry Client',
      tier: 'Tier 1: Zero-Trust Strict',
      wanFlow: '0 B (No Internet)',
      lanFlow: '1.2 kB/s to HA',
      threatScore: 4,
      isFlagged: false,
      pinholeSettings: {
        forwardHomeAssistant: true,
        dropExternalDns: true,
        l2BroadcastFilter: true,
        strictRateLimit: false,
      },
      contactedFqdns: [
        { fqdn: 'homeassistant.internal', port: 1883, protocol: 'TCP MQTT', status: 'ALLOWED', detail: 'Local broker publishing' },
      ],
    },
    {
      id: 'iot-3',
      name: 'Philips Hue Zigbee Bridge v2',
      location: 'Server Rack Shelf 2',
      mac: '00:17:88:4a:bc:19',
      vendor: 'Signify Netherlands B.V.',
      ip: '172.16.50.12',
      vlan: 'VLAN 50 (Isolated IoT)',
      fingerprint: 'OpenWrt Embedded / Zigbee 3.0',
      engineOpt: 'Local HTTPS API / Matter Support',
      tier: 'Tier 1: Zero-Trust Strict',
      wanFlow: '12 kB/h (NTP Only)',
      lanFlow: '180 kB/s (HomeKit Local)',
      threatScore: 2,
      isFlagged: false,
      pinholeSettings: {
        forwardHomeAssistant: true,
        dropExternalDns: true,
        l2BroadcastFilter: false,
        strictRateLimit: false,
      },
      contactedFqdns: [
        { fqdn: 'diagnostics.meethue.com', port: 443, protocol: 'HTTPS', status: 'SINKHOLED', detail: 'Telemetry blocked' },
        { fqdn: 'time.google.com', port: 123, protocol: 'UDP NTP', status: 'REDIRECTED', detail: 'Redirected to local clock' },
      ],
    },
    {
      id: 'iot-4',
      name: 'LG C3 OLED Smart Television',
      location: 'Living Room Media Center',
      mac: 'a0:b1:c2:d3:e4:f5',
      vendor: 'LG Electronics',
      ip: '172.16.50.30',
      vlan: 'VLAN 50 (Isolated IoT)',
      fingerprint: 'webOS 8.0 / Chromium Embedded',
      engineOpt: 'Streaming Engine / ACR Tracking',
      tier: 'Tier 2: Cloud Pin-Hole',
      wanFlow: '48.1 MB/h',
      lanFlow: '0 B (LAN Blocked)',
      threatScore: 68,
      isFlagged: false,
      pinholeSettings: {
        forwardHomeAssistant: true,
        dropExternalDns: true,
        l2BroadcastFilter: true,
        strictRateLimit: true,
      },
      contactedFqdns: [
        { fqdn: 'netflix.com', port: 443, protocol: 'HTTPS', status: 'ALLOWED', detail: 'Streaming content' },
        { fqdn: 'lgsmartad.com', port: 443, protocol: 'HTTPS', status: 'SINKHOLED', detail: 'ACR Ad tracking sinkholed' },
      ],
    },
  ];

  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);

  const handleQuarantine = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              tier: 'Tier 3: Quarantine Blackhole',
              vlan: 'VLAN 99 (Quarantine Sandbox)',
              threatScore: 99,
            }
          : d
      )
    );
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice((prev) =>
        prev
          ? {
              ...prev,
              tier: 'Tier 3: Quarantine Blackhole',
              vlan: 'VLAN 99 (Quarantine Sandbox)',
              threatScore: 99,
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">IoT Micro-segmentation & Zero-Trust Matrix</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              VLAN 50 Strict Isolation + mDNS Reflector
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Isolates smart home sensors and appliances from workstation LANs while maintaining secure home automation pin-holes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('firewall-and-nat')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
          >
            IoT Firewall Rules →
          </button>
        </div>
      </div>

      {/* IoT Devices Table & Deep Forensics Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedDevice ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <h3 className="text-sm font-bold text-on-surface font-headline">Discovered IoT Endpoints</h3>
              <span className="text-xs font-mono text-primary font-bold">4 Monitored Devices</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                  <tr>
                    <th className="py-2.5 px-3">Device Name & MAC</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Security Tier</th>
                    <th className="py-2.5 px-3">WAN Bandwidth</th>
                    <th className="py-2.5 px-3 text-center">Threat Risk</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                  {devices.map((dev) => {
                    const isSel = selectedDevice?.id === dev.id;
                    return (
                      <tr
                        key={dev.id}
                        onClick={() => setSelectedDevice(dev)}
                        className={`cursor-pointer transition-colors ${
                          isSel ? 'bg-primary/15' : 'hover:bg-surface-container/50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-on-surface font-sans text-xs flex items-center gap-1.5">
                            {dev.name}
                            {dev.isFlagged && (
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                BEACONING
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-on-surface-variant font-mono">
                            {dev.mac} • {dev.vendor}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-cyan-300 font-bold">{dev.ip}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dev.tier.includes('Strict')
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : dev.tier.includes('Quarantine')
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {dev.tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant font-mono">{dev.wanFlow}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-bold font-mono ${
                              dev.threatScore > 70 ? 'text-rose-400' : dev.threatScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {dev.threatScore} / 100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
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

        {/* Selected Device Deep Forensics Inspector */}
        {selectedDevice && (
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface font-headline">Device Forensics: {selectedDevice.name}</span>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="text-on-surface-variant hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Hardware & OS Fingerprint</div>
                  <div className="text-xs font-bold text-on-surface">{selectedDevice.fingerprint}</div>
                  <div className="text-[11px] text-on-surface-variant">Assigned: {selectedDevice.vlan}</div>
                </div>

                {/* Contacted FQDNs Table */}
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-2">
                  <div className="text-[10px] text-on-surface-variant uppercase">Observed External Endpoints</div>
                  <div className="space-y-1.5">
                    {selectedDevice.contactedFqdns.map((cf, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] border-b border-outline-variant/10 pb-1">
                        <div>
                          <span className="text-cyan-300 font-bold">{cf.fqdn}</span>
                          <span className="text-on-surface-variant text-[10px] ml-1">:{cf.port}</span>
                        </div>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            cf.status === 'ALLOWED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {cf.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pin-hole Controls */}
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-2">
                  <div className="text-[10px] text-on-surface-variant uppercase">Local Pin-Hole Defenses</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface">Allow Home Assistant Webhook:</span>
                      <span className="text-emerald-400 font-bold">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface">Enforce Local DNS Interception:</span>
                      <span className="text-emerald-400 font-bold">ENFORCED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface">Drop L2 Multicast / Broadcast:</span>
                      <span className="text-emerald-400 font-bold">ENFORCED</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleQuarantine(selectedDevice.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors text-center"
                  >
                    Quarantine Device (VLAN 99)
                  </button>
                  <button
                    onClick={() => onNavigate('packet-inspector')}
                    className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-outline-variant/30"
                  >
                    Sniff Traffic
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
