'use client';

import React from 'react';

interface ConfettiProps {
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [pieces] = React.useState(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E616', '#45B7D1', '#FF9F1C'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));
  });

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall shadow-pixel-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            width: '12px',
            height: '12px',
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  );
};
