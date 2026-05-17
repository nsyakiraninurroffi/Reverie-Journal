import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import { Calendar, UserCircle2, ArrowRight, Feather } from 'lucide-react';
import { AppContext } from '../Context/AppContext';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useContext(AppContext);

  const t = {
    title: lang === 'id' ? 'Koleksi Jurnal' : 'The Inscribed Collection',
    subtitle: lang === 'id' ? 'Baca refleksi, perjalanan pribadi, dan cerita indah dari komunitas.' : 'Read reflections, personal journeys, and beautifully crafted stories from the community.',
    loading: lang === 'id' ? 'Membuka Halaman...' : 'Unveiling Stories...',
    likes: lang === 'id' ? 'Suka' : 'Likes',
    read: lang === 'id' ? 'Baca' : 'Read',
    empty_title: lang === 'id' ? 'Belum ada catatan' : 'No entries yet',
    empty_sub: lang === 'id' ? 'Jadilah yang pertama membagikan cerita Anda.' : 'Be the first to share your journey.',
  };

  async function getPosts() {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 120, 
        damping: 15, 
        mass: 0.8 
      } 
    }
  };

  return (
    <>
      <div className="mb-12 text-center mt-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="title font-serif tracking-normal"
        >
          {t.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto italic font-serif"
        >
          {t.subtitle}
        </motion.p>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Feather className="w-10 h-10 text-zinc-800 dark:text-amber-500 animate-pulse" />
          <p className="text-zinc-600 dark:text-zinc-500 font-serif italic text-sm tracking-widest uppercase animate-pulse">{t.loading}</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {posts.length > 0 ? (
            posts.map((post, index) => {
              const gradients = [
                'from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900/50 dark:via-purple-900/50 dark:to-indigo-900/50',
                'from-orange-300 via-rose-300 to-purple-400 dark:from-orange-900/50 dark:via-rose-900/50 dark:to-purple-900/50',
                'from-cyan-300 via-blue-300 to-purple-400 dark:from-cyan-900/50 dark:via-blue-900/50 dark:to-purple-900/50',
                'from-emerald-300 via-teal-300 to-cyan-400 dark:from-emerald-900/50 dark:via-teal-900/50 dark:to-cyan-900/50',
                'from-amber-300 via-orange-300 to-rose-400 dark:from-amber-900/50 dark:via-orange-900/50 dark:to-rose-900/50',
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div 
                  variants={item} 
                  key={post.id} 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="relative group rounded-[2.5rem] p-[1.5px] overflow-hidden h-full"
                >
                  {/* Glowing background aura */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-700 blur-2xl`}></div>
                  
                  {/* Glass Card */}
                  <div className="relative h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 dark:border-zinc-700/50 p-6 flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    
                    {/* Top Header (Date & Likes) */}
                    <div className="w-full flex justify-between items-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mb-4 uppercase tracking-widest">
                       <span>
                         {new Date(post.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}
                         <span className="mx-1 opacity-50">•</span>
                         {new Date(post.created_at).toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <span className="flex items-center gap-1.5 bg-white/50 dark:bg-zinc-800/50 px-2 py-1 rounded-full border border-white/50 dark:border-zinc-700/50">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                         {post.likes_count || 0}
                       </span>
                    </div>

                    {/* Glowing Avatar */}
                    <div className="relative mb-5 mt-2">
                       <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} rounded-full blur-md opacity-80 scale-110 group-hover:scale-125 transition-transform duration-500`}></div>
                       {post.user?.avatar ? (
                          <img src={`http://127.0.0.1:8000/storage/${post.user.avatar}`} alt={post.user.name} className="w-20 h-20 rounded-full object-cover relative z-10 border-[3px] border-white/80 dark:border-zinc-800/80 shadow-lg" />
                       ) : (
                          <div className="w-20 h-20 rounded-full relative z-10 border-[3px] border-white/80 dark:border-zinc-800/80 shadow-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <UserCircle2 className="w-10 h-10 text-zinc-400" />
                          </div>
                       )}
                    </div>

                    {/* Author & Title */}
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">{post.user?.name}</h3>
                    <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white text-center mb-6 line-clamp-2 leading-tight tracking-tight">
                      {post.title}
                    </h2>

                    {/* Body Snippet */}
                    <div className="w-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl p-5 mb-8 shadow-inner border border-white/50 dark:border-zinc-700/50 flex-1">
                       <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3 text-center leading-relaxed">
                         {post.body}
                       </p>
                    </div>

                    {/* Bottom Read Button */}
                    <div className="mt-auto w-full">
                       <Link to={`/posts/${post.id}`} className="flex items-center justify-center gap-2 w-full py-4 rounded-[1.25rem] bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold tracking-widest uppercase text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.02] border border-white/20">
                          {t.read} <ArrowRight className="w-4 h-4" />
                       </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 glass-panel border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-900 shadow-inner mb-6">
                <Calendar className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.empty_title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 italic font-serif">{t.empty_sub}</p>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
