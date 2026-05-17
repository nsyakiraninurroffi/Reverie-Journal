import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { ArrowRight, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        navigate('/');
      } else if (res.data.message) {
         setErrors({ general: [res.data.message] });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
         setErrors({ general: [error.response.data.message] });
      }
    }
  }

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-md p-8 md:p-10 relative overflow-hidden"
      >
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-4">
            <UserCircle className="w-7 h-7 text-zinc-900 dark:text-zinc-100" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {errors.general && <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold text-center">{errors.general[0]}</div>}
          
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1 font-medium">{errors.password[0]}</p>}
          </div>

          <button className="primary-btn mt-8">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#c6e3e7] hover:opacity-80 font-bold transition-opacity">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
