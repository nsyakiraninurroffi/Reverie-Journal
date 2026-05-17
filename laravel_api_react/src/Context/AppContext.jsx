import { createContext, useEffect, useState } from 'react';
import api from '../lib/axios';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  async function getUser() {
    try {
      const { data } = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.log(error);
      setToken(null);
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
}
