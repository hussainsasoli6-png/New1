export default function Card({ card, onDelete }) {
  return (
    <div className="card" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', card.id)}>
      <div>{card.title}<small>{card.by}</small></div>
      <button className="ghost" onClick={() => onDelete(card.id)} aria-label="Delete card">✕</button>
    </div>
  );
}
