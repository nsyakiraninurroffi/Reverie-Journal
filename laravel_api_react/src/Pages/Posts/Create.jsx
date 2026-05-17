import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { Save, UserCircle2, MapPin, Clock, Cloud, ImagePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create() {
  const [formData, setFormData] = useState({ title: '', body: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const { token, user, lang } = useContext(AppContext);
  const navigate = useNavigate();

  const [weather, setWeather] = useState({ temp: null, location: lang === 'id' ? 'Mencari lokasi...' : 'Locating...' });
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = {
    new_entry: lang === 'id' ? 'BARU' : 'NEW',
    author: lang === 'id' ? 'Penulis' : 'Author',
    subtitle: lang === 'id' ? 'Menulis bab baru...' : 'Writing a new chapter...',
    balance: lang === 'id' ? 'Keseimbangan' : 'Balance',
    peace: lang === 'id' ? 'Kedamaian' : 'Peace',
    title_placeholder: lang === 'id' ? 'Judul Catatan...' : 'Entry Title...',
    body_placeholder: lang === 'id' ? 'Mulai menulis di sini...' : 'Begin writing here...',
    save: lang === 'id' ? 'Simpan Catatan' : 'Save Entry',
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
          const weatherData = await weatherRes.json();
          
          const locRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang === 'id' ? 'id' : 'en'}`);
          const locData = await locRes.json();

          setWeather({
            temp: weatherData.current_weather.temperature,
            location: locData.city || locData.locality || locData.countryName || (lang === 'id' ? 'Lokasi Tidak Diketahui' : 'Unknown Location')
          });
        } catch (error) {
          console.error("Failed to fetch weather/location", error);
          setWeather({ temp: null, location: lang === 'id' ? 'Lokasi Tidak Tersedia' : 'Location Unavailable' });
        }
      }, () => {
         setWeather({ temp: null, location: lang === 'id' ? 'Akses Lokasi Ditolak' : 'Location Access Denied' });
      });
    } else {
      setWeather({ temp: null, location: lang === 'id' ? 'Geolokasi Tidak Didukung' : 'Geolocation Unsupported' });
    }
  }, [lang]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('body', formData.body);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await api.post('/posts', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  // Realistic 3D book opening animation
  const leftPageVariants = {
    hidden: { rotateY: 90, opacity: 0, originX: 1, filter: "brightness(0.5)" },
    visible: { 
      rotateY: 0, 
      opacity: 1, 
      filter: "brightness(1)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const rightPageVariants = {
    hidden: { rotateY: -90, opacity: 0, originX: 0, filter: "brightness(0.5)" },
    visible: { 
      rotateY: 0, 
      opacity: 1, 
      filter: "brightness(1)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 perspective-[2500px]">
      <form onSubmit={handleCreate}>
        <div className="book-container paper-texture relative" style={{ perspective: "2500px" }}>
          <div className="book-stitch"></div>
          
          {/* Left Page */}
          <motion.div 
            variants={leftPageVariants}
            initial="hidden"
            animate="visible"
            className="book-page-left flex flex-col justify-between items-center text-center origin-right"
          >
            
            {/* Top Date & Time */}
            <div className="w-full flex justify-between items-start text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-12 relative z-20">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1.5 font-bold"><Clock className="w-4 h-4 text-amber-500" /> {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div>{currentTime.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div className="font-serif tracking-widest opacity-60 font-bold text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full">{t.new_entry}</div>
            </div>

            {/* Center Author Box & Image Upload */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-20 w-full max-w-sm">
              <div className="p-2.5 bg-white dark:bg-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-lg rotate-[-2deg] mb-4 border border-zinc-100 dark:border-zinc-700">
                 {user?.avatar ? (
                    <img src={`http://127.0.0.1:8000/storage/${user.avatar}`} alt="Author" className="w-24 h-24 object-cover rounded-sm" />
                 ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-sm"><UserCircle2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700" /></div>
                 )}
              </div>
              <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{user?.name || t.author}</h2>

              {/* Image Upload Area */}
              <div className="w-full relative group">
                {imagePreview ? (
                  <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shadow-inner">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, image: null}); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-zinc-700 dark:text-white hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 md:h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm mb-3 text-purple-500">
                        <ImagePlus className="w-6 h-6" />
                      </div>
                      <p className="mb-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">Click to attach photo</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-serif italic">PNG, JPG, or WEBP</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, image: file });
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
                {errors.image && <p className="text-red-500 text-xs font-medium mt-2">{errors.image[0]}</p>}
              </div>

              {/* Weather & Location */}
              <div className="mt-8 flex flex-col w-full border-t border-zinc-200 dark:border-zinc-800/50 pt-6">
                <div className="flex items-center justify-center gap-6 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/60 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-zinc-100 dark:border-zinc-800/50"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {weather.location}</div>
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/60 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-zinc-100 dark:border-zinc-800/50"><Cloud className="w-3.5 h-3.5 text-sky-400" /> {weather.temp !== null ? `${weather.temp}°C` : '--'}</div>
                </div>
              </div>
            </div>
            
            {/* Bottom Icons */}
            <div className="flex justify-center gap-8 mt-12 opacity-40 text-zinc-600 dark:text-zinc-400 w-full relative z-20">
              <div className="flex flex-col items-center gap-2"><svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor"><path d="M2 10C4 10 6 2 12 2C18 2 20 10 22 10"/></svg><span className="text-[9px] uppercase tracking-widest">{t.balance}</span></div>
              <div className="flex flex-col items-center gap-2"><svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor"><path d="M2 6L22 6M2 10L22 10M2 2L22 2"/></svg><span className="text-[9px] uppercase tracking-widest">{t.peace}</span></div>
            </div>
          </motion.div>

          {/* Spine / Rings */}
          <div className="book-spine z-30">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="ring-wrapper">
                <div className="hole-left"></div>
                <div className="metal-ring"></div>
                <div className="hole-right"></div>
              </div>
            ))}
          </div>

          {/* Right Page */}
          <motion.div 
            variants={rightPageVariants}
            initial="hidden"
            animate="visible"
            className="book-page-right flex flex-col relative origin-left"
          >
             <div className="lg:hidden absolute top-0 left-0 right-0 h-4 bg-zinc-200/50 dark:bg-zinc-800/50 border-y border-zinc-300 dark:border-zinc-700"></div>
            
             <div className="pinned-card-stack mb-8 lg:mt-0 mt-8 flex-shrink-0">
               <div className="pinned-card flex flex-col min-h-[150px]">
                 <input
                    type="text"
                    placeholder={t.title_placeholder}
                    className="!bg-transparent !border-none !shadow-none !px-0 !py-2 text-center !text-2xl md:!text-3xl !font-bold focus:!ring-0 !text-zinc-900 dark:!text-white placeholder-zinc-300 dark:placeholder-zinc-600 w-full mb-4"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                  {errors.title && <p className="text-red-500 text-sm font-medium text-center">{errors.title[0]}</p>}
               </div>
             </div>

             <div className="flex-1 relative z-10 w-full flex flex-col">
               <textarea
                  placeholder={t.body_placeholder}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="book-lines flex-1 w-full resize-none !bg-transparent !border-none !shadow-none !px-0 focus:!ring-0 !text-lg !text-zinc-800 dark:!text-zinc-200 placeholder-zinc-400/70 dark:placeholder-zinc-600/70"
                  style={{ fontFamily: "Georgia, serif" }}
               ></textarea>
               {errors.body && <p className="text-red-500 text-sm font-medium text-center mt-2">{errors.body[0]}</p>}
             </div>
             
             <div className="flex items-center justify-end mt-6 text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <button type="submit" className="primary-btn !w-full sm:!w-auto !px-12 flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(147,51,234,0.5)]">
                  <Save className="w-4 h-4" />
                  {t.save}
                </button>
             </div>
          </motion.div>

        </div>
      </form>
    </div>
  );
}
