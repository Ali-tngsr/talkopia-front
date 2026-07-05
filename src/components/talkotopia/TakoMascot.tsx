'use client';

/**
 * Tako — the friendly octopus mascot of Talkotopia.
 * Pure CSS/SVG, no external assets.
 */
export function TakoMascot({
  size = 200,
  className = '',
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={`relative ${animated ? 'animate-bob' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-md">
        {/* Body */}
        <ellipse cx="100" cy="85" rx="62" ry="58" fill="#9EB766" />
        {/* Belly highlight */}
        <ellipse cx="100" cy="100" rx="42" ry="34" fill="#B7CC8A" opacity="0.7" />
        {/* Tentacles */}
        <path d="M 50 115 Q 30 150 35 175 Q 40 180 48 178 Q 52 155 60 130 Z" fill="#9EB766" />
        <path d="M 70 130 Q 60 165 65 185 Q 72 188 78 184 Q 76 160 80 140 Z" fill="#8AA454" />
        <path d="M 100 135 Q 95 170 100 190 Q 108 192 110 185 Q 105 165 108 140 Z" fill="#9EB766" />
        <path d="M 130 130 Q 140 165 135 185 Q 128 188 122 184 Q 124 160 120 140 Z" fill="#8AA454" />
        <path d="M 150 115 Q 170 150 165 175 Q 160 180 152 178 Q 148 155 140 130 Z" fill="#9EB766" />
        {/* Cheeks */}
        <circle cx="68" cy="95" r="10" fill="#F1BD79" opacity="0.65" />
        <circle cx="132" cy="95" r="10" fill="#F1BD79" opacity="0.65" />
        {/* Eyes */}
        <ellipse cx="82" cy="80" rx="11" ry="13" fill="white" />
        <ellipse cx="118" cy="80" rx="11" ry="13" fill="white" />
        <circle cx="84" cy="83" r="6" fill="#5E6646" />
        <circle cx="120" cy="83" r="6" fill="#5E6646" />
        <circle cx="86" cy="80" r="2" fill="white" />
        <circle cx="122" cy="80" r="2" fill="white" />
        {/* Smile */}
        <path d="M 86 105 Q 100 118 114 105" stroke="#5E6646" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
