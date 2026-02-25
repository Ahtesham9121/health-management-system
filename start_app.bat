@echo off
echo Starting Health Management System...

cd "c:\Users\ahtes\Desktop\Health Management System"

echo Starting Backend (Spring Boot)...
start "HMS Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend (Vite)...
start "HMS Frontend" cmd /k "cd frontend && npm run dev"

echo Services started in new windows.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
pause
