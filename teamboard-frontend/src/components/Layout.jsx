import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header>
        <Link to="/"><b>TeamBoard</b></Link>
        <span>{user.name}</span>
        <button className="ghost" onClick={logout}>Log out</button>
      </header>
      <main><Outlet /></main>
    </>
  );
}
