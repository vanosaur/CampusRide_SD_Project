import React from 'react';

interface SeatToggleProps {
  selected: number;
  onChange: (val: number) => void;
  max?: number;
}

const SeatToggle: React.FC<SeatToggleProps> = ({ selected, onChange, max = 4 }) => {
  return (
    <div className="flex gap-2">
      {[...Array(max)].map((_, i) => {
        const val = i + 1;
        const isSelected = selected === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`w-12 h-10 rounded-xl font-medium transition-all ${
              isSelected 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {val}
          </button>
        );
      })}
    </div>
  );
};

export default SeatToggle;
