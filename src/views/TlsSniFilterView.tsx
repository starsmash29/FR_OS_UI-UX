import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface TlsSniFilterViewProps {
  onNavigate: (view: ViewId) => void;
}

export const TlsSniFilterView: React.FC<TlsSniFilterViewProps> = ({ onNavigate }) => {
  const [echPolicy, setEchPolicy] = useState<'allow' | 'block_ech' | 'decrypt'>('block_ech');
  const [ocspStapling, setOcspStapling] = useState<boolean>(true);

  const fingerprints = [
    {
      ja4: 't13d1516h2_8daaf6152771_0271d227f273',
      name: 'Google Chrome 128+ / Chromium (macOS & Windows)',
      category: 'Browser / Standard User',
      action: 'ALLOW',
      flows: '14,209',
      trustScore: '99%',
    },
    {
      ja4: 't13d190900_e7b2318cf1a4_e3b0c44298fc',
      name: 'Valve Steam Client Engine (Windows 11)',
      category: 'Gaming / CDN',
      action: 'ALLOW',
      flows: '1,490',
      trustScore: '98%',
    },
    {
      ja4: 't10d010000_deadbeefcafe_000000000000',
      name: 'Cobalt Strike Malleable TLS Stager / Metasploit',
      category: 'C2 Exploit Framework',
      action: 'DROP_AT_HANDSHAKE',
      flows: '42',
      trustScore: '0% (CRITICAL)',
    },
    {
      ja4: 't12i040400_9a0b1c2d3e4f_112233445566',
      name: 'Custom Go / Python-Requests Automated Scraper',
      category: 'Automated Bot / Probe',
      action: 'RATE_LIMIT',
      flows: '348',
      trustScore: '45%',
    },
    {
      ja4: 't13d0308h1_a1b2c3d4e5f6_998877665544',
      name: 'Apple Safari / WebKit Engine (iOS 18 / macOS Sequoia)',
      category: 'Browser / Mobile',
      action: 'ALLOW',
      flows: '8,920',
      trustScore: '100%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">TLS 1.3 / ECH & JA4+ Fingerprinting</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              JA4 / JA4S / JA4L Active
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Cryptographic handshake classification, Encrypted Client Hello (ECH) governance, and rogue TLS client termination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting active JA4 client database...')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
          >
            Export JA4 Signatures
          </button>
        </div>
      </div>

      {/* ECH and Security Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="text-xs font-bold text-on-surface font-headline">Encrypted Client Hello (ECH) Policy</div>
          <p className="text-[11px] text-on-surface-variant font-mono">
            Controls how FR_OS handles DNS type 65 HTTPS SVCB records with encrypted SNI.
          </p>
          <select
            value={echPolicy}
            onChange={(e) => setEchPolicy(e.target.value as any)}
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-xs font-mono text-on-surface"
          >
            <option value="block_ech">Block ECH (Strip DNS type 65 → Enforce SNI visibility)</option>
            <option value="allow">Allow Encrypted ECH Pass-Through (Zero visibility)</option>
            <option value="decrypt">Active MITM Intercept (Re-encrypt with Root CA)</option>
          </select>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="text-xs font-bold text-on-surface font-headline">OCSP & Revocation Verification</div>
          <p className="text-[11px] text-on-surface-variant font-mono">
            Real-time checking against Let's Encrypt, DigiCert, and Sectigo CRL databases.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-on-surface">OCSP Must-Staple:</span>
            <button
              onClick={() => setOcspStapling(!ocspStapling)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                ocspStapling ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {ocspStapling ? 'STRICT VALIDATION' : 'PERMISSIVE'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-xs font-bold text-on-surface font-headline">FR_OS Enterprise Root CA</div>
          <div className="text-[11px] text-on-surface-variant font-mono">
            Subject: CN=FR_OS Transparent Decryption Authority (ECDSA P-384)
          </div>
          <div className="text-emerald-400 font-mono text-xs font-bold">Valid until: 2036-09-01 (10 Years)</div>
          <button
            onClick={() => alert('Downloading FR_OS_Root_CA.crt for device enrollment...')}
            className="w-full py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded text-xs font-mono font-bold transition-all"
          >
            Download CA Certificate (.crt)
          </button>
        </div>
      </div>

      {/* JA4 Fingerprint Rules Table */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
          <h3 className="text-sm font-bold text-on-surface font-headline">JA4 Fingerprint Enforcement Rules</h3>
          <span className="text-xs font-mono text-primary font-bold">5 Active Fingerprint Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">JA4 Fingerprint Hash</th>
                <th className="py-2.5 px-3">Identified Client / Library</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Enforcement Action</th>
                <th className="py-2.5 px-3 text-right">Matching Flows (24h)</th>
                <th className="py-2.5 px-3 text-right">Trust Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {fingerprints.map((fp, i) => (
                <tr key={i} className="hover:bg-surface-container/40">
                  <td className="py-3 px-3 font-mono text-primary font-bold">{fp.ja4}</td>
                  <td className="py-3 px-3 font-sans font-semibold text-on-surface">{fp.name}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{fp.category}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fp.action === 'ALLOW'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : fp.action === 'DROP_AT_HANDSHAKE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {fp.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-on-surface">{fp.flows}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={
                        fp.trustScore.includes('0%')
                          ? 'text-rose-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {fp.trustScore}
                    </span>
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
