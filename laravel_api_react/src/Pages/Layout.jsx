import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Home, LogOut, PenTool, User, Sun, Moon, LogIn, UserPlus, Menu, X, Feather, MessageSquare, Globe, Clock } from 'lucide-react';

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { lang, setLang } = useContext(AppContext);

  const t = {
    home: lang === 'id' ? 'Beranda' : 'Home',
    write: lang === 'id' ? 'Tulis' : 'Write',
    login: lang === 'id' ? 'Masuk' : 'Login',
    register: lang === 'id' ? 'Mulai' : 'Get Started',
    logout: lang === 'id' ? 'Keluar' : 'Logout',
    notifications: lang === 'id' ? 'Notifikasi' : 'Notifications',
    no_notif: lang === 'id' ? 'Tidak ada notifikasi' : 'No new notifications',
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (promptDismissed || feedbackOpen) {
      setShowPrompt(false);
      return;
    }

    const triggerPopup = () => {
      setShowPrompt(true);
      setTimeout(() => {
        setShowPrompt(false);
      }, 8000); // Stays on screen for 8 seconds
    };

    // First appearance after 5 seconds
    const initialTimer = setTimeout(triggerPopup, 5000);
    
    // Loop every 25 seconds
    const loopTimer = setInterval(triggerPopup, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(loopTimer);
    };
  }, [promptDismissed, feedbackOpen]);

  useEffect(() => {
    if (user && token) {
      getNotifications();
    }
  }, [user, token]);

  async function getNotifications() {
    try {
      const res = await api.get('/notifications', { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`, null, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (error) {
      console.log(error);
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await api.post('/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setFeedbackLoading(true);
    try {
      await api.post('/feedback', { 
        message: feedbackMsg, 
        is_anonymous: isAnonymous 
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFeedbackMsg('');
      setIsAnonymous(false);
      setFeedbackOpen(false);
      alert(lang === 'id' ? 'Terima kasih atas masukannya!' : 'Thank you for your feedback!');
    } catch (error) {
      console.log(error);
      alert('Failed to submit feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-500 selection:bg-purple-500/30">
      <header className="pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-5xl mx-auto flex justify-between h-16 items-center bg-white/70 dark:bg-[#121214]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-full px-6 transition-all duration-500">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Feather className="w-6 h-6 text-purple-600 dark:text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-colors" />
            </motion.div>
            <span className="font-bold text-xl tracking-widest text-zinc-900 dark:text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reverie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] text-zinc-600 dark:text-zinc-400 font-bold text-[11px] tracking-widest uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {currentTime.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <button 
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="px-3 py-1.5 mr-1 text-xs font-bold text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(168,85,247,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(168,85,247,0.2)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 uppercase flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 mr-1 text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(168,85,247,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(168,85,247,0.2)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 relative"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 mr-2 text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(168,85,247,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(168,85,247,0.2)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50">
                        <h3 className="font-bold text-zinc-900 dark:text-white">{t.notifications}</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => markAsRead(notif.id)}
                              className={`p-4 border-b border-zinc-50 dark:border-zinc-800/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                            >
                              <p className="text-sm text-zinc-800 dark:text-zinc-200">{notif.message}</p>
                              <span className="text-xs text-zinc-400 mt-1 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-zinc-500 text-sm">{t.no_notif}</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <>
                <Link to="/" className="p-2.5 mr-2 text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(168,85,247,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(168,85,247,0.2)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300">
                  <Home className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="flex items-center gap-3 pr-4 pl-2 py-1.5 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 rounded-full mr-2 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(168,85,247,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(168,85,247,0.2)]">
                  {user.avatar ? (
                    <img src={`http://127.0.0.1:8000/storage/${user.avatar}`} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-zinc-100 dark:border-zinc-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center border border-zinc-200 dark:border-zinc-600">
                      <User className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    </div>
                  )}
                  <p className="text-zinc-700 dark:text-zinc-200 text-sm font-bold tracking-wide">{user.name}</p>
                </Link>
                <Link to="/create" className="nav-link text-purple-600 dark:text-purple-400 font-bold tracking-wide bg-purple-50 dark:bg-purple-900/30 px-5 py-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-[0_4px_15px_rgba(168,85,247,0.2)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.3)] border border-purple-200 dark:border-purple-800/50 transition-all duration-300">
                  <PenTool className="w-4 h-4" />
                  {t.write}
                </Link>
                <form onSubmit={handleLogout}>
                  <button className="p-2.5 ml-1 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 rounded-full bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_15px_rgba(239,68,68,0.2)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300">
                    <LogOut className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  <LogIn className="w-4 h-4" />
                  {t.login}
                </Link>
                <Link to="/register" className="primary-btn !py-2 !px-4 !w-auto text-sm">
                  {t.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-bold text-[10px] tracking-widest uppercase bg-white/50 dark:bg-zinc-800/50 px-2 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
              <Clock className="w-3 h-3 text-amber-500" />
              {currentTime.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-zinc-500 dark:text-zinc-400"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-900 dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 space-y-4"
          >
            {user ? (
              <div className="flex flex-col space-y-3">
                <Link to="/" className="flex items-center gap-2 p-3 text-zinc-900 dark:text-white font-medium bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Home className="w-5 h-5" />
                  {t.home}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  {user.avatar ? (
                    <img src={`http://127.0.0.1:8000/storage/${user.avatar}`} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                  )}
                  <p className="text-zinc-700 dark:text-zinc-200 font-semibold">{user.name}</p>
                </Link>
                <Link to="/create" className="flex items-center gap-2 p-3 text-zinc-900 dark:text-white font-medium bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <PenTool className="w-5 h-5" />
                  {t.write}
                </Link>
                <form onSubmit={handleLogout}>
                  <button className="flex items-center gap-2 p-3 w-full text-left text-zinc-600 dark:text-zinc-400 font-medium">
                    <LogOut className="w-5 h-5" />
                    {t.logout}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="flex items-center gap-2 p-3 text-zinc-900 dark:text-white font-medium bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <LogIn className="w-5 h-5" />
                  {t.login}
                </Link>
                <Link to="/register" className="primary-btn">
                  {t.register}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Feedback Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Cute Pop-up Prompt */}
        <AnimatePresence>
          {showPrompt && !feedbackOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20, rotate: 10 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200 }}
              className="mb-4 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-purple-900/80 dark:via-zinc-800/90 dark:to-pink-900/80 backdrop-blur-xl p-4 rounded-[2rem] rounded-br-none shadow-[0_15px_40px_rgba(236,72,153,0.2)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-[3px] border-white dark:border-zinc-700 max-w-[240px] relative cursor-pointer group"
              onClick={() => { setFeedbackOpen(true); setShowPrompt(false); setPromptDismissed(true); }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPrompt(false); setPromptDismissed(true); }}
                className="absolute -top-3 -right-3 bg-white dark:bg-zinc-700 text-zinc-400 hover:text-rose-500 dark:text-zinc-300 rounded-full p-1.5 hover:bg-rose-50 dark:hover:bg-zinc-600 transition-all shadow-md z-10"
              >
                <X className="w-4 h-4 font-bold" />
              </button>
              
              <div className="flex gap-3 items-center mb-2">
                <motion.div 
                  animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="bg-white/60 dark:bg-black/20 p-2 rounded-full shadow-inner"
                >
                  <span className="text-3xl filter drop-shadow-md">🌻</span>
                </motion.div>
                <p className="text-[13px] font-black text-purple-900 dark:text-purple-100 leading-tight font-serif tracking-wide">
                  {lang === 'id' ? 'Psst... Hai kak!' : 'Psst... Hey there!'}
                </p>
              </div>
              
              <p className="text-xs font-medium text-purple-800/80 dark:text-purple-200/80 leading-relaxed mb-3">
                 {lang === 'id' 
                    ? 'Suka dengan fitur terbarunya? Kasih aku masukan yuk biar makin keren! ✨' 
                    : 'Loving the new features? Give me some feedback to make it better! ✨'}
              </p>

              <div className="w-full bg-white dark:bg-zinc-800 text-center py-2 rounded-xl text-[11px] font-bold text-pink-500 dark:text-pink-400 shadow-sm group-hover:bg-pink-50 dark:group-hover:bg-zinc-700 transition-colors uppercase tracking-widest flex justify-center items-center gap-1.5">
                 {lang === 'id' ? 'Beri Rating' : 'Rate Us'} 💖
              </div>
              
              {/* Little triangle pointer for speech bubble */}
              <div className="absolute -bottom-3 right-6 w-5 h-5 bg-indigo-100 dark:bg-pink-900/80 transform rotate-45 border-b-[3px] border-r-[3px] border-white dark:border-zinc-700"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => { setFeedbackOpen(true); setShowPrompt(false); setPromptDismissed(true); }}
          className="p-4 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.4)] z-40 group relative border-2 border-white/50"
        >
          <motion.div
             animate={{ rotate: [0, -20, 20, -20, 20, 0], scale: [1, 1.1, 1] }}
             transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
          >
            <MessageSquare className="w-6 h-6 drop-shadow-md" />
          </motion.div>
          <span className="absolute right-full mr-4 bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
            {lang === 'id' ? 'Kirim Masukan 💌' : 'Send Feedback 💌'}
          </span>
        </motion.button>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-8 relative shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <button onClick={() => setFeedbackOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X className="w-5 h-5"/></button>
              <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white font-serif">{lang === 'id' ? 'Masukan Anda' : 'Your Feedback'}</h2>
              <p className="text-zinc-500 text-sm mb-6">{lang === 'id' ? 'Bantu kami meningkatkan platform ini.' : 'Help us improve this platform.'}</p>
              
              <form onSubmit={submitFeedback}>
                <textarea 
                  required
                  rows="4"
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder={lang === 'id' ? 'Tulis pesan, kritik, atau saran Anda di sini...' : 'Write your message, critique, or suggestions here...'}
                  className="w-full mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 resize-none focus:ring-2 focus:ring-purple-500/20"
                ></textarea>
                
                <div className="flex items-center mb-6">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-zinc-100 border-zinc-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600 cursor-pointer"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                    {lang === 'id' ? 'Kirim feedback secara anonim 🤫' : 'Send feedback anonymously 🤫'}
                  </label>
                </div>

                <button disabled={feedbackLoading} className="primary-btn flex justify-center py-3.5">
                  {feedbackLoading ? <Feather className="w-5 h-5 animate-spin" /> : (lang === 'id' ? 'Kirim Pesan' : 'Submit Feedback')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/30 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md py-12 mt-20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Feather className="w-6 h-6 text-purple-500/70" />
            <span className="font-bold text-xl tracking-widest text-zinc-900 dark:text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reverie
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium text-center md:text-left italic font-serif">
            "Your thoughts, immortalized in the cosmic tapestry."
          </p>
          <div className="text-zinc-400 dark:text-zinc-600 text-xs font-semibold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Reverie. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
