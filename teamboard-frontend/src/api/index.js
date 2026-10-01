// Single entry point: the rest of the app only imports `api` from here.
import * as http from './http.js';
import * as mock from './mock.js';
const api = import.meta.env.VITE_USE_MOCK === 'false' ? http : mock;
export default api;
