import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface FirmwareUpdateViewProps {
  onNavigate: (view: ViewId) => void;
}

export const FirmwareUpdateView: React.FC<FirmwareUpdateViewProps> = ({ onNavigate }) => {
  const [activePartition, setActivePartition] = useState<'A' | 'B'>('A');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateLog, setUpdateLog] = useState<string[]>([]);

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    setUpdateLog(['Verifying cryptographic Ed25519 signature on update payload...']);
    setTimeout(() => {
      setUpdateLog((prev) => [...prev, '✓ Image signature verified: Trusted FR_OS Release Key 0x9482A1B0']);
    }, 600);
    setTimeout(() => {
      setUpdateLog((prev) => [...prev, 'Flashing payload to Partition B (RootFS + Unified Kernel Image)...']);
    }, 1200);
    setTimeout(() => {
      setUpdateLog((prev) => [...prev, 'Verifying TPM 2.0 PCR-7 secure boot measurements... OK']);
    }, 1800);
    setTimeout(() => {
      setUpdateLog((prev) => [
        ...prev,
        '✓ Partition B staged successfully. Ready for fail-safe A/B switch reboot.',
      ]);
      setIsUpdating(false);
    }, 2400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Dual-Partition A/B Kernel & Bytecode Attestation</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              TPM 2.0 Measured Boot: VALID
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Immutable rootfs with atomic rollback. Live eBPF bytecode verified by in-kernel safety verifier prior to JIT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-mono font-bold transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Flashing Partition B...' : 'Stage Firmware v4.20.0-rc3'}
          </button>
        </div>
      </div>

      {/* Dual Partition Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partition A */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            activePartition === 'A'
              ? 'bg-surface-container-low border-emerald-500/40 shadow-lg shadow-emerald-500/5'
              : 'bg-surface-container-lowest border-outline-variant/20 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-bold text-on-surface font-headline">Partition A (Active Boot System)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              RUNNING
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">OS Release:</span>
              <span className="font-bold text-on-surface">FR_OS v4.19.2-hardened</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Kernel Version:</span>
              <span className="text-primary font-bold">Linux 6.12.8-rt (Real-Time PREEMPT)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">TPM PCR-7 Measurement:</span>
              <span className="text-emerald-400 font-bold">0x88fa9102... Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">RootFS Status:</span>
              <span className="text-on-surface">dm-verity Read-Only (Cryptographic Lock)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Uptime:</span>
              <span className="text-on-surface">42 days, 1 hour</span>
            </div>
          </div>
        </div>

        {/* Partition B */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            activePartition === 'B'
              ? 'bg-surface-container-low border-primary/40'
              : 'bg-surface-container-lowest border-outline-variant/20'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-sm font-bold text-on-surface font-headline">Partition B (Secondary / Staged)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              STAGED / STANDBY
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Target Release:</span>
              <span className="font-bold text-cyan-300">FR_OS v4.20.0-rc3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Target Kernel:</span>
              <span className="text-primary font-bold">Linux 6.14.0-rc1 (AVX-512 eBPF JIT)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Signature Authority:</span>
              <span className="text-emerald-400 font-bold">FR_OS Release Signing Key ID 0x9482</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Rollback Protection:</span>
              <span className="text-on-surface">Auto-revert to Partition A if boot watchdog fails</span>
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/20 mt-3 flex justify-end">
            <button
              onClick={() => {
                alert('Switching active partition boot flag to Partition B. System will boot into v4.20.0-rc3 upon next restart.');
                setActivePartition('B');
              }}
              className="px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded text-xs font-mono font-bold transition-all"
            >
              Set Partition B as Default Boot
            </button>
          </div>
        </div>
      </div>

      {/* Live Flashing Output */}
      {updateLog.length > 0 && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 space-y-2">
          <div className="text-xs font-bold text-on-surface font-headline">Firmware Staging Console Stream</div>
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-mono text-xs text-cyan-300 space-y-1">
            {updateLog.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Live eBPF Programs in Kernel Memory */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <span className="text-xs font-bold text-on-surface font-headline">Loaded eBPF Kernel Programs & Verifier Attestation</span>
          <span className="text-[10px] font-mono text-emerald-400">All Programs JIT Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase tracking-wider text-on-surface-variant/80 border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3">Program Name</th>
                <th className="py-2.5 px-3">eBPF Type</th>
                <th className="py-2.5 px-3">Hook Attachment</th>
                <th className="py-2.5 px-3">Instruction Count</th>
                <th className="py-2.5 px-3">JIT Machine Code</th>
                <th className="py-2.5 px-3 text-right">Execution Avg Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              <tr className="hover:bg-surface-container/40">
                <td className="py-3 px-3 font-bold text-primary">xdp_filter_main</td>
                <td className="py-3 px-3 text-cyan-300">BPF_PROG_TYPE_XDP</td>
                <td className="py-3 px-3 text-on-surface">eth0, eth1 (Native Driver Hook)</td>
                <td className="py-3 px-3 text-on-surface-variant">1,490 BPF ops</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">x86_64 JIT (Verified)</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">4.2 ns</td>
              </tr>
              <tr className="hover:bg-surface-container/40">
                <td className="py-3 px-3 font-bold text-primary">tc_cls_egress</td>
                <td className="py-3 px-3 text-cyan-300">BPF_PROG_TYPE_SCHED_CLS</td>
                <td className="py-3 px-3 text-on-surface">eth0 Egress (Traffic Shaping)</td>
                <td className="py-3 px-3 text-on-surface-variant">840 BPF ops</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">x86_64 JIT (Verified)</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">8.1 ns</td>
              </tr>
              <tr className="hover:bg-surface-container/40">
                <td className="py-3 px-3 font-bold text-primary">sockops_rtt</td>
                <td className="py-3 px-3 text-cyan-300">BPF_PROG_TYPE_SOCK_OPS</td>
                <td className="py-3 px-3 text-on-surface">TCP State Transition Hook</td>
                <td className="py-3 px-3 text-on-surface-variant">312 BPF ops</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">x86_64 JIT (Verified)</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">2.4 ns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
