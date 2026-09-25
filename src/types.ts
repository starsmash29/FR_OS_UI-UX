export type ViewId =
  | 'dashboard'
  | 'interfaces'
  | 'firewall-and-nat'
  | 'live-sessions'
  | 'threat-intel'
  | 'packet-inspector'
  | 'vpn-tunnels'
  | 'audit-logs'
  | 'ai-ids-ips'
  | 'tls-sni-filter'
  | 'ad-block'
  | 'iot-devices'
  | 'applications-filter'
  | 'tls-fingerprints'
  | 'ztna-gate'
  | 'dhcp'
  | 'firmware-update'
  | 'system-settings'
  | 'user-management';

export interface SystemStats {
  cpu: number;
  ram: number;
  temp: number;
  uptime: string;
  wireThroughputIn: number;
  wireThroughputOut: number;
  packetsPerSec: string;
  blockedThreats24h: number;
  conntrackCount: number;
  conntrackMax: number;
  dnsQueries: number;
  dnsBlocked: number;
}

export interface FirewallRule {
  id: number;
  active: boolean;
  verdict: 'PASS' | 'DROP' | 'REJECT';
  interfaceZone: string;
  proto: string;
  source: string;
  sourceLabel?: string;
  port: string;
  destination: string;
  destLabel?: string;
  hits: string;
  bandwidth: string;
  title: string;
  badge: string;
  badgeType: 'core' | 'blocklist' | 'dnat' | 'outbound' | 'isolation' | 'vpn' | 'default';
  description: string;
}

export interface PhysicalPort {
  id: string;
  name: string;
  type: 'SFP+' | 'RJ45';
  speed: string;
  description: string;
  status: 'active' | 'standby' | 'down';
  rxSpeed: string;
  txSpeed: string;
  opticalDdm?: {
    txPower: string;
    rxPower: string;
    temp: string;
    voltage: string;
    serial: string;
    vendor: string;
  };
}

export interface VlanMapping {
  vid: number;
  name: string;
  subnet: string;
  description: string;
  ports: Record<string, 'U' | 'T' | '—'>;
  zone: string;
  dhcpScope: string;
}

export interface LiveSession {
  id: string;
  state: 'ESTAB' | 'STREAM' | 'SYN_RECV' | 'INTERNAL' | 'INSPECT';
  proto: 'TCP' | 'UDP' | 'ICMP';
  direction: 'in' | 'out' | 'inter' | 'vpn';
  srcIp: string;
  srcPort: number;
  srcName: string;
  srcVlan: string;
  dstIp: string;
  dstPort: number;
  dstName: string;
  dstCountry: string;
  app: string;
  sni?: string;
  transferRateDown: string;
  transferRateUp: string;
  volume: string;
  tcpWin: string;
  duration: string;
  ttl: string;
  threat?: {
    label: string;
    probability: string;
  };
  rtt: string;
  ja4?: string;
  ja3?: string;
  cipher?: string;
}

export interface ThreatEvent {
  id: string;
  time: string;
  severity: 'CRIT' | 'HIGH' | 'MED' | 'LOW';
  name: string;
  cve?: string;
  sid: string;
  rev: string;
  proto: string;
  port: string;
  srcIp: string;
  srcCountry: string;
  srcAsn: string;
  srcDomain?: string;
  targetHost: string;
  targetLabel: string;
  action: string;
  threatScore: number;
  payloadStream?: string;
  hexDump?: string;
  reputation: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  location: string;
  mac: string;
  vendor: string;
  ip: string;
  vlan: string;
  fingerprint: string;
  engineOpt: string;
  tier: 'Tier 1: Zero-Trust Strict' | 'Tier 2: Cloud Pin-Hole' | 'Tier 3: Quarantine Blackhole';
  wanFlow: string;
  lanFlow: string;
  threatScore: number;
  isFlagged: boolean;
  pinholeSettings: {
    forwardHomeAssistant: boolean;
    dropExternalDns: boolean;
    l2BroadcastFilter: boolean;
    strictRateLimit: boolean;
  };
  contactedFqdns: {
    fqdn: string;
    port: number;
    protocol: string;
    status: 'ALLOWED' | 'SINKHOLED' | 'REDIRECTED' | 'CAPTURED';
    detail: string;
  }[];
}
