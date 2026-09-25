import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface AdBlockViewProps {
  onNavigate: (view: ViewId) => void;
}

interface DnsQuery {
  id: number;
  time: string;
  client: string;
  domain: string;
  type: string;
  status: 'SINKHOLED' | 'RESOLVED';
  upstream?: string;
  latency: string;
  list?: string;
}

export const AdBlockView: React.FC<AdBlockViewProps> = ({ onNavigate }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newDomain, setNewDomain] = useState<string>('');

  const queries: DnsQuery[] = [
    { id: 1, time: '13:28:44', client: '192.168.1.140', domain: 'pagead2.googlesyndication.com', type: 'A', status: 'SINKHOLED', latency: '0.1 ms', list: 'StevenBlack + EasyList' },
    { id: 2, time: '13:28:43', client: '192.168.1.140', domain: 'api.github.com', type: 'A', status: 'RESOLVED', upstream: '1.1.1.1 (DoH/DNSSEC)', latency: '12.4 ms' },
    { id: 3, time: '13:28:40', client: '172.16.50.44', domain: 'telemetry.tuyaus.com', type: 'A', status: 'SINKHOLED', latency: '0.1 ms', list: 'IoT Tracking Matrix' },
    { id: 4, time: '13:28:38', client: '192.168.1.110', domain: 'analytics.tiktok.com', type: 'AAAA', status: 'SINKHOLED', latency: '0.1 ms', list: 'OISD Big Filter' },
    { id: 5, time: '13:28:35', client: '192.168.1.110', domain: 'steamcommunity.com', type: 'A', status: 'RESOLVED', upstream: '1.1.1.1 (DoH/DNSSEC)', latency: '14.1 ms' },
    { id: 6, time: '13:28:30', client: '192.168.1.180', domain: 'registry.npmjs.org', type: 'A', status: 'RESOLVED', upstream: '1.1.1.1 (DoH/DNSSEC)', latency: '9.8 ms' },
  ];

  const filteredQueries = queries.filter((q) => {
    if (filterStatus === 'sinkholed' && q.status !== 'SINKHOLED') return false;
    if (filterStatus === 'resolved' && q.status !== 'RESOLVED') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">DNS Sinkhole & Network-Wide Ad Blocker</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              2,410,980 Domains in RAM Sinkhole
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Line-rate DNS inspection with DNSSEC cryptographic validation and zero-telemetry caching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Blocklists updated from GitHub & OISD mirrors.')}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold"
          >
            Update Blocklists
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Total DNS Queries (24h)</div>
          <div className="text-2xl font-bold font-mono text-on-surface">84,120</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Average 0.8ms latency</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Blocked Queries</div>
          <div className="text-2xl font-bold font-mono text-rose-400">19,402</div>
          <div className="text-[11px] text-rose-400/90 font-mono">23.1% network queries sinkholed</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">DNSSEC Validation</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">100% SECURE</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Zero forged answers</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Upstream Protocol</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">DoH (TLS 1.3)</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Cloudflare + Quad9 Anycast</div>
        </div>
      </div>

      {/* Domain Quick Add Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Add custom domain to blacklist or whitelist (e.g. tracking.custom-app.com)..."
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (newDomain) {
                alert(`Domain ${newDomain} added to permanent DNS Blacklist.`);
                setNewDomain('');
              }
            }}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold"
          >
            Blacklist (Sinkhole)
          </button>
          <button
            onClick={() => {
              if (newDomain) {
                alert(`Domain ${newDomain} added to permanent Whitelist.`);
                setNewDomain('');
              }
            }}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold"
          >
            Whitelist (Allow)
          </button>
        </div>
      </div>

      {/* Real-time Query Log */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-on-surface font-headline">Live DNS Query Stream</h3>
            <div className="flex items-center gap-1">
              {['all', 'sinkholed', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                    filterStatus === f
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400">Live Listening on 127.0.0.1:53</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Queried Domain</th>
                <th className="py-2.5 px-3">Record</th>
                <th className="py-2.5 px-3">Verdict Status</th>
                <th className="py-2.5 px-3">Upstream / Match</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {filteredQueries.map((q) => (
                <tr key={q.id} className="hover:bg-surface-container/40">
                  <td className="py-3 px-3 text-on-surface-variant">{q.time}</td>
                  <td className="py-3 px-3 text-primary font-bold">{q.client}</td>
                  <td className="py-3 px-3 font-semibold text-on-surface">{q.domain}</td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">{q.type}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'SINKHOLED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">
                    {q.status === 'SINKHOLED' ? (
                      <span className="text-rose-400 font-sans text-[11px]">{q.list}</span>
                    ) : (
                      <span className="text-cyan-400 font-sans text-[11px]">{q.upstream}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">{q.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
