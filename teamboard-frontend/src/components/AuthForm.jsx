import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isLogin = mode === 'login';

  async function submit(e) {
    e.preventDefault(); setError('');
    try { await (isLogin ? login : register)(name.trim(), password); nav('/'); }
    catch (err) { setError(err.message); }
  }
  return (
    <form className="box" onSubmit={submit}>
      <h2>{isLogin ? 'Log in' : 'Create account'}</h2>
      <input placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <div className="err">{error}</div>
      <button>{isLogin ? 'Log in' : 'Register'}</button>
      <small>{isLogin ? <>No account? <Link to="/register">Register</Link></> : <>Have one? <Link to="/login">Log in</Link></>}</small>
    </form>
  );
}
