# TeamBoard frontend (React + Vite)

    npm install && cp .env.example .env && npm run dev

Runs on a built-in mock API by default. Set `VITE_USE_MOCK=false` to use the real backend.

## Structure
    src/
      api/         index.js (picks mock or http) · http.js (real) · mock.js (fake)
      context/     AuthContext.jsx   user + login/register/logout
      hooks/       useBoard.js       load board + refetch on real-time events
      components/  Layout · ProtectedRoute · AuthForm · Column · Card · Chat
      pages/       Login · Register · Boards · Board · NotFound
      styles/      index.css

## API contract (backend team implements)
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | /auth/register, /auth/login | {name,password} | {id,name,token} |
| GET / POST | /boards | {title} | Board[] / Board |
| GET | /boards/:id | | Board |
| POST | /boards/:id/cards | {colId,title} | Card |
| PATCH | /cards/:id | {colId} | Card |
| DELETE | /cards/:id | | 204 |
| POST | /boards/:id/messages | {text} | Message |

Auth: `Authorization: Bearer <token>`.
WebSocket `/ws?boardId=&token=` sends `{type:'board:updated'|'message:new'|'boards:updated', boardId}`; the client refetches.

Board = `{id,title,cols:[{id,title,cards:[{id,title,by}]}],msgs:[{id,user,text,at}]}`
