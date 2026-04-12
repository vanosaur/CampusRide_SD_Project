import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FareSplitDisplayProps {
  totalFare: number;
  maxSeats: number;
  currentSeats: number;
}

const FareSplitDisplay: React.FC<FareSplitDisplayProps> = ({ totalFare, currentSeats }) => {
  const farePerPerson = (totalFare / Math.max(currentSeats, 1)).toFixed(2);
  
  return (
    <div className="bg-primary rounded-xl p-4 text-white flex flex-col justify-center items-end shadow-lg shadow-teal-200 ml-4">
      <div className="text-[10px] font-bold text-teal-100 uppercase tracking-widest mb-1">Estimated Fare</div>
      <div className="flex items-baseline gap-1 relative overflow-hidden">
        <span className="text-xl font-bold">₹</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={farePerPerson}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-3xl font-extrabold"
          >
            {farePerPerson}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs font-semibold text-teal-100 tracking-wide">/ person</span>
      </div>
    </div>
  );
};

export default FareSplitDisplay;
