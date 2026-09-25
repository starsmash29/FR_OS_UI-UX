import React from 'react';
import { ViewId } from '../types.ts';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Active Engine Threat Notice',
      desc: 'Threat database signature update v2025.04.12 loaded (481,209 rules active). All interfaces operating at wire speed.',
      type: 'info',
      time: '14m ago',
      view: 'threat-intel' as ViewId,
    },
    {
      id: '2',
      title: 'Critical Intrusion Prevented (Log4j RCE)',
      desc: 'ET EXPLOIT Apache Log4j RCE from 194.26.29.112 dropped at eBPF XDP hook before userspace handoff.',
      type: 'critical',
      time: '28m ago',
      view: 'ai-ids-ips' as ViewId,
    },
    {
      id: '3',
      title: 'Staged Firmware Update Available',
      desc: 'FR_OS 4.19.0-RC2 (Kernel 6.9.4) verified with Cosign Sigstore. Partition Slot B is ready for scheduled reboot.',
      type: 'warning',
      time: '1h ago',
      view: 'firmware-update' as ViewId,
    },
    {
      id: '4',
      title: 'IoT Behavioral Rogue Anomaly',
      desc: 'ESP32 DIY Sensor (192.168.20.211) quarantined due to high entropy outbound DNS tunneling attempt.',
      type: 'critical',
      time: '2h ago',
      view: 'iot-devices' as ViewId,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6 bg-surface-container-lowest/40 backdrop-blur-xs">
      <div className="bg-surface-container-low max-w-md w-full rounded-xl shadow-2xl border border-surface-variant flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="p-3 bg-surface-container-lowest border-b border-surface-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Security &amp; Appliance Notifications</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-2 flex flex-col gap-1 max-h-96 overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                onNavigate(n.view);
                onClose();
              }}
              className="p-2.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-surface-variant/60 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className={`font-headline-sm text-headline-sm font-semibold flex items-center gap-1.5 ${
                  n.type === 'critical' ? 'text-error' : n.type === 'warning' ? 'text-tertiary' : 'text-primary'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    n.type === 'critical' ? 'bg-error' : n.type === 'warning' ? 'bg-tertiary' : 'bg-primary'
                  }`}></span>
                  {n.title}
                </span>
                <span className="font-label-sm text-label-sm text-outline">{n.time}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-surface-container-lowest border-t border-surface-variant/40 flex items-center justify-between font-label-sm text-label-sm text-outline">
          <span>4 notifications</span>
          <button onClick={onClose} className="text-primary hover:underline">
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
};
