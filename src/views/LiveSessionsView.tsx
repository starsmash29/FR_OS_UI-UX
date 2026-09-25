import React, { useState, useEffect } from 'react';
import { ViewId, LiveSession } from '../types.ts';

interface LiveSessionsViewProps {
  onNavigate: (view: ViewId) => void;
}

export const LiveSessionsView: React.FC<LiveSessionsViewProps> = ({ onNavigate }) => {
  const [filterProto, setFilterProto] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);

  const initialSessions: LiveSession[] = [
    {
      id: 'flow-98124',
      state: 'ESTAB',
      proto: 'TCP',
      direction: 'out',
      srcIp: '192.168.1.140',
      srcPort: 52194,
      srcName: 'macbook-pro-m3',
      srcVlan: 'LAN (VID 1)',
      dstIp: '142.250.180.206',
      dstPort: 443,
      dstName: 'google-video.1e100.net',
      dstCountry: 'US 🇺🇸',
      app: 'YouTube 4K AV1 Stream',
      sni: 'rr3---sn-4g5edn6s.googlevideo.com',
      transferRateDown: '34.8 MB/s',
      transferRateUp: '412 kB/s',
      volume: '1.42 GB',
      tcpWin: '65535 (wscale 8)',
      duration: '04m 12s',
      ttl: '54 hops',
      rtt: '8.4 ms',
      ja4: 't13d1516h2_8daaf6152771_0271d227f273',
      cipher: 'TLS_AES_128_GCM_SHA256',
    },
    {
      id: 'flow-98125',
      state: 'INSPECT',
      proto: 'TCP',
      direction: 'in',
      srcIp: '194.26.29.112',
      srcPort: 41890,
      srcName: 'scanner.censys-audit.org',
      srcVlan: 'WAN (eth0)',
      dstIp: '192.168.1.254',
      dstPort: 22,
      dstName: 'firewall-oob.internal',
      dstCountry: 'NL 🇳🇱',
      app: 'SSH Brute Force Probe',
      transferRateDown: '1.2 kB/s',
      transferRateUp: '840 B/s',
      volume: '14.2 kB',
      tcpWin: '14600',
      duration: '00m 04s',
      ttl: '48 hops',
      threat: {
        label: 'C2 Reconnaissance / Auth Failure',
        probability: '99.4%',
      },
      rtt: '34.2 ms',
      cipher: 'SSH-2.0-OpenSSH_8.9',
    },
    {
      id: 'flow-98126',
      state: 'STREAM',
      proto: 'UDP',
      direction: 'out',
      srcIp: '172.16.50.44',
      srcPort: 5353,
      srcName: 'tuya-smart-cam-02',
      srcVlan: 'IoT (VID 50)',
      dstIp: '47.88.58.192',
      dstPort: 8886,
      dstName: 'a3.tuyaus.com',
      dstCountry: 'SG 🇸🇬',
      app: 'Tuya Cloud MQTT Tunnel',
      transferRateDown: '8.4 kB/s',
      transferRateUp: '124 kB/s',
      volume: '42.8 MB',
      tcpWin: 'N/A (UDP)',
      duration: '18h 40m',
      ttl: '42 hops',
      threat: {
        label: 'Telemetry Exfiltration Risk',
        probability: '72.1%',
      },
      rtt: '184.2 ms',
    },
    {
      id: 'flow-98127',
      state: 'ESTAB',
      proto: 'TCP',
      direction: 'out',
      srcIp: '192.168.1.110',
      srcPort: 49812,
      srcName: 'gaming-rig-win11',
      srcVlan: 'LAN (VID 1)',
      dstIp: '155.133.248.50',
      dstPort: 27015,
      dstName: 'valve-ord-steam.net',
      dstCountry: 'US 🇺🇸',
      app: 'Steam CDN Content Delivery',
      sni: 'cdn.steampowered.com',
      transferRateDown: '84.2 MB/s',
      transferRateUp: '1.2 MB/s',
      volume: '18.4 GB',
      tcpWin: '131072',
      duration: '12m 30s',
      ttl: '58 hops',
      rtt: '14.1 ms',
      ja4: 't13d190900_e7b2318cf1a4_e3b0c44298fc',
      cipher: 'TLS_CHACHA20_POLY1305_SHA256',
    },
    {
      id: 'flow-98128',
      state: 'ESTAB',
      proto: 'TCP',
      direction: 'out',
      srcIp: '192.168.1.180',
      srcPort: 54100,
      srcName: 'dev-workstation-linux',
      srcVlan: 'LAN (VID 1)',
      dstIp: '140.82.121.4',
      dstPort: 443,
      dstName: 'github.com',
      dstCountry: 'US 🇺🇸',
      app: 'Git LFS / HTTPS',
      sni: 'github.com',
      transferRateDown: '4.1 MB/s',
      transferRateUp: '12.8 MB/s',
      volume: '340 MB',
      tcpWin: '65535',
      duration: '01m 20s',
      ttl: '52 hops',
      rtt: '28.4 ms',
      cipher: 'TLS_AES_256_GCM_SHA384',
    },
    {
      id: 'flow-98129',
      state: 'STREAM',
      proto: 'UDP',
      direction: 'vpn',
      srcIp: '10.8.0.2',
      srcPort: 51820,
      srcName: 'ceo-iphone-wireguard',
      srcVlan: 'VPN (wg0)',
      dstIp: '192.168.1.10',
      dstPort: 445,
      dstName: 'enterprise-nas.internal',
      dstCountry: 'LOCAL',
      app: 'SMB Direct over WireGuard',
      transferRateDown: '18.2 MB/s',
      transferRateUp: '1.1 MB/s',
      volume: '890 MB',
      tcpWin: 'N/A (WireGuard Encapsulated)',
      duration: '34m 12s',
      ttl: '64 hops',
      rtt: '3.1 ms',
    },
  ];

  const [sessions, setSessions] = useState<LiveSession[]>(initialSessions);

  // Live session kill simulation
  const handleKillFlow = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterProto !== 'all' && s.proto !== filterProto) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.srcIp.includes(q) ||
        s.dstIp.includes(q) ||
        s.srcName.toLowerCase().includes(q) ||
        s.dstName.toLowerCase().includes(q) ||
        s.app.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Live Flow & DPI Session Matrix</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              Deep Packet Inspection: L7 Engine Running
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Full stateful TCP reassembly & TLS SNI/JA4 payload classification at 10 Gbps line rate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isLiveActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-on-surface-variant'}`} />
            {isLiveActive ? 'STREAMING REAL-TIME' : 'PAUSED'}
          </button>
          <button
            onClick={() => onNavigate('packet-inspector')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold shadow-md shadow-primary/20"
          >
            Launch Hex Inspector
          </button>
        </div>
      </div>

      {/* Control Strip & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-2">
          {['all', 'TCP', 'UDP'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterProto(p)}
              className={`px-3 py-1 rounded-md text-xs font-mono uppercase transition-all ${
                filterProto === p
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p}
            </button>
          ))}
          <span className="text-xs text-on-surface-variant font-mono pl-2">
            Showing {filteredSessions.length} active flows
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Filter by IP, DNS, SNI, or App..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-mono bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-3 pr-8 py-1.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedSession ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                  <tr>
                    <th className="py-2 px-3">State</th>
                    <th className="py-2 px-3">Proto</th>
                    <th className="py-2 px-3">Source (Client)</th>
                    <th className="py-2 px-3">Destination (Remote Host)</th>
                    <th className="py-2 px-3">Application / DPI</th>
                    <th className="py-2 px-3 text-right">Throughput (RX/TX)</th>
                    <th className="py-2 px-3 text-right">Total Vol</th>
                    <th className="py-2 px-3 text-center">Threat / Flag</th>
                    <th className="py-2 px-3 text-center">Kill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                  {filteredSessions.map((s) => {
                    const isSelected = selectedSession?.id === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary/15' : 'hover:bg-surface-container/50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.state === 'ESTAB'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : s.state === 'STREAM'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            }`}
                          >
                            {s.state}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-cyan-300">{s.proto}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-on-surface">{s.srcName}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">
                            {s.srcIp}:{s.srcPort} ({s.srcVlan})
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-on-surface flex items-center gap-1.5">
                            <span>{s.dstCountry}</span>
                            <span className="truncate max-w-[140px]">{s.dstName}</span>
                          </div>
                          <div className="text-[10px] text-on-surface-variant font-mono">
                            {s.dstIp}:{s.dstPort}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-surface-container-highest text-primary border border-outline-variant/30">
                            {s.app}
                          </span>
                          {s.sni && <div className="text-[9px] text-on-surface-variant truncate max-w-[160px] mt-0.5">{s.sni}</div>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="text-emerald-400 font-bold">↓ {s.transferRateDown}</div>
                          <div className="text-cyan-400 text-[10px]">↑ {s.transferRateUp}</div>
                        </td>
                        <td className="py-3 px-3 text-right text-on-surface-variant font-bold">{s.volume}</td>
                        <td className="py-3 px-3 text-center">
                          {s.threat ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-bold">
                              {s.threat.label} ({s.threat.probability})
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400">CLEAN</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleKillFlow(s.id)}
                            className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition-all"
                            title="Inject TCP RST packet to terminate flow immediately"
                          >
                            RST KILL
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

        {/* Selected Session Deep Inspector */}
        {selectedSession && (
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="text-xs font-bold text-on-surface font-headline">Conntrack Flow Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-on-surface-variant hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Flow ID & Lifetime</div>
                  <div className="text-sm font-bold text-primary">{selectedSession.id}</div>
                  <div className="text-[11px] text-on-surface">Duration: {selectedSession.duration} | TTL: {selectedSession.ttl}</div>
                  <div className="text-[11px] text-emerald-400">RTT Latency: {selectedSession.rtt}</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1.5">
                  <div className="text-[10px] text-on-surface-variant uppercase">TCP/IP Protocol Parameters</div>
                  <div className="text-[11px] text-on-surface">Window Size: {selectedSession.tcpWin}</div>
                  <div className="text-[11px] text-on-surface truncate">Cipher: {selectedSession.cipher || 'Cleartext / Direct UDP'}</div>
                  {selectedSession.ja4 && (
                    <div className="pt-1">
                      <span className="text-[9px] text-on-surface-variant block">JA4 Client Fingerprint</span>
                      <span className="text-[10px] text-amber-300 font-mono break-all">{selectedSession.ja4}</span>
                    </div>
                  )}
                </div>

                {selectedSession.threat && (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 space-y-1 text-rose-300">
                    <div className="text-[10px] uppercase font-bold text-rose-400">Security Warning</div>
                    <div className="font-semibold text-xs">{selectedSession.threat.label}</div>
                    <div className="text-[11px] opacity-90">Engine confidence: {selectedSession.threat.probability}</div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleKillFlow(selectedSession.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors text-center"
                  >
                    Kill TCP Flow (RST)
                  </button>
                  <button
                    onClick={() => onNavigate('packet-inspector')}
                    className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-outline-variant/30"
                  >
                    PCAP Hex
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
