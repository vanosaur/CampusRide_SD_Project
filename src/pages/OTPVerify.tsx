import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import OTPInput from '../components/ui/OTPInput';
import { verifyOTP } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const OTPVerify = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('verification_email');

  const handleVerify = async (otp: string) => {
    try {
      setLoading(true);
      const res = await verifyOTP({ email: email || '', otp });
      // Call login from AuthContext
      login(res.data.token || '', res.data.user!);
      localStorage.removeItem('verification_email');
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-background">
        <p>No email found to verify. Please register first.</p>
        <Link to="/register" className="mt-4 text-primary font-bold">Go to Register</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
      <Link to="/register" className="absolute top-8 left-8 flex items-center gap-2 text-navy hover:text-primary font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back
      </Link>

      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-100">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-navy mb-2">Verify Identity</h2>
            <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
              We've sent a 6-digit security code to your official university email.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">University Email</label>
              <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex justify-between items-center text-gray-500 font-medium">
                {email}
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
            </div>

            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mt-6">Security Code</label>
            <OTPInput length={6} onComplete={handleVerify} />
            
            {loading && <p className="text-center text-sm text-primary animate-pulse font-medium mt-4">Verifying...</p>}

            <div className="text-center mt-8 space-y-3">
              <p className="text-sm font-medium text-navy flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                Resend OTP in <span className="font-bold">45s</span>
              </p>
              <button disabled className="text-sm font-bold text-primary opacity-50 cursor-not-allowed">
                Resend Code Now
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12 space-y-2">
             <p className="text-[10px] text-gray-400 font-medium">Part of the Academic Curator Network Security Protocol.</p>
             <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                <span>Safety First</span>
                <span>Verified Rides</span>
             </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OTPVerify;
