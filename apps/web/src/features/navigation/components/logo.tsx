"use client";

import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";

export function Logo({ className }: { className?: string }) {
  return (
    <LocalizedLink
      href={ROUTES.HOME}
      aria-label="PATCH - Go to homepage"
      className={`group flex items-center justify-center transition-all active:scale-95 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 240 90"
        className="h-10 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sombra sutil para a garrafa inteira */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="white" floodOpacity="0.1" />
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="white" floodOpacity="0.05" />
          </filter>
          
          <linearGradient id="capShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="capShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" stopOpacity="1" />
            <stop offset="40%" stopColor="#1a1a1a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>
          
          <radialGradient id="capTopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="70%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* CONTORNO DA GARRAFA */}
        <path
          d="M 38 22 L 38 18 Q 38 10 48 10 L 198 10 Q 212 10 218 18 Q 224 26 224 34 L 224 56 Q 224 64 218 72 Q 212 80 198 80 L 48 80 Q 38 80 38 72 L 38 68"
          fill="white"
          stroke="white"
          strokeWidth="8"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* ÁGUA / ONDAS */}
        <path
          d="M 40 56 Q 70 46 100 56 T 160 56 T 222 56 L 222 72 Q 222 78 214 80 L 48 80 Q 40 80 40 72 Z"
          fill="black"
        />

        {/* TAMPA - Sombra principal */}
        <ellipse
          cx="27"
          cy="60"
          rx="14"
          ry="5"
          fill="rgba(0,0,0,0.3)"
          filter="blur(2px)"
        />

        {/* TAMPA - Base cilíndrica com sombra */}
        <ellipse
          cx="27"
          cy="28"
          rx="13"
          ry="4"
          fill="#1a1a1a"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          filter="drop-shadow(0 2px 3px rgba(255,255,255,0.1))"
        />

        {/* TAMPA - Corpo principal com gradiente e sombra */}
        <rect
          x="14"
          y="28"
          width="26"
          height="32"
          fill="url(#capShadow)"
          filter="drop-shadow(0 4px 6px rgba(255,255,255,0.15))"
        />

        {/* Efeito de brilho na tampa */}
        <rect
          x="16"
          y="30"
          width="22"
          height="28"
          fill="url(#capShine)"
          opacity="0.3"
        />

        {/* TAMPA - Serrilhado lateral esquerdo com brilho */}
        <g fill="rgba(100,100,100,0.8)" filter="drop-shadow(0 1px 1px rgba(255,255,255,0.2))">
          <rect x="11" y="30" width="3" height="4" />
          <rect x="11" y="36" width="3" height="4" />
          <rect x="11" y="42" width="3" height="4" />
          <rect x="11" y="48" width="3" height="4" />
          <rect x="11" y="54" width="3" height="4" />
        </g>

        {/* TAMPA - Serrilhado lateral direito com brilho */}
        <g fill="rgba(100,100,100,0.8)" filter="drop-shadow(0 1px 1px rgba(255,255,255,0.2))">
          <rect x="40" y="30" width="3" height="4" />
          <rect x="40" y="36" width="3" height="4" />
          <rect x="40" y="42" width="3" height="4" />
          <rect x="40" y="48" width="3" height="4" />
          <rect x="40" y="54" width="3" height="4" />
        </g>

        {/* TAMPA - Anéis de rosca/detalhes com brilho */}
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none">
          <ellipse cx="27" cy="35" rx="10" ry="2.5" opacity="0.4" filter="drop-shadow(0 1px 1px rgba(255,255,255,0.3))" />
          <ellipse cx="27" cy="42" rx="10" ry="2.5" opacity="0.4" filter="drop-shadow(0 1px 1px rgba(255,255,255,0.3))" />
          <ellipse cx="27" cy="49" rx="10" ry="2.5" opacity="0.4" filter="drop-shadow(0 1px 1px rgba(255,255,255,0.3))" />
        </g>

        {/* TAMPA - Base inferior com efeito 3D */}
        <ellipse
          cx="27"
          cy="60"
          rx="13"
          ry="4"
          fill="#0a0a0a"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          filter="drop-shadow(0 2px 3px rgba(255,255,255,0.1))"
        />

        {/* TAMPA - Topo com brilho intenso */}
        <ellipse
          cx="27"
          cy="28"
          rx="13"
          ry="4"
          fill="#0a0a0a"
          filter="drop-shadow(0 0 4px rgba(255,255,255,0.3))"
        />
        
        {/* Brilho no topo da tampa */}
        <ellipse
          cx="27"
          cy="26"
          rx="9"
          ry="3"
          fill="url(#capTopGlow)"
        />
        
        <ellipse
          cx="27"
          cy="27"
          rx="9"
          ry="2.5"
          fill="#3a3a3a"
        />
        
        <ellipse
          cx="27"
          cy="26.5"
          rx="5"
          ry="1.5"
          fill="white"
          opacity="0.8"
          filter="blur(0.5px)"
        />

        {/* Reflexo extra na lateral da tampa */}
        <path
          d="M 18 32 L 18 56"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 36 32 L 36 56"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* TEXTO PATCH */}
        <text
          x="132"
          y="50"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="38"
          fontWeight="900"
          textAnchor="middle"
          fill="black"
          letterSpacing="2"
        >
          PATCH
        </text>
      </svg>
    </LocalizedLink>
  );
}