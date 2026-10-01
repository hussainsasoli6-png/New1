import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const nav = useNavigate();
  const load = useCallback(() => api.getBoards().then(setBoards), []);
  useEffect(() => { load(); return api.subscribe('*', load); }, [load]);

  async function create(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const b = await api.createBoard(title.trim());
    nav(`/boards/${b.id}`);
  }
  return (
    <>
      <h2>Your boards</h2>
      <form className="row" onSubmit={create}>
        <input placeholder="New board title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button>Create</button>
      </form>
      <div className="grid">
        {boards.map((b) => (
          <Link key={b.id} to={`/boards/${b.id}`} className="tile">
            <b>{b.title}</b><small>{b.cols.reduce((n, c) => n + c.cards.length, 0)} cards</small>
          </Link>
        ))}
        {!boards.length && <p>No boards yet.</p>}
      </div>
    </>
  );
}
