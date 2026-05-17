import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import api from '../../lib/axios';
import { motion } from 'framer-motion';
import { Save, BookOpen, ArrowLeft } from 'lucide-react';

export default function Update() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const [errors, setErrors] = useState({});
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  async function getPost() {
    try {
      const res = await api.get(`/posts/${id}`);
      if (user && res.data.user_id !== user.id) {
        navigate('/');
      }
      setFormData({
        title: res.data.title,
        body: res.data.body,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPost();
  }, [id, user]);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  const bookVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 perspective-[1200px]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Edit Entry</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Revise your inscribed thoughts.</p>
        </div>
        <Link to={`/posts/${id}`} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
      </div>

      <form onSubmit={handleUpdate}>
        <motion.div 
          variants={bookVariants}
          initial="hidden"
          animate="visible"
          style={{ transformOrigin: 'center' }}
          className="book-spread min-h-[600px] mb-8"
        >
          {/* Left Page (Title & Meta) */}
          <div className="book-page-left flex flex-col justify-center">
            <div className="text-center mb-12">
              <BookOpen className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <h2 className="text-zinc-400 dark:text-zinc-500 font-serif italic text-sm tracking-widest uppercase">Revision</h2>
            </div>
            
            <div className="mb-8 text-center px-4">
              <input
                type="text"
                placeholder="The Title..."
                className="!bg-transparent !border-none !shadow-none !px-0 !py-4 text-center !text-4xl md:!text-5xl !font-bold focus:!ring-0 !text-zinc-900 dark:!text-white placeholder-zinc-300 dark:placeholder-zinc-700 w-full"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ fontFamily: "Georgia, serif" }}
              />
              <div className="h-[2px] w-24 mx-auto bg-amber-500/50 mt-4 rounded-full"></div>
              {errors.title && <p className="text-red-500 text-sm mt-4 font-medium">{errors.title[0]}</p>}
            </div>

            <div className="mt-auto text-center">
              <p className="text-zinc-400 dark:text-zinc-600 font-serif italic text-sm">
                Written by <br/>
                <span className="font-bold font-sans text-zinc-700 dark:text-zinc-400 not-italic">{user?.name || 'Author'}</span>
              </p>
            </div>
          </div>

          {/* Right Page (Content) */}
          <div className="book-page-right flex flex-col">
            <div className="flex-1 relative">
              <textarea
                placeholder="Begin writing here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="book-lines w-full h-full min-h-[400px] resize-none !bg-transparent !border-none !shadow-none !px-0 focus:!ring-0 !text-lg !text-zinc-800 dark:!text-zinc-200 placeholder-zinc-300 dark:placeholder-zinc-600"
                style={{ fontFamily: "Georgia, serif" }}
              ></textarea>
            </div>
            {errors.body && <p className="text-red-500 text-sm mt-4 font-medium text-center">{errors.body[0]}</p>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-end"
        >
          <button className="primary-btn !w-full sm:!w-auto !px-12 flex items-center gap-3">
            <Save className="w-5 h-5" />
            Update Entry
          </button>
        </motion.div>
      </form>
    </div>
  );
}
