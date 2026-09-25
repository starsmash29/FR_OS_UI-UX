import React from 'react';
import { SystemStats } from '../types.ts';

interface FooterProps {
  stats: SystemStats;
}

export const Footer: React.FC<FooterProps> = ({ stats }) => {
  return (
    <footer className="fixed bottom-0 left-64 right-0 h-9 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/30 z-30 flex items-center justify-between px-space-xl font-label-sm text-label-sm text-on-surface-variant select-none">
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Throughput:</span>
          <span className="text-primary font-semibold font-mono">4.2 Gbps</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-outline">Packets/s:</span>
          <span className="text-on-surface font-semibold font-mono">{stats.packetsPerSec}</span>
        </div>
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <span className="text-outline">Uptime:</span>
          <span className="text-on-surface font-semibold font-mono">{stats.uptime}</span>
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_rgba(78,222,163,0.8)]"></span>
          <span className="text-outline">Active Engine:</span>
          <span className="text-secondary font-semibold">L7 DPI (AF_XDP Native)</span>
        </div>
      </div>
    </footer>
  );
};
