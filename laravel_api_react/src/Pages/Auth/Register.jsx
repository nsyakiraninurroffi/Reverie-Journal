import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await api.post('/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  return (
    <div className="flex justify-center items-center py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-xl p-8 md:p-10 relative overflow-hidden"
      >
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-4">
            <UserPlus className="w-7 h-7 text-zinc-900 dark:text-zinc-100" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Create an account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">Join us to start journaling your journey.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              />
            </div>
          </div>

          <button className="primary-btn mt-8">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c6e3e7] hover:opacity-80 font-bold transition-opacity">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
