import React from 'react';

interface FROSIconProps {
  className?: string;
  size?: number;
}

export const FROSIcon: React.FC<FROSIconProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect width="100" height="100" rx="20" fill="#070f19" />
      {/* Outer Hexagon border */}
      <polygon
        points="50,10 88,30 88,70 50,90 12,70 12,30"
        stroke="#182e4a"
        strokeWidth="2.5"
        fill="#0a1524"
      />
      {/* Inner glowing Hexagon */}
      <polygon
        points="50,22 78,37 78,63 50,78 22,63 22,37"
        stroke="#06b6d4"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Central Hexagon Core */}
      <polygon
        points="50,40 60,45 60,55 50,60 40,55 40,45"
        fill="#0c1e30"
        stroke="#4cd7f6"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="4.5" fill="#4cd7f6" />

      {/* Diagonal interconnect arrows and peripheral nodes */}
      {/* Top right */}
      <line x1="57" y1="44" x2="72" y2="35" stroke="#4cd7f6" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="72,31 77,39 67,38" fill="#4cd7f6" />
      <polygon points="77,26 84,30 84,38 77,42 70,38 70,30" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />

      {/* Bottom right */}
      <line x1="57" y1="56" x2="72" y2="65" stroke="#4cd7f6" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="72,69 67,62 77,61" fill="#4cd7f6" />
      <polygon points="77,58 84,62 84,70 77,74 70,70 70,62" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />

      {/* Bottom left */}
      <line x1="43" y1="56" x2="28" y2="65" stroke="#4cd7f6" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="28,69 33,62 23,61" fill="#4cd7f6" />
      <polygon points="23,58 30,62 30,70 23,74 16,70 16,62" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />

      {/* Top left */}
      <line x1="43" y1="44" x2="28" y2="35" stroke="#4cd7f6" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="28,31 23,39 33,38" fill="#4cd7f6" />
      <polygon points="23,26 30,30 30,38 23,42 16,38 16,30" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />

      {/* Top central chevron & node */}
      <polyline points="44,28 50,22 56,28" stroke="#4cd7f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polygon points="50,14 56,17 56,23 50,26 44,23 44,17" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />

      {/* Bottom central chevron & node */}
      <polyline points="44,72 50,78 56,72" stroke="#4cd7f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polygon points="50,74 56,77 56,83 50,86 44,83 44,77" stroke="#4cd7f6" strokeWidth="1.5" fill="#0c1e30" />
    </svg>
  );
};
