import React, { useState } from 'react';
import { ViewId, SystemStats } from '../types.ts';

interface SystemSettingsViewProps {
  onNavigate: (view: ViewId) => void;
  stats: SystemStats;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ onNavigate, stats }) => {
  const [hostname, setHostname] = useState<string>('fros-edge-gw-01');
  const [timezone, setTimezone] = useState<string>('UTC (Universal Coordinated Time)');
  const [sshAccess, setSshAccess] = useState<boolean>(true);
  const [fidoEnforced, setFidoEnforced] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Appliance System Configuration & Hardening</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              Host: {hostname}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Global appliance settings, security policies, hardware clock sync, and administrative credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Appliance configuration saved and synchronized to NVRAM.')}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Host Identity */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4">
          <h3 className="text-sm font-bold text-on-surface font-headline border-b border-outline-variant/20 pb-2">
            General Host Identity & Clock
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-on-surface-variant block mb-1">System Hostname</label>
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">NTP Server Sync (PTP / IEEE 1588)</label>
              <input
                type="text"
                defaultValue="time.cloudflare.com, pool.ntp.org"
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
              />
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Hardening */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4">
          <h3 className="text-sm font-bold text-on-surface font-headline border-b border-outline-variant/20 pb-2">
            Administrative Access & FIDO2 Policy
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <div>
                <span className="font-bold text-on-surface block">SSH Daemon (Port 22)</span>
                <span className="text-[10px] text-on-surface-variant">Public Key / Ephemeral Cert Only</span>
              </div>
              <button
                onClick={() => setSshAccess(!sshAccess)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  sshAccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {sshAccess ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <div>
                <span className="font-bold text-on-surface block">Enforce FIDO2 WebAuthn Keys</span>
                <span className="text-[10px] text-on-surface-variant">YubiKey / Passkey required for root</span>
              </div>
              <button
                onClick={() => setFidoEnforced(!fidoEnforced)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  fidoEnforced ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {fidoEnforced ? 'STRICT' : 'OPTIONAL'}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="text-[10px] text-on-surface-variant uppercase">Operator Accounts</span>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface font-bold">admin (Superuser)</span>
                <span className="text-emerald-400 font-mono text-[10px]">FIDO2 Enrolled</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/10">
                <span className="text-on-surface font-bold">auditor (Read-Only)</span>
                <span className="text-cyan-400 font-mono text-[10px]">OIDC Linked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
