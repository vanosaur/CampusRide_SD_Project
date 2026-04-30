import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await loginApi(data);
      login(res.data.token || '', res.data.user!);
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navy/20">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-navy mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to book or manage your rides.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col">
              
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Password</span>
                  <a href="#" className="text-primary hover:underline lowercase font-medium tracking-normal">Forgot?</a>
                </label>
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
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
