import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface AuditLogsViewProps {
  onNavigate: (view: ViewId) => void;
}

interface AuditEntry {
  id: number;
  time: string;
  actor: string;
  subsystem: 'FIREWALL' | 'AUTH' | 'KERNEL' | 'VPN' | 'DHCP' | 'ZTNA';
  action: string;
  target: string;
  severity: 'INFO' | 'WARN' | 'CRIT';
  hash: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ onNavigate }) => {
  const [filterSubsystem, setFilterSubsystem] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const logs: AuditEntry[] = [
    {
      id: 81294,
      time: '2026-09-25 13:28:44 UTC',
      actor: 'kernel:ebpf_xdp',
      subsystem: 'FIREWALL',
      action: 'XDP_DROP triggered on ingress packet',
      target: '185.220.101.5 (Log4j JNDI attempt)',
      severity: 'CRIT',
      hash: 'sha256:4a8b...1f09',
    },
    {
      id: 81293,
      time: '2026-09-25 13:25:10 UTC',
      actor: 'operator:admin (UID 0 via WebGUI)',
      subsystem: 'AUTH',
      action: 'MFA session authenticated with FIDO2 WebAuthn token',
      target: 'Web Administration Session #4102',
      severity: 'INFO',
      hash: 'sha256:77bc...98aa',
    },
    {
      id: 81292,
      time: '2026-09-25 13:20:00 UTC',
      actor: 'daemon:crowdsec-sync',
      subsystem: 'FIREWALL',
      action: 'Threat blacklist refreshed: 4,102 new malicious IPs ingested',
      target: 'eBPF Map: /sys/fs/bpf/fros_blacklist',
      severity: 'INFO',
      hash: 'sha256:91ef...22cb',
    },
    {
      id: 81291,
      time: '2026-09-25 13:14:22 UTC',
      actor: 'daemon:ztna-gate',
      subsystem: 'ZTNA',
      action: 'Device posture failure: Outdated OS build rejected from Internal NAS',
      target: '192.168.99.12 (Guest Android 11)',
      severity: 'WARN',
      hash: 'sha256:00fa...8b77',
    },
    {
      id: 81290,
      time: '2026-09-25 13:05:44 UTC',
      actor: 'daemon:wireguard',
      subsystem: 'VPN',
      action: 'Cryptographic handshake completed with peer Executive Roaming',
      target: '10.8.0.2 via 82.165.197.12:61902',
      severity: 'INFO',
      hash: 'sha256:bc14...44de',
    },
    {
      id: 81289,
      time: '2026-09-25 12:58:19 UTC',
      actor: 'daemon:kea-dhcp4',
      subsystem: 'DHCP',
      action: 'Dynamic lease granted: Lease duration 86,400s',
      target: '192.168.1.140 -> 3c:06:30:4f:9b:11 (macbook-pro-m3)',
      severity: 'INFO',
      hash: 'sha256:aa29...8811',
    },
    {
      id: 81288,
      time: '2026-09-25 12:44:02 UTC',
      actor: 'operator:admin',
      subsystem: 'FIREWALL',
      action: 'Rule #500 modified: IoT network isolation enforcement verified',
      target: 'Firewall Policy Table: Chain FORWARD',
      severity: 'INFO',
      hash: 'sha256:5501...12ef',
    },
  ];

  const filteredLogs = logs.filter((log) => {
    if (filterSubsystem !== 'all' && log.subsystem !== filterSubsystem) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q)
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
            <h2 className="text-xl font-bold font-headline text-on-surface">Cryptographic Audit & Compliance Ledger</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              Merkle Tree Root: 0x9a8f...b271
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Append-only tamper-evident hash chain. Conforms to SOC2, ISO 27001, and HIPAA compliance requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Cryptographic verification completed: All 81,294 entries verified with valid Merkle hash proof.')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold"
          >
            ✓ Verify Hash Chain
          </button>
          <button
            onClick={() => alert('Exporting audit stream to RFC 5424 Remote Syslog endpoint.')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
          >
            SIEM Exporter
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'FIREWALL', 'AUTH', 'KERNEL', 'VPN', 'DHCP', 'ZTNA'].map((sub) => (
            <button
              key={sub}
              onClick={() => setFilterSubsystem(sub)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                filterSubsystem === sub
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-mono bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-3 pr-8 py-1.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">Entry #</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Process</th>
                <th className="py-2.5 px-3">Subsystem</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target Object</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3 text-right">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container/40">
                  <td className="py-3 px-3 text-on-surface-variant font-bold">#{log.id}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{log.time}</td>
                  <td className="py-3 px-3 font-semibold text-primary">{log.actor}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold">
                      {log.subsystem}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface font-sans text-xs">{log.action}</td>
                  <td className="py-3 px-3 text-amber-300 font-mono text-[11px]">{log.target}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'CRIT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : log.severity === 'WARN'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-on-surface-variant font-mono text-[10px] select-all">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
