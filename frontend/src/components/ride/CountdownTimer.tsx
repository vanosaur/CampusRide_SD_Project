import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC<{ departureTime?: string }> = ({ departureTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calcTime = () => {
      if (!departureTime) return '';
      const diff = new Date(departureTime).getTime() - Date.now();
      if (diff <= 0) return 'Departing now';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        return `In ${Math.floor(hours/24)} days`;
      }
      if (hours > 0) {
        return `In ${hours}h ${mins}m`;
      }
      return `In ${mins}m`;
    };

    setTimeLeft(calcTime());
    const interval = setInterval(() => setTimeLeft(calcTime()), 60000);
    return () => clearInterval(interval);
  }, [departureTime]);

  return <span className="font-medium">{timeLeft}</span>;
}

export default CountdownTimer;
