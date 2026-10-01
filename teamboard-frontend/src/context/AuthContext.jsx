import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('tb-user')); } catch { return null; } });

  const finish = ({ token, ...u }) => {
    localStorage.setItem('tb-token', token); localStorage.setItem('tb-user', JSON.stringify(u)); setUser(u);
  };
  const value = {
    user,
    login: async (n, p) => finish(await api.login(n, p)),
    register: async (n, p) => finish(await api.register(n, p)),
    logout: () => { localStorage.removeItem('tb-token'); localStorage.removeItem('tb-user'); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
