import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, Calendar, Clock, DollarSign, Zap } from 'lucide-react';
import { createRide } from '../api/rides';
import RideCard from '../components/ride/RideCard';
import SeatToggle from '../components/ui/SeatToggle';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  destination: z.string().min(2, "Destination is required"),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  maxSeats: z.number().min(1).max(4),
  totalFare: z.number().min(1, "Total fare must be greater than 0"),
  autoAccept: z.boolean()
});

type FormData = z.infer<typeof schema>;

const destinationsList = [
  "Jahangirpuri Metro Station",
  "New Delhi Railway Station",
  "Terminal 3 IGI Airport",
  "Cyber Hub, GGM",
  "Science Block, North Campus",
  "Central Transit Hub"
];

const CreateRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      maxSeats: 3,
      autoAccept: true,
      pickupLocation: "Science Block, North Campus",
      destination: "Central Transit Hub"
    }
  });

  const formValues = watch();

  const previewRideData: any = {
    destination: formValues.destination || 'Destination',
    pickupLocation: formValues.pickupLocation || 'Pickup Location',
    departureTime: (formValues.date && formValues.time) ? `${formValues.date}T${formValues.time}:00Z` : new Date().toISOString(),
    maxSeats: formValues.maxSeats || 3,
    totalFare: formValues.totalFare || 0,
    status: "OPEN" as const,
    members: [],
    creator: user || { id: 'mock-id', name: "Current User" }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      // Combine date and time
      const departureTime = new Date(`${data.date}T${data.time}`).toISOString();
      const payload = { ...data, departureTime };
      
      const res = await createRide(payload);
      toast.success('Ride created successfully!');
      const rideId = res.data.id || res.data.ride?.id;
      navigate(`/rides/${rideId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">Create a Ride</h1>
          <p className="text-gray-500 max-w-xl">
            Fill in your journey details to find campus companions and split the fare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-4 relative">
                <div className="absolute left-6 top-[3.5rem] bottom-10 w-0.5 border-l-2 border-dashed border-gray-200 z-0"></div>
                
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4"><MapPin className="w-4 h-4"/> Route Details</h4>
                
                <div className="relative z-10 pl-12">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 rounded-full border-4 border-white shadow-sm"></div>
                   <input 
                     {...register('pickupLocation')}
                     list="destinations"
                     placeholder="Pickup Location"
                     className="w-full bg-gray-100/80 border border-transparent rounded-xl px-4 py-4 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-navy font-medium"
                   />
                   {errors.pickupLocation && <p className="text-red-500 text-xs mt-1 absolute">{errors.pickupLocation.message}</p>}
                </div>

                <div className="relative z-10 pl-12 mt-4">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
                   <input 
                     {...register('destination')}
                     list="destinations"
                     placeholder="Dropoff Destination"
                     className="w-full bg-gray-100/80 border border-transparent rounded-xl px-4 py-4 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-navy font-medium"
                   />
                   {errors.destination && <p className="text-red-500 text-xs mt-1 absolute">{errors.destination.message}</p>}
                </div>

                <datalist id="destinations">
                  {destinationsList.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      {...register('date')}
                      type="date"
                      min={today}
                      className="w-full bg-gray-100/80 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-navy"
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      {...register('time')}
                      type="time"
                      className="w-full bg-gray-100/80 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-navy"
                    />
                  </div>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Seats</label>
                  <SeatToggle 
                    selected={formValues.maxSeats} 
                    onChange={(val: number) => setValue('maxSeats', val)} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estimated Total Fare</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      {...register('totalFare', { valueAsNumber: true })}
                      type="number"
                      placeholder="e.g. 900"
                      className="w-full pl-10 bg-gray-100/80 border border-transparent rounded-xl pr-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-navy font-bold"
                    />
                  </div>
                  {errors.totalFare && <p className="text-red-500 text-xs mt-1">{errors.totalFare.message}</p>}
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl flex items-center justify-between border border-gray-100">
                <div className="flex gap-4 items-center">
                   <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-primary">
                     <Zap className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-navy text-sm">Auto-accept riders</p>
                     <p className="text-xs text-gray-500 font-medium">Requests are approved instantly</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    {...register('autoAccept')} 
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all text-lg mt-8"
              >
                {loading ? 'Posting...' : 'Post Ride'}
              </button>
            </form>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
             <div className="sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Preview</h3>
                </div>
                <div className="relative">
                   <RideCard ride={previewRideData} isCreator={true} />
                   
                   {/* Fake Map below */}
                   <div className="mt-4 rounded-[2rem] overflow-hidden bg-gray-100 h-48 relative border border-gray-200 shadow-inner">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="absolute top-1/2 left-1/4 w-32 border-t-4 border-dashed border-primary rotate-12 origin-left"></div>
                      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full -translate-y-1/2 border-4 border-white shadow"></div>
                      <div className="absolute top-[80%] left-[80%] w-4 h-4 bg-gray-400 rounded-full -translate-y-1/2 border-4 border-white shadow"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRide;
