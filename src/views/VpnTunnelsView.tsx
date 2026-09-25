import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface VpnTunnelsViewProps {
  onNavigate: (view: ViewId) => void;
}

interface VpnPeer {
  id: string;
  name: string;
  type: 'WireGuard' | 'IPsec IKEv2';
  endpoint: string;
  allowedIps: string;
  publicKey: string;
  lastHandshake: string;
  tx: string;
  rx: string;
  status: 'connected' | 'idle' | 'down';
}

export const VpnTunnelsView: React.FC<VpnTunnelsViewProps> = ({ onNavigate }) => {
  const [showAddPeer, setShowAddPeer] = useState<boolean>(false);
  const [selectedPeer, setSelectedPeer] = useState<VpnPeer | null>(null);

  const peers: VpnPeer[] = [
    {
      id: 'peer-fra',
      name: 'Frankfurt Branch Office (Site-to-Site)',
      type: 'WireGuard',
      endpoint: '194.15.34.88:51820',
      allowedIps: '10.8.0.10/32, 192.168.20.0/24',
      publicKey: 'eB9f...7mK2x8La19= (Curve25519)',
      lastHandshake: '14 seconds ago',
      tx: '4.8 GB',
      rx: '18.2 GB',
      status: 'connected',
    },
    {
      id: 'peer-aws',
      name: 'AWS Cloud VPC Gateway (us-east-1)',
      type: 'WireGuard',
      endpoint: '52.90.114.22:51820',
      allowedIps: '10.8.0.50/32, 172.31.0.0/16',
      publicKey: 'zK84...qP19xX4m00= (Curve25519)',
      lastHandshake: '28 seconds ago',
      tx: '8.4 GB',
      rx: '12.1 GB',
      status: 'connected',
    },
    {
      id: 'peer-ceo',
      name: 'Executive Laptop (M3 Max Roaming)',
      type: 'WireGuard',
      endpoint: '82.165.197.12:61902',
      allowedIps: '10.8.0.2/32',
      publicKey: 'wT11...0mY4v9Zp44= (Curve25519)',
      lastHandshake: '42 seconds ago',
      tx: '410 MB',
      rx: '1.8 GB',
      status: 'connected',
    },
    {
      id: 'peer-azure',
      name: 'Azure Primary Interconnect (IKEv2)',
      type: 'IPsec IKEv2',
      endpoint: '20.105.12.80:500',
      allowedIps: '10.100.0.0/16',
      publicKey: 'AES-256-GCM / SHA-384 / DH-Group 14',
      lastHandshake: '1m 12s ago',
      tx: '1.2 GB',
      rx: '3.4 GB',
      status: 'connected',
    },
    {
      id: 'peer-dev',
      name: 'DevOps Lead Android / WireGuard',
      type: 'WireGuard',
      endpoint: 'Dynamic Mobile IPv6',
      allowedIps: '10.8.0.4/32',
      publicKey: 'vX77...8nQ2p3K811= (Curve25519)',
      lastHandshake: '2 hours ago',
      tx: '12 MB',
      rx: '48 MB',
      status: 'idle',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">WireGuard® & IPsec Encrypted Overlay</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              Noise_IK 256-bit ChaCha20-Poly1305
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            High-performance kernel-space crypto routing with zero packet overhead. WireGuard wg0 active on UDP 51820.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddPeer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold shadow-md shadow-primary/20 transition-all"
          >
            + Add Peer / Client
          </button>
        </div>
      </div>

      {/* WireGuard Interface Identity Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant font-mono uppercase">Interface wg0 Configuration</div>
          <div className="text-sm font-bold text-on-surface font-headline">Server Public Key</div>
          <div className="p-2 rounded bg-surface-container-lowest text-[11px] font-mono text-primary truncate select-all">
            aB9xKl98mZ2pQ14vNx00a98bC==
          </div>
          <div className="text-[11px] font-mono text-on-surface-variant">Listen Port: UDP 51820 | MTU: 1420</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant font-mono uppercase">Cryptographic Routing</div>
          <div className="text-sm font-bold text-on-surface font-headline">Tunnel Subnet</div>
          <div className="text-base font-bold font-mono text-emerald-400">10.8.0.1 / 24</div>
          <div className="text-[11px] font-mono text-on-surface-variant">4 Peers Connected | 1 Standby</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="text-[10px] text-on-surface-variant font-mono uppercase">Throughput Aggregation</div>
          <div className="text-sm font-bold text-on-surface font-headline">Cumulative Data</div>
          <div className="text-base font-bold font-mono text-cyan-400">TX: 14.8 GB | RX: 35.5 GB</div>
          <div className="text-[11px] font-mono text-on-surface-variant">Zero Packet Drops (Loss: 0.00%)</div>
        </div>
      </div>

      {/* Peers Table */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
          <h3 className="text-sm font-bold text-on-surface font-headline">Configured Peers & Remote Gateways</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">All Crypto Handshakes Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Peer Name</th>
                <th className="py-2.5 px-3">Tunnel Type</th>
                <th className="py-2.5 px-3">Endpoint</th>
                <th className="py-2.5 px-3">Allowed IPs / Subnets</th>
                <th className="py-2.5 px-3">Latest Handshake</th>
                <th className="py-2.5 px-3 text-right">TX / RX</th>
                <th className="py-2.5 px-3 text-center">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {peers.map((peer) => (
                <tr key={peer.id} className="hover:bg-surface-container/40">
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        peer.status === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${peer.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-on-surface-variant'}`} />
                      {peer.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="font-semibold text-xs text-on-surface">{peer.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{peer.publicKey}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-300">{peer.type}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{peer.endpoint}</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold">{peer.allowedIps}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{peer.lastHandshake}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-cyan-400">↑ {peer.tx}</span> / <span className="text-emerald-400">↓ {peer.rx}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedPeer(peer)}
                      className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-primary text-[10px] font-bold"
                    >
                      QR Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code / Config Modal */}
      {selectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface font-headline">{selectedPeer.name}</h3>
              <button onClick={() => setSelectedPeer(null)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <div className="text-center p-4 rounded-xl bg-white text-black flex flex-col items-center justify-center space-y-2">
              <div className="w-48 h-48 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-mono text-xs p-4 text-center">
                [ QR Code Matrix: wg://{selectedPeer.allowedIps} ]
              </div>
              <p className="text-[11px] font-mono text-neutral-600">Scan with WireGuard iOS / Android app</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-xs font-mono space-y-1">
              <div className="text-[10px] text-on-surface-variant uppercase">Client Config Excerpt</div>
              <pre className="text-[11px] text-cyan-300 overflow-x-auto p-1 leading-relaxed">
{`[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = ${selectedPeer.allowedIps.split(',')[0]}
DNS = 10.8.0.1

[Peer]
PublicKey = aB9xKl98mZ2pQ14vNx00a98bC==
Endpoint = 82.165.197.12:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPeer(null)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-mono font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Peer Modal */}
      {showAddPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface font-headline">Provision New WireGuard Peer</h3>
              <button onClick={() => setShowAddPeer(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-on-surface-variant block mb-1">Peer Identifier / Device Name</label>
                <input
                  type="text"
                  placeholder="e.g. Field Engineer iPad Pro"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-on-surface-variant block mb-1">Assigned VIP</label>
                  <input
                    type="text"
                    defaultValue="10.8.0.15/32"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant block mb-1">Persistent Keepalive</label>
                  <input
                    type="text"
                    defaultValue="25 seconds"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-on-surface"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setShowAddPeer(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddPeer(false)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-mono font-bold"
              >
                Generate Keypair & Add Peer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
