import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 mb-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-2 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
