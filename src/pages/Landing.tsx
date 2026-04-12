import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Banknote, ShieldCheck, MessageCircle, AlertTriangle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex-1 w-full bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Animated Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-primary font-medium text-sm mb-8 border border-teal-100">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Save up to ₹675 per trip.
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-navy tracking-tight leading-tight mb-6">
            Split the fare.<br/>
            <span className="text-primary">Not the stress.</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Campus-only cab sharing — verified students, live fare split, group chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-teal-200 shadow-md rounded-xl font-medium transition-all duration-200">
              Register with College Email
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-primary border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md rounded-xl font-medium transition-all duration-200">
              Login
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-400 italic">Only @college.edu.in emails allowed.</p>
        </motion.div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FF] flex items-center justify-center mb-6 text-primary">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Post Your Ride</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Heading to the airport or downtown? Just set your time and destination.</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FF] flex items-center justify-center mb-6 text-navy">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Join a Group</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Browse active rides from fellow students and join one with a single tap.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAEDEB] flex items-center justify-center mb-6 text-danger">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-4">Split the Fare</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Transparent real-time splitting ensures everyone pays their fair share.</p>
          </div>
        </div>

        {/* Safety Section */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative bg-gray-200">
               {/* Using placeholder gradient instead of image so it looks beautiful without broken images */}
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-navy/80 mix-blend-multiply flex items-center justify-center opacity-80" />
               <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Students together" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
            </div>
            
            {/* Overlay Badge */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary flex flex-col items-center justify-center text-white font-bold text-xl shadow-xl transform rotate-12 rotate">
              <span>100%</span>
              <span>Safe</span>
            </div>
            
            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
               </div>
               <div>
                  <p className="text-navy font-bold text-sm">Ride to Terminal 3</p>
                  <p className="text-xs text-gray-500 font-medium">3 spots remaining • Departs 04:30 PM</p>
               </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-extrabold text-navy mb-8">Built for Students, by Students.</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-navy font-bold mb-1">Identity verification</h4>
                  <p className="text-gray-500 text-sm">Through official .edu.in email addresses to ensure campus-only safety.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-navy font-bold mb-1">In-app group chats</h4>
                  <p className="text-gray-500 text-sm">Coordinate pickup points easily without sharing personal numbers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-navy font-bold mb-1">SOS emergency features</h4>
                  <p className="text-gray-500 text-sm">Connected directly to Campus Security for your peace of mind.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100 mt-20 text-center">
         <h4 className="text-xl font-bold text-primary mb-6">CabShare</h4>
         <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-medium mb-8">
           <a href="#" className="hover:text-primary transition-colors">Campus Security</a>
           <a href="#" className="hover:text-primary transition-colors">Support</a>
           <a href="#" className="hover:text-primary transition-colors">Ride Safety</a>
           <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
         </div>
         <p className="text-xs text-gray-400">© 2024 Campus CabShare. Part of the Academic Curatator Network.</p>
      </footer>
    </div>
  );
};

export default Landing;
