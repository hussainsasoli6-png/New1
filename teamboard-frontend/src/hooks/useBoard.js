import { useCallback, useEffect, useState } from 'react';
import api from '../api';

// Loads a board and refetches whenever the real-time layer reports a change.
export default function useBoard(id) {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => api.getBoard(id).then(setBoard).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); return api.subscribe(id, load); }, [id, load]);
  return { board, error };
}
