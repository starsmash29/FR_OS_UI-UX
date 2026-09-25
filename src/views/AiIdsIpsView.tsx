import React, { useState } from 'react';
import { ViewId } from '../types.ts';

interface AiIdsIpsViewProps {
  onNavigate: (view: ViewId) => void;
}

export const AiIdsIpsView: React.FC<AiIdsIpsViewProps> = ({ onNavigate }) => {
  const [autoMitigation, setAutoMitigation] = useState<boolean>(true);
  const [sensitivity, setSensitivity] = useState<number>(85);

  const anomalies = [
    {
      id: 'ANOM-104',
      time: '13:26:10 UTC',
      confidence: '98.4%',
      risk: 'HIGH',
      host: '172.16.50.44 (tuya-smart-cam-02)',
      vector: 'Periodic C2 Beaconing (Strict 60.00s Interval)',
      entropy: '7.94 / 8.00 (High Shannon Entropy)',
      status: 'AUTO-QUARANTINED',
      actionTaken: 'Isolated to VLAN 99. Inter-VLAN routing severed.',
    },
    {
      id: 'ANOM-103',
      time: '13:18:22 UTC',
      confidence: '92.1%',
      risk: 'MED',
      host: '192.168.1.180 (dev-workstation)',
      vector: 'Unusual Outbound SSH Burst to New Geographic ASN',
      entropy: '4.10 / 8.00',
      status: 'RATE-LIMITED',
      actionTaken: 'Throttled to 64 kbps pending user MFA verification.',
    },
    {
      id: 'ANOM-102',
      time: '12:50:04 UTC',
      confidence: '95.0%',
      risk: 'HIGH',
      host: '172.16.50.88 (esp32-sensor-garage)',
      vector: 'DNS Fast-Flux Algorithm (140 DGA queries in 10s)',
      entropy: '7.88 / 8.00',
      status: 'SINKHOLED',
      actionTaken: 'DNS requests redirected to local honeypot listener.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold font-headline text-on-surface">Neural IDS/IPS & Behavioral Anomaly Detector</h2>
            <span className="px-2 py-0.5 text-xs rounded bg-surface-container-highest border border-outline-variant/40 font-mono text-cyan-400 font-semibold">
              Isolation Forest v3.2 / 0.12ms Latency
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-mono">
            Unsupervised real-time flow tensor analysis. Detects zero-days, beaconing, and lateral movement without signatures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs font-mono">
            <span className="text-on-surface-variant">Auto-Quarantine:</span>
            <button
              onClick={() => setAutoMitigation(!autoMitigation)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                autoMitigation ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {autoMitigation ? 'ENABLED (AUTONOMOUS)' : 'DISABLED (ALERT ONLY)'}
            </button>
          </div>
        </div>
      </div>

      {/* Model Health & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Network Baseline Drift</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">8.4 / 100</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Normal Operational Bounds</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Evaluated Flows / Sec</div>
          <div className="text-2xl font-bold font-mono text-primary">142,800</div>
          <div className="text-[11px] text-on-surface-variant font-mono">Zero packet queue drops</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Model Accuracy</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">99.72%</div>
          <div className="text-[11px] text-on-surface-variant font-mono">False Positive Rate: 0.03%</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <div className="text-[10px] text-on-surface-variant uppercase font-mono">Detection Sensitivity</div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-xs font-mono font-bold text-on-surface">{sensitivity}%</span>
          </div>
          <div className="text-[11px] text-on-surface-variant font-mono">Trigger Threshold</div>
        </div>
      </div>

      {/* Behavioral Anomaly Event Feed */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <span className="text-sm font-bold text-on-surface font-headline">Autonomous Mitigation Incidents</span>
          <span className="text-xs font-mono text-rose-400 font-bold">3 Anomalies Neutralized</span>
        </div>

        <div className="space-y-3">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {anom.risk} RISK
                  </span>
                  <span className="text-xs font-bold text-on-surface font-mono">{anom.host}</span>
                  <span className="text-[11px] text-on-surface-variant font-mono">({anom.time})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {anom.status}
                  </span>
                  <span className="text-xs font-mono text-primary font-bold">Confidence: {anom.confidence}</span>
                </div>
              </div>

              <div className="text-xs text-on-surface font-medium">
                Detected Vector: <span className="text-amber-300 font-mono">{anom.vector}</span>
              </div>
              <div className="text-xs text-on-surface-variant font-mono flex items-center justify-between pt-1 border-t border-outline-variant/10">
                <span>Payload Entropy: {anom.entropy}</span>
                <span className="text-cyan-300 font-semibold">{anom.actionTaken}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
