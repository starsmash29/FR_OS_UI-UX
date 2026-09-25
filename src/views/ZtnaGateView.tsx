import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface ZtnaGateViewProps {
  onNavigate: (view: ViewId) => void;
}

interface ZtnaSession {
  id: string;
  user: string;
  email: string;
  device: string;
  postureScore: number;
  diskEncrypted: boolean;
  edrActive: boolean;
  role: string;
  resource: string;
  status: 'AUTHORIZED' | 'CHALLENGE_MFA' | 'DENIED';
  ip: string;
}

export const ZtnaGateView: React.FC<ZtnaGateViewProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState<ZtnaSession[]>([
    {
      id: 'ztna-01',
      user: 'Sarah Connor',
      email: 'sarah.connor@corp.internal',
      device: 'MacBook Pro M3 (macOS 15.1)',
      postureScore: 98,
      diskEncrypted: true,
      edrActive: true,
      role: 'Staff Security Engineer',
      resource: 'Production Kubernetes API & CI/CD',
      status: 'AUTHORIZED',
      ip: '10.8.0.2',
    },
    {
      id: 'ztna-02',
      user: 'Alex Rivera',
      email: 'alex.rivera@corp.internal',
      device: 'Dell XPS 15 (Windows 11 Enterprise)',
      postureScore: 94,
      diskEncrypted: true,
      edrActive: true,
      role: 'DevOps Architect',
      resource: 'Database Replication Gateway',
      status: 'AUTHORIZED',
      ip: '10.8.0.5',
    },
    {
      id: 'ztna-03',
      user: 'Contractor Mike',
      email: 'mike.ext@external-vendor.com',
      device: 'Custom PC (Linux Arch)',
      postureScore: 42,
      diskEncrypted: false,
      edrActive: false,
      role: 'External Auditor',
      resource: 'Financial NAS Share',
      status: 'DENIED',
      ip: '192.168.99.50',
    },
  ]);

  const handleRevoke = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'DENIED', postureScore: 0 } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Zero Trust Network Access (ZTNA) Identity Gate</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              OIDC / SAML 2.0 + Continuous Posture Evaluation
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Grants ephemeral least-privilege tunnels based on verified user identity, hardware FIDO2 tokens, and device compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Posture audit completed: 2 compliant sessions active.')}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold"
          >
            Re-Evaluate Posture
          </button>
        </div>
      </div>

      {/* Identity & IdP Providers Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Identity Provider (IdP)</div>
          <div className="text-sm font-bold text-on-surface font-headline">Enterprise Google Workspace / OIDC</div>
          <div className="text-emerald-400 text-xs font-mono font-bold">✓ SSO & SCIM Directory Synced</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Enforce FIDO2 WebAuthn Hardware Keys</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Continuous Device Posture</div>
          <div className="text-sm font-bold text-on-surface font-headline">Telemetry Health Baseline</div>
          <div className="text-cyan-400 text-xs font-mono font-bold">Disk Encryption + Falcon EDR Required</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Evaluation Interval: Every 60 seconds</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Access Enforcement Engine</div>
          <div className="text-sm font-bold text-on-surface font-headline">Zero-Trust Kernel Micro-Tunnels</div>
          <div className="text-primary text-xs font-mono font-bold">WireGuard Cryptokey Routing (L4/L7)</div>
          <div className="text-[11px] text-on-surface-variant font-mono">No lateral LAN traversal allowed</div>
        </div>
      </div>

      {/* Active User Sessions */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
          <h3 className="text-sm font-bold text-on-surface font-headline">Active Authenticated ZTNA Sessions</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">2 Verified Tunnels</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">User & Email</th>
                <th className="py-2.5 px-3">Device Posture</th>
                <th className="py-2.5 px-3">Security Checks</th>
                <th className="py-2.5 px-3">Target Micro-Segment</th>
                <th className="py-2.5 px-3">Client VIP</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container/40">
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'AUTHORIZED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-on-surface font-sans text-xs">{s.user}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{s.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-on-surface">{s.device}</div>
                    <div
                      className={`text-[10px] font-bold font-mono ${
                        s.postureScore > 80 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      Posture Score: {s.postureScore} / 100
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[11px]">
                    <div className="text-emerald-400">{s.diskEncrypted ? '✓ Encrypted' : '✕ No Encryption'}</div>
                    <div className="text-cyan-400">{s.edrActive ? '✓ EDR Falcon' : '✕ Missing EDR'}</div>
                  </td>
                  <td className="py-3 px-3 text-primary font-sans font-semibold">{s.resource}</td>
                  <td className="py-3 px-3 text-on-surface-variant font-mono">{s.ip}</td>
                  <td className="py-3 px-3 text-center">
                    {s.status === 'AUTHORIZED' ? (
                      <button
                        onClick={() => handleRevoke(s.id)}
                        className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded text-[10px] font-bold"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-rose-400 text-[10px] font-bold">TERMINATED</span>
                    )}
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
