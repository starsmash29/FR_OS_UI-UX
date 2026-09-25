import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface PacketInspectorViewProps {
  onNavigate: (view: ViewId) => void;
}

interface CapturedPacket {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'TLS 1.3' | 'DNS' | 'ICMP' | 'ARP';
  length: number;
  info: string;
  hex: string;
  details: {
    frame: string;
    ethernet: string;
    ip: string;
    transport: string;
    payload?: string;
  };
}

export const PacketInspectorView: React.FC<PacketInspectorViewProps> = ({ onNavigate }) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(true);
  const [bpfFilter, setBpfFilter] = useState<string>('tcp or udp port 53');
  const [selectedPacketId, setSelectedPacketId] = useState<number>(1);

  const packets: CapturedPacket[] = [
    {
      id: 1,
      time: '0.000000',
      source: '192.168.1.140',
      destination: '1.1.1.1',
      protocol: 'DNS',
      length: 74,
      info: 'Standard query 0x8a12 A api.github.com',
      hex: `0000   00 e0 67 12 44 90 3c 06  30 4f 9b 11 08 00 45 00   ..g.D.<.0O....E.
0010   00 3c 1a 42 40 00 40 11  9f 12 c0 a8 01 8c 01 01   .<.B@.@.........
0020   01 01 d2 3b 00 35 00 28  e4 f1 8a 12 01 00 00 01   ...;.5.(........
0030   00 00 00 00 00 00 03 61  70 69 06 67 69 74 68 75   .......api.githu
0040   62 03 63 6f 6d 00 00 01  00 01                     b.com.....`,
      details: {
        frame: 'Frame 1: 74 bytes on wire (592 bits), 74 bytes captured on interface eth1',
        ethernet: 'Ethernet II, Src: Apple_30:4f:9b (3c:06:30:4f:9b:11), Dst: FROSRouter_44:90 (00:e0:67:12:44:90)',
        ip: 'Internet Protocol Version 4, Src: 192.168.1.140, Dst: 1.1.1.1, TTL: 64, Total Length: 60',
        transport: 'User Datagram Protocol, Src Port: 53819, Dst Port: 53, Len: 40',
        payload: 'Domain Name System (query): Questions: api.github.com (Type A, Class IN)',
      },
    },
    {
      id: 2,
      time: '0.004120',
      source: '1.1.1.1',
      destination: '192.168.1.140',
      protocol: 'DNS',
      length: 90,
      info: 'Standard query response 0x8a12 A api.github.com A 140.82.121.6',
      hex: `0000   3c 06 30 4f 9b 11 00 e0  67 12 44 90 08 00 45 00   <.0O....g.D...E.
0010   00 4c b2 19 00 00 38 11  4f eb 01 01 01 01 c0 a8   .L....8.O.......
0020   01 8c 00 35 d2 3b 00 38  12 9a 8a 12 81 80 00 01   ...5.;.8........
0030   00 01 00 00 00 00 03 61  70 69 06 67 69 74 68 75   .......api.githu
0040   62 03 63 6f 6d 00 00 01  00 01 c0 0c 00 01 00 01   b.com...........
0050   00 00 00 3c 00 04 8c 52  79 06                     ...<...Ry.`,
      details: {
        frame: 'Frame 2: 90 bytes on wire (720 bits), 90 bytes captured on interface eth0 (WAN)',
        ethernet: 'Ethernet II, Src: FROSRouter_44:90, Dst: Apple_30:4f:9b',
        ip: 'Internet Protocol Version 4, Src: 1.1.1.1, Dst: 192.168.1.140, TTL: 56, ID: 0xb219',
        transport: 'User Datagram Protocol, Src Port: 53, Dst Port: 53819',
        payload: 'Domain Name System (response): api.github.com: type A, class IN, addr 140.82.121.6 (TTL 60s)',
      },
    },
    {
      id: 3,
      time: '0.008419',
      source: '192.168.1.140',
      destination: '140.82.121.6',
      protocol: 'TCP',
      length: 74,
      info: '52194 → 443 [SYN] Seq=0 Win=65535 Len=0 MSS=1460 WS=128 SACK_PERM',
      hex: `0000   00 e0 67 12 44 90 3c 06  30 4f 9b 11 08 00 45 00   ..g.D.<.0O....E.
0010   00 3c 42 1a 40 00 40 06  5e 41 c0 a8 01 8c 8c 52   .<B.@.@.^A.....R
0020   79 06 cc 42 01 bb f8 41  22 a1 00 00 00 00 a0 02   y..B...A".......
0030   ff ff af 8a 00 00 02 04  05 b4 04 02 08 0a a4 b2   ................
0040   11 02 00 00 00 00 01 03  03 07                     ..........`,
      details: {
        frame: 'Frame 3: 74 bytes on wire, TCP 3-Way Handshake SYN initialization',
        ethernet: 'Ethernet II, Src: 3c:06:30:4f:9b:11, Dst: 00:e0:67:12:44:90',
        ip: 'Internet Protocol Version 4, Src: 192.168.1.140, Dst: 140.82.121.6, DF Set',
        transport: 'Transmission Control Protocol, Src Port: 52194, Dst Port: 443, Seq: 0, Flags: 0x002 (SYN)',
      },
    },
    {
      id: 4,
      time: '0.024910',
      source: '140.82.121.6',
      destination: '192.168.1.140',
      protocol: 'TCP',
      length: 74,
      info: '443 → 52194 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0 MSS=1410',
      hex: `0000   3c 06 30 4f 9b 11 00 e0  67 12 44 90 08 00 45 00   <.0O....g.D...E.
0010   00 3c 00 00 40 00 36 06  ac 5b 8c 52 79 06 c0 a8   .<..@.6..[.Ry...
0020   01 8c 01 bb cc 42 39 88  1a 7f f8 41 22 a2 a0 12   .....B9....A"...
0030   fe 88 12 30 00 00 02 04  05 82 04 02 08 0a d2 19   ...0............
0040   99 44 a4 b2 11 02 01 03  03 09                     .D........`,
      details: {
        frame: 'Frame 4: 74 bytes on wire, TCP SYN-ACK response from GitHub CDN',
        ethernet: 'Ethernet II, Src: 00:e0:67:12:44:90, Dst: 3c:06:30:4f:9b:11',
        ip: 'Internet Protocol Version 4, Src: 140.82.121.6, Dst: 192.168.1.140, TTL: 54',
        transport: 'Transmission Control Protocol, Flags: 0x012 (SYN, ACK), Seq: 0, Ack: 1',
      },
    },
    {
      id: 5,
      time: '0.028901',
      source: '192.168.1.140',
      destination: '140.82.121.6',
      protocol: 'TLS 1.3',
      length: 512,
      info: 'Client Hello (SNI=api.github.com, ALPN=h2,http/1.1, JA4=t13d1516h2_8daaf6152771)',
      hex: `0000   00 e0 67 12 44 90 3c 06  30 4f 9b 11 08 00 45 00   ..g.D.<.0O....E.
0010   02 00 42 1b 40 00 40 06  5c 7d c0 a8 01 8c 8c 52   ..B.@.@.\\}.....R
0020   79 06 cc 42 01 bb f8 41  22 a2 39 88 1a 80 80 18   y..B...A".9.....
0030   08 00 d9 41 00 00 01 01  08 0a a4 b2 11 03 d2 19   ...A............
0040   99 44 16 03 01 01 c4 01  00 01 c0 03 03 f1 99 8a   .D..............
0050   12 bc de f0 11 22 33 44  55 66 77 88 99 aa bb cc   ....."3DUfw.....
0060   dd ee ff 00 11 22 33 44  55 66 77 88 99 aa bb 20   ....."3DUfw.... `,
      details: {
        frame: 'Frame 5: 512 bytes on wire, TLS 1.3 Handshake Client Hello',
        ethernet: 'Ethernet II, Src: 3c:06:30:4f:9b:11, Dst: 00:e0:67:12:44:90',
        ip: 'Internet Protocol Version 4, Src: 192.168.1.140, Dst: 140.82.121.6',
        transport: 'Transmission Control Protocol, Src Port: 52194, Dst Port: 443',
        payload: 'Transport Layer Security (TLS 1.3): Client Hello, Server Name Indication (SNI): api.github.com, Cipher Suites: TLS_AES_128_GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256',
      },
    },
  ];

  const selectedPacket = packets.find((p) => p.id === selectedPacketId) || packets[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Deep Forensics & Live Packet Inspector</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              libpcap ring buffer: 100,000 pkts / 256MB
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Zero-copy packet sniffer with protocol tree dissector and dual-pane hex dump analyzer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isCapturing
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {isCapturing ? '⏹ Stop Capture' : '▶ Start Sniffing'}
          </button>
          <button
            onClick={() => alert('Exporting trace to Wireshark .pcapng file...')}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30"
          >
            💾 Export .PCAPNG
          </button>
        </div>
      </div>

      {/* BPF Filter Bar */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <span className="text-xs font-mono font-bold text-primary pl-1">BPF Filter:</span>
        <input
          type="text"
          value={bpfFilter}
          onChange={(e) => setBpfFilter(e.target.value)}
          placeholder="e.g. host 192.168.1.140 and (port 443 or port 53)"
          className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => {}}
          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-xs font-mono font-bold"
        >
          Apply
        </button>
      </div>

      {/* Packet List Pane */}
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-surface-container-low text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2 px-3">No.</th>
                <th className="py-2 px-3">Time (s)</th>
                <th className="py-2 px-3">Source</th>
                <th className="py-2 px-3">Destination</th>
                <th className="py-2 px-3">Protocol</th>
                <th className="py-2 px-3 text-right">Length</th>
                <th className="py-2 px-3">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {packets.map((pkt) => {
                const isSel = pkt.id === selectedPacketId;
                return (
                  <tr
                    key={pkt.id}
                    onClick={() => setSelectedPacketId(pkt.id)}
                    className={`cursor-pointer transition-colors ${
                      isSel ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-surface-container/50'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono">{pkt.id}</td>
                    <td className="py-2 px-3 text-on-surface-variant">{pkt.time}</td>
                    <td className="py-2 px-3 text-cyan-300">{pkt.source}</td>
                    <td className="py-2 px-3 text-emerald-300">{pkt.destination}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold">
                        {pkt.protocol}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-on-surface-variant">{pkt.length} B</td>
                    <td className="py-2 px-3 truncate max-w-md font-sans text-xs">{pkt.info}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Dissector Tree & Hex View (Dual Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Decode Tree */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface font-headline">Packet #{selectedPacket.id} Dissection</span>
            <span className="text-[10px] font-mono text-primary font-bold">{selectedPacket.protocol}</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <details open className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <summary className="font-bold text-on-surface cursor-pointer select-none">
                ▶ {selectedPacket.details.frame}
              </summary>
              <div className="mt-1 pl-4 text-on-surface-variant text-[11px]">
                Arrival Time: Sep 25, 2026 13:28:44 UTC | Frame Number: {selectedPacket.id}
              </div>
            </details>

            <details open className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <summary className="font-bold text-on-surface cursor-pointer select-none">
                ▶ {selectedPacket.details.ethernet}
              </summary>
              <div className="mt-1 pl-4 text-on-surface-variant text-[11px]">
                Type: IPv4 (0x0800) | FCS: OK
              </div>
            </details>

            <details open className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <summary className="font-bold text-on-surface cursor-pointer select-none">
                ▶ {selectedPacket.details.ip}
              </summary>
              <div className="mt-1 pl-4 text-on-surface-variant text-[11px]">
                Header Length: 20 bytes | Differentiated Services: 0x00
              </div>
            </details>

            <details open className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <summary className="font-bold text-on-surface cursor-pointer select-none">
                ▶ {selectedPacket.details.transport}
              </summary>
              <div className="mt-1 pl-4 text-on-surface-variant text-[11px]">
                Stream index: 0 | Checksum verification: Validated
              </div>
            </details>

            {selectedPacket.details.payload && (
              <details open className="p-2.5 rounded-lg bg-surface-container-lowest border border-primary/30">
                <summary className="font-bold text-primary cursor-pointer select-none">
                  ▶ Application Data ({selectedPacket.protocol})
                </summary>
                <div className="mt-1 pl-4 text-amber-300 text-[11px] font-sans">
                  {selectedPacket.details.payload}
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Raw Hex & ASCII Dump */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface font-headline">Raw Payload Byte Stream</span>
            <span className="text-[10px] font-mono text-cyan-400">Offset: 0x0000 - 0x0050</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 overflow-x-auto">
            <pre className="text-[11px] font-mono text-cyan-300 leading-relaxed whitespace-pre select-all">
              {selectedPacket.hex}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
