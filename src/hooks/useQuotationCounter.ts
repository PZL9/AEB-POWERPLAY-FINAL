import { useState, useEffect } from 'react';

export const useQuotationCounter = () => {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('aeb-quotation-count');
    return stored ? parseInt(stored, 10) : 30;
  });

  useEffect(() => {
    // Simulate real-time counter updates
    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + Math.floor(Math.random() * 3);
        localStorage.setItem('aeb-quotation-count', newCount.toString());
        return newCount;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const incrementRealQuotation = () => {
    setCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('aeb-quotation-count', newCount.toString());
      return newCount;
    });
  };

  return { count, incrementRealQuotation };
};