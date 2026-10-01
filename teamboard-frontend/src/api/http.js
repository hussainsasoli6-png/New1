// Real backend. Contract lives in README.md.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const WS = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws';

async function req(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('tb-token');
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || res.statusText);
  return res.status === 204 ? null : res.json();
}

export const register = (name, password) => req('/auth/register', { method: 'POST', body: { name, password } });
export const login = (name, password) => req('/auth/login', { method: 'POST', body: { name, password } });
export const getBoards = () => req('/boards');
export const createBoard = (title) => req('/boards', { method: 'POST', body: { title } });
export const getBoard = (id) => req(`/boards/${id}`);
export const addCard = (boardId, colId, title) => req(`/boards/${boardId}/cards`, { method: 'POST', body: { colId, title } });
export const moveCard = (boardId, cardId, colId) => req(`/cards/${cardId}`, { method: 'PATCH', body: { colId } });
export const deleteCard = (boardId, cardId) => req(`/cards/${cardId}`, { method: 'DELETE' });
export const sendMessage = (boardId, text) => req(`/boards/${boardId}/messages`, { method: 'POST', body: { text } });

// onEvent fires whenever the server says something changed; callers just refetch.
export function subscribe(boardId, onEvent) {
  const ws = new WebSocket(`${WS}?boardId=${boardId}&token=${localStorage.getItem('tb-token') || ''}`);
  ws.onmessage = (e) => onEvent(JSON.parse(e.data)); // {type:'board:updated'|'message:new'|'boards:updated'}
  return () => ws.close();
}
