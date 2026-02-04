'use client';

import { useState } from 'react';

export const useCelebration = () => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const celebrate = () => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 3000);
  };

  return { isCelebrating, celebrate };
};
