import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Logo({
  size = 'md',
  showText = true,
  className = '',
  textClassName = ''
}) {
  const { t } = useTranslation();

  // Size mappings
  const sizeMap = {
    sm: { icon: 'w-7 h-7', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', title: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', title: 'text-xl', sub: 'text-[11px]' },
    xl: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Kazakh Steppe Heritage Emblem SVG */}
      <div className={`relative shrink-0 ${currentSize.icon} flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(43,108,0,0.2)] hover:scale-105 transition-transform duration-300`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Emerald Gradient */}
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58cc02" />
              <stop offset="100%" stopColor="#225400" />
            </linearGradient>

            {/* Gold Sun Gradient */}
            <linearGradient id="goldSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffdf92" />
              <stop offset="50%" stopColor="#fec700" />
              <stop offset="100%" stopColor="#d99b00" />
            </linearGradient>

            {/* Shadow Filter */}
            <filter id="iconShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#1e5000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Rounded Shield Container (Duolingo / Modern EdTech Style) */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="url(#emeraldGrad)"
            stroke="#6be026"
            strokeWidth="3"
            filter="url(#iconShadow)"
          />

          {/* 3D Bottom Highlight Bevel */}
          <rect
            x="4"
            y="76"
            width="92"
            height="20"
            rx="10"
            fill="#173a00"
            opacity="0.4"
          />

          {/* Central Steppe Solar Disc / Sun */}
          <circle cx="50" cy="50" r="28" fill="url(#goldSunGrad)" />

          {/* Central Shanyrak / Nomad Cross Structure */}
          <circle cx="50" cy="50" r="16" fill="none" stroke="#225400" strokeWidth="3.5" />
          
          {/* Shanyrak Crossbeams (Күлдіреуіш) */}
          <path
            d="M50 24 L50 76 M24 50 L76 50"
            stroke="#225400"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 32 L68 68 M32 68 L68 32"
            stroke="#225400"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Golden Rays / Horns Accents (Қошқар мүйіз elements) */}
          <circle cx="50" cy="18" r="3.5" fill="#fec700" />
          <circle cx="50" cy="82" r="3.5" fill="#fec700" />
          <circle cx="18" cy="50" r="3.5" fill="#fec700" />
          <circle cx="82" cy="50" r="3.5" fill="#fec700" />
          
          {/* Center Jewel */}
          <circle cx="50" cy="50" r="5" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-headline ${currentSize.title} tracking-tight uppercase text-primary font-black`}>
              QAZ<span className="text-secondary font-black">HISTORY</span>
            </span>
          </div>
          <span className={`font-label-sm ${currentSize.sub} text-on-surface-variant uppercase tracking-widest font-extrabold mt-0.5`}>
            {t('brand.subtitle') || 'Тарих Әлемі • SDU'}
          </span>
        </div>
      )}
    </div>
  );
}