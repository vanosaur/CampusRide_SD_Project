import React from 'react';
import { Calendar, SlidersHorizontal } from 'lucide-react';

const destinations = [
  "All Rides",
  "Jahangirpuri Metro",
  "New Delhi Station",
  "Terminal 3 IGI",
  "Cyber Hub"
];

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="w-full my-6 bg-transparent">
      {/* Scrollable Chips */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mb-2 flex-grow">
          {destinations.map(dest => (
            <button
              key={dest}
              onClick={() => setActiveFilter(dest)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === dest 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Date & Time Picker Row */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="flex-none md:w-64">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Departure Date</label>
          <div className="relative bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium text-navy text-sm">Oct 24, 2023</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Time Window</label>
          <div className="bg-white rounded-xl shadow-sm px-6 py-3 border border-gray-100 h-[46px] flex flex-col justify-center">
             <div className="relative w-full h-1 bg-gray-200 rounded-full">
               <div className="absolute left-1/4 right-1/4 h-1 bg-primary rounded-full"></div>
               <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow border-2 border-white"></div>
               <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow border-2 border-white"></div>
             </div>
             <div className="flex justify-between mt-2">
               <span className="text-[10px] font-semibold text-gray-400">08:00 AM</span>
               <span className="text-[10px] font-semibold text-gray-400">12:00 PM</span>
               <span className="text-[10px] font-semibold text-gray-400">06:00 PM</span>
             </div>
          </div>
        </div>
        
        <div className="flex-none md:w-48 self-end">
          <button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Find Rides
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted search icon to be used above without double import
import { Search } from 'lucide-react';

export default FilterBar;
