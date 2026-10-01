import { useEffect, useRef, useState } from 'react';

export default function Chat({ messages, onSend }) {
  const [text, setText] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [messages.length]);

  return (
    <aside className="chat">
      <h3>Team chat</h3>
      <div className="msgs">
        {messages.map((m) => (
          <div key={m.id}><small>{m.user} · {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small><div>{m.text}</div></div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(''); } }}>
        <input placeholder="Message…" value={text} onChange={(e) => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </aside>
  );
}
