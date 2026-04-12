import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { register as registerApi } from '../api/auth';

const schema = z.object({
  email: z.string().email("Invalid email address").endsWith('.edu.in', "Must be a valid college email ending in .edu.in"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await registerApi(data);
      // Let's pass the email to state so OTP verify can use it
      localStorage.setItem('verification_email', data.email);
      navigate('/verify-otp');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-navy hover:text-primary font-medium transition-colors">
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
            <h2 className="text-3xl font-extrabold text-navy mb-2">Create Account</h2>
            <p className="text-gray-500">Join your campus cab sharing network.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  {...register('name')}
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">University Email</label>
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="name.student@university.edu.in"
                  className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <input 
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-teal-200 transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Continue'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Register;
