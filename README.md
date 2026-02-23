<br />
<div align="center">
<img width="300" height="120" alt="Screenshot 2026-02-21 130651" src="https://github.com/user-attachments/assets/72c7c93d-6684-46dd-a0bc-258fa170a57c" />
<h3 align="center">I'm Not Ai</h3>

  <p align="center">
    Realtime social deduction game project with a Spring Boot backend and a React/Vite frontend.
    <br />
    <br />
    <a href="https://im-not-aifrontend.vercel.app/">I'm Not Ai</a> click to see the demo
  </p>
</div>

# I'm Not Ai

ImNotAI is a real-time multiplayer social deduction chat game where a hidden AI joins the conversation — and players must figure out which participant is the AI.

- `Backend/ImNotAi-backend` (Spring Boot + WebSocket/STOMP)
- `Frontend` (React + TypeScript + Vite + Zustand + STOMP/SockJS)

## Features

- Create and join game rooms
- Real-time room state sync via WebSocket
- Speaking and voting rounds
- AI-generated message participation
- Spectator mode after elimination (watch only, no send/vote)
- End-game result overlay (`AI WIN` / `HUMAN WIN`)

## Project Structure

```text
ImNotAi-main/
├─ Backend/
│  └─ ImNotAi-backend/
└─ Frontend/
```

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Zustand
- axios
- `@stomp/stompjs` + `sockjs-client`

### Backend
- Spring Boot
- Spring Web MVC
- Spring WebSocket
- Spring WebFlux (used by AI service integration)
- Lombok

## Game Flow

1. Host creates a room and submits a premise.
2. Players join using a room code.
3. Host starts the game.
4. Each round cycles through:
- `SPEAKING`
- `VOTING`
5. The game ends when AI or humans satisfy the backend win condition.



## Local Development

## Prerequisites

- Node.js 20+ (Node 22 works)
- npm
- Java 17
- Maven (or use `mvnw` / `mvnw.cmd`)

## 1) Run Backend

```powershell
cd Backend\ImNotAi-backend
.\mvnw.cmd spring-boot:run
```

Backend default port:
- `http://localhost:8080`

### Backend Environment Variables (Optional / Recommended)

- `OPENROUTER_API_KEY` (required for AI-generated responses)
- `PORT` (default `8080`)
- `FRONTEND_URL` (default `http://localhost:5173`)
- `CORS_ALLOWED_ORIGINS` (comma-separated origins)

Example (PowerShell):

```powershell
$env:OPENROUTER_API_KEY="your_key_here"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
.\mvnw.cmd spring-boot:run
```

## 2) Run Frontend

```powershell
cd Frontend
npm install
copy .env.example .env
npm run dev
```

Open:
- `http://localhost:5173`

### Frontend Environment Variables

`Frontend/.env`

```env
VITE_BACKEND_BASE_URL=http://localhost:8080
```


## License

MIT

