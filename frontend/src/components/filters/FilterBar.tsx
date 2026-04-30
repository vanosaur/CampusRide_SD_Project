import React, { useState } from 'react';
import { Calendar, SlidersHorizontal, Search, Clock } from 'lucide-react';

const destinations = [
  "All Rides",
  "Jahangirpuri Metro",
  "New Delhi Station",
  "Terminal 3 IGI",
  "Cyber Hub"
];

interface FilterBarProps {
  onSearch: (filters: { destination?: string; date?: string; timeFrom?: string }) => void;
  initialFilters?: { destination?: string; date?: string; timeFrom?: string };
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, initialFilters }) => {
  const [destination, setDestination] = useState(initialFilters?.destination || 'All Rides');
  const [date, setDate] = useState(initialFilters?.date || '');
  const [time, setTime] = useState(initialFilters?.timeFrom || '');

  const handleSearch = () => {
    onSearch({ 
      destination: destination === 'All Rides' ? undefined : destination, 
      date: date || undefined,
      timeFrom: time || undefined
    });
  };

  return (
    <div className="w-full my-6 bg-transparent">
      {/* Scrollable Chips */}
      <div className="flex items-center justify-between gap-4 w-full px-2">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mb-2 flex-grow">
          {destinations.map(dest => (
            <button
              key={dest}
              onClick={() => {
                setDestination(dest);
                onSearch({ destination: dest === 'All Rides' ? undefined : dest, date: date || undefined });
              }}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                destination === dest 
                  ? 'bg-primary text-white shadow-lg shadow-teal-500/20' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-navy hover:bg-gray-100 rounded-2xl transition-colors flex-shrink-0 border border-transparent hover:border-gray-200">
          <SlidersHorizontal className="w-4 h-4" />
          More
        </button>
      </div>

      {/* Date & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 px-2 pb-2">
        <div className="flex-none md:w-72">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Departure Date</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] pl-12 pr-4 py-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-navy font-bold text-sm cursor-pointer"
            />
          </div>
        </div>

        <div className="flex-none md:w-48">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Time (From)</label>
          <div className="relative group">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] pl-12 pr-4 py-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-navy font-bold text-sm cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
           <button 
             onClick={handleSearch}
             className="w-full md:w-max px-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-teal-500/20 py-4 rounded-[1.25rem] font-bold text-sm transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95"
           >
            <Search className="w-5 h-5" />
            Search Rides
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

