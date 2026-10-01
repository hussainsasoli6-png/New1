import { useState } from 'react';
import Card from './Card.jsx';

export default function Column({ column, onAdd, onMove, onDelete }) {
  const [title, setTitle] = useState('');
  const [over, setOver] = useState(false);

  return (
    <div className={`col${over ? ' over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData('text/plain'); if (id) onMove(id, column.id); }}>
      <h3>{column.title}<span>{column.cards.length}</span></h3>
      {column.cards.map((c) => <Card key={c.id} card={c} onDelete={onDelete} />)}
      <form onSubmit={(e) => { e.preventDefault(); if (title.trim()) { onAdd(column.id, title.trim()); setTitle(''); } }}>
        <input placeholder="+ Add card" value={title} onChange={(e) => setTitle(e.target.value)} />
      </form>
    </div>
  );
}
