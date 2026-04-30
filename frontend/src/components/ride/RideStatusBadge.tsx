import React from 'react';

const RideStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'OPEN': return 'bg-teal-100 text-teal-800';
      case 'FULL': return 'bg-amber-100 text-amber-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-600';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-sm ${getColors()}`}>
      {status}
    </span>
  );
};

export default RideStatusBadge;
