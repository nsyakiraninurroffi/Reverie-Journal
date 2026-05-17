import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { Edit3, Trash2, UserCircle2, ArrowLeft, Feather, Sun, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Show() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token, lang } = useContext(AppContext);
  const navigate = useNavigate();

  const t = {
    back: lang === 'id' ? 'Kembali ke Koleksi' : 'Back to Collection',
    reading: lang === 'id' ? 'Membaca tinta...' : 'Reading the ink...',
    likes: lang === 'id' ? 'Suka' : 'Likes',
    share: lang === 'id' ? 'Bagikan' : 'Share',
    written_by: lang === 'id' ? 'Ditulis oleh' : 'Written by',
    revise: lang === 'id' ? 'Revisi Catatan' : 'Revise Entry',
    delete: lang === 'id' ? 'Hapus Cerita' : 'Delete Story',
    not_found: lang === 'id' ? 'Cerita tidak ditemukan.' : 'Story not found.',
    confirm_del: lang === 'id' ? 'Apakah Anda yakin ingin menghapus cerita ini secara permanen?' : 'Are you sure you want to permanently delete this story?',
  };

  async function getPost() {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPost();
  }, [id]);

  async function handleDelete(e) {
    e.preventDefault();
    if (confirm(t.confirm_del)) {
      try {
        await api.delete(`/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleLike() {
    if (!user) return navigate('/login');
    try {
      const res = await api.post(`/posts/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost({
        ...post,
        liked_by_user: res.data.liked,
        likes_count: res.data.liked ? post.likes_count + 1 : post.likes_count - 1
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Read "${post.title}" on Reverie.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Feather className="w-12 h-12 text-[#c6e3e7] dark:text-amber-500" />
          </motion.div>
          <p className="text-zinc-400 dark:text-zinc-500 font-serif italic text-sm tracking-widest uppercase animate-pulse">{t.reading}</p>
        </div>
      ) : post ? (
        <>
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 font-medium transition-colors bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Link>
          </div>

          <motion.article 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden mb-12"
          >
            {/* Hero Image */}
            {post.image ? (
               <div className="w-full h-[400px] md:h-[500px] relative">
                 <img src={`http://127.0.0.1:8000/storage/${post.image}`} alt={post.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
               </div>
            ) : (
               <div className="w-full h-32 md:h-48 bg-gradient-to-br from-purple-50 to-amber-50 dark:from-purple-900/10 dark:to-amber-900/10"></div>
            )}

            {/* Content Container */}
            <div className="px-6 py-10 md:px-16 md:py-16 relative">
               {/* Author Float */}
               <div className={`absolute ${post.image ? '-top-12' : '-top-16'} right-6 md:right-16`}>
                  {post.user?.avatar ? (
                    <img src={`http://127.0.0.1:8000/storage/${post.user.avatar}`} alt="Avatar" className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-[1.5rem] object-cover border-4 border-white dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-900" />
                  ) : (
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                       <UserCircle2 className="w-12 h-12 md:w-16 md:h-16" />
                    </div>
                  )}
               </div>

               {/* Meta info */}
               <div className="flex items-center gap-3 text-[11px] md:text-sm font-bold text-purple-600 dark:text-purple-400 mb-6 uppercase tracking-widest mt-2 md:mt-0">
                 <span>{new Date(post.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                 <span>{t.written_by} {post.user?.name}</span>
               </div>

               {/* Title */}
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-10 leading-[1.15]" style={{ fontFamily: "'Playfair Display', serif" }}>
                 {post.title}
               </h1>

               {/* Body */}
               <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-loose font-serif md:text-xl">
                 {post.body}
               </div>

               {/* Actions Footer */}
               <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={handleLike} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all ${post.liked_by_user ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-900/20' : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 shadow-sm'}`}>
                       <svg className={`w-5 h-5 transition-transform duration-300 ${post.liked_by_user ? 'scale-110' : 'scale-100'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={post.liked_by_user ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                       <span className="font-bold text-sm">{post.likes_count || 0}</span>
                    </button>
                    <button onClick={handleShare} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all shadow-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                       <span className="uppercase text-[10px] tracking-widest font-bold">{t.share}</span>
                    </button>
                 </div>

                 {/* Edit/Delete if author */}
                 {user && user.id === post.user_id && (
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      <Link to={`/posts/update/${post.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 p-3 text-zinc-500 hover:text-purple-600 bg-zinc-50 hover:bg-purple-50 border border-zinc-200 hover:border-purple-200 rounded-2xl transition-colors dark:bg-zinc-800/50 dark:border-zinc-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 dark:hover:border-purple-800/50">
                        <Edit3 className="w-5 h-5" />
                      </Link>
                      <form onSubmit={handleDelete} className="flex-1 md:flex-none flex">
                        <button className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-red-600 bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-2xl transition-colors dark:bg-zinc-800/50 dark:border-zinc-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-800/50">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                   </div>
                 )}
               </div>
            </div>
          </motion.article>
        </>
      ) : (
        <div className="text-center py-40 glass-panel border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent rounded-[2.5rem]">
          <Feather className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
          <div className="text-xl text-zinc-500 font-serif italic">{t.not_found}</div>
        </div>
      )}
    </div>
  );
}
