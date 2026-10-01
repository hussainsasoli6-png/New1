// In-browser fake backend (localStorage + BroadcastChannel) so the UI works before the server exists.
const K = 'teamboard-mock';
const uid = () => Math.random().toString(36).slice(2, 9);
const fresh = () => ({ users: [], boards: [] });
const load = () => { try { return JSON.parse(localStorage.getItem(K)) || fresh(); } catch { return fresh(); } };
const sender = new BroadcastChannel('tb');
const me = () => JSON.parse(localStorage.getItem('tb-user') || '{}');

function mut(boardId, type, fn) {
  const db = load(); const out = fn(db);
  localStorage.setItem(K, JSON.stringify(db));
  sender.postMessage({ type, boardId });
  return out;
}
const find = (db, id) => { const b = db.boards.find((x) => x.id === id); if (!b) throw new Error('Board not found'); return b; };

export async function register(name, password) {
  return mut('', 'boards:updated', (db) => {
    if (db.users.some((u) => u.name === name)) throw new Error('Name already taken');
    const u = { id: uid(), name, password }; db.users.push(u);
    return { id: u.id, name, token: u.id };
  });
}
export async function login(name, password) {
  const u = load().users.find((x) => x.name === name && x.password === password);
  if (!u) throw new Error('Invalid credentials');
  return { id: u.id, name, token: u.id };
}
export const getBoards = async () => load().boards;
export const getBoard = async (id) => find(load(), id);
export const createBoard = async (title) => mut('', 'boards:updated', (db) => {
  const b = { id: uid(), title, cols: ['To do', 'Doing', 'Done'].map((t) => ({ id: uid(), title: t, cards: [] })), msgs: [] };
  db.boards.push(b); return b;
});
export const addCard = async (boardId, colId, title) => mut(boardId, 'board:updated', (db) =>
  find(db, boardId).cols.find((c) => c.id === colId).cards.push({ id: uid(), title, by: me().name }));
export const moveCard = async (boardId, cardId, colId) => mut(boardId, 'board:updated', (db) => {
  const b = find(db, boardId); let card;
  b.cols.forEach((c) => { const i = c.cards.findIndex((k) => k.id === cardId); if (i >= 0) card = c.cards.splice(i, 1)[0]; });
  if (card) b.cols.find((c) => c.id === colId).cards.push(card);
});
export const deleteCard = async (boardId, cardId) => mut(boardId, 'board:updated', (db) =>
  find(db, boardId).cols.forEach((c) => { c.cards = c.cards.filter((k) => k.id !== cardId); }));
export const sendMessage = async (boardId, text) => mut(boardId, 'message:new', (db) =>
  find(db, boardId).msgs.push({ id: uid(), user: me().name, text, at: Date.now() }));

export function subscribe(boardId, onEvent) {
  const ch = new BroadcastChannel('tb');
  ch.onmessage = (e) => { if (boardId === '*' || e.data.boardId === boardId) onEvent(e.data); };
  return () => ch.close();
}
