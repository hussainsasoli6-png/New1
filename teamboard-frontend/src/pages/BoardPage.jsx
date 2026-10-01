import { Link, useParams } from 'react-router-dom';
import api from '../api';
import useBoard from '../hooks/useBoard.js';
import Column from '../components/Column.jsx';
import Chat from '../components/Chat.jsx';

export default function BoardPage() {
  const { id } = useParams();
  const { board, error } = useBoard(id);
  if (error) return <p className="err">{error} · <Link to="/">Back</Link></p>;
  if (!board) return <p>Loading…</p>;

  return (
    <>
      <div className="row"><Link to="/">← Boards</Link><h2>{board.title}</h2></div>
      <div className="layout">
        <div className="cols">
          {board.cols.map((c) => (
            <Column key={c.id} column={c}
              onAdd={(colId, t) => api.addCard(id, colId, t)}
              onMove={(cardId, colId) => api.moveCard(id, cardId, colId)}
              onDelete={(cardId) => api.deleteCard(id, cardId)} />
          ))}
        </div>
        <Chat messages={board.msgs} onSend={(t) => api.sendMessage(id, t)} />
      </div>
    </>
  );
}
