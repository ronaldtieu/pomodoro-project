'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface PickerOption {
  value: string;
  label: string;
}

interface IOSPickerProps {
  options: PickerOption[];
  value: string;
  onChange: (value: any) => void;
}

export const IOSPicker: React.FC<IOSPickerProps> = ({ options, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const itemHeight = 44;
  const visibleItems = 3;
  const containerHeight = itemHeight * visibleItems;

  const currentIndex = options.findIndex(opt => opt.value === value);

  useEffect(() => {
    if (containerRef.current && !isDragging) {
      const targetScrollTop = currentIndex * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
    }
  }, [currentIndex, itemHeight, isDragging]);

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;

    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    onChange(options[clampedIndex].value);
  };

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const deltaY = startY - clientY;
    containerRef.current.scrollTop = scrollTop + deltaY;
  };

  const handleEnd = () => {
    if (!containerRef.current) return;

    setIsDragging(false);
    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));

    // Snap to selection
    containerRef.current.scrollTo({
      top: clampedIndex * itemHeight,
      behavior: 'smooth'
    });

    onChange(options[clampedIndex].value);
  };

  return (
    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50" style={{ height: containerHeight }}>
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 bg-primary/10 border-y-2 border-primary pointer-events-none z-10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: itemHeight
        }}
      />

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{ paddingTop: itemHeight, paddingBottom: itemHeight }}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            onClick={() => {
              onChange(option.value);
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: index * itemHeight,
                  behavior: 'smooth'
                });
              }
            }}
            className="flex items-center justify-center text-center font-pixel text-sm font-semibold cursor-pointer select-none hover:bg-gray-100 active:bg-gray-200 transition-colors"
            style={{ height: itemHeight }}
          >
            {option.label}
          </div>
        ))}
      </div>

      {/* Fade overlays */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </div>
  );
};
