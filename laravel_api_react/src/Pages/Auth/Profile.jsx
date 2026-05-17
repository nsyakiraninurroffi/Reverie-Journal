import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { User, Settings, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, token, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `http://127.0.0.1:8000/storage/${user.avatar}` : null
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');
    
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    
    if (formData.password) {
      payload.append('password', formData.password);
      payload.append('password_confirmation', formData.password_confirmation);
    }
    
    if (avatarFile) {
      payload.append('avatar', avatarFile);
    }

    try {
      const res = await api.post('/user', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setUser(res.data.user);
      setSuccessMsg('Your profile has been updated successfully.');
      setFormData({ ...formData, password: '', password_confirmation: '' });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm font-medium transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 dark:bg-zinc-100 rounded-2xl shadow-lg">
            <Settings className="w-8 h-8 text-white dark:text-zinc-900" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>Account Settings</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest text-xs font-semibold">Manage your identity and preferences</p>
          </div>
        </div>

        <div className="glass-panel p-8 sm:p-12 border-t-4 border-t-[#c6e3e7] dark:border-t-amber-500">
          <form onSubmit={handleUpdateProfile} className="space-y-10">
            {successMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 font-medium">
                {successMsg}
              </div>
            )}
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-10 pb-10 border-b border-zinc-200 dark:border-zinc-800">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 ring-4 ring-[#c6e3e7]/50 dark:ring-amber-500/50 bg-zinc-50 dark:bg-zinc-900 shadow-2xl relative transition-all duration-300 group-hover:ring-[#c6e3e7] dark:group-hover:ring-amber-500 group-hover:scale-105">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700">
                      <User className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <ImageIcon className="w-8 h-8 text-white mb-2" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Change</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Profile Picture</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-sm">Upload a beautiful avatar to represent your identity across your journal entries. Max size 2MB (.jpg, .png, .webp).</p>
                {errors.avatar && <p className="text-red-500 text-sm mt-3 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg inline-block border border-red-100 dark:border-red-900/50">{errors.avatar[0]}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">Personal Information</h3>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">Security</h3>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button className="primary-btn !w-auto !px-12 flex items-center gap-3">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
