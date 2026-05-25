@echo off
REM Chat App Setup Script for Windows
REM This script automates the setup of the Chat Application

echo.
echo ================================
echo Chat App Setup Script
echo ================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
node -v >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Check if npm is installed
npm -v >nul 2>&1
if errorlevel 1 (
    echo npm is not installed. Please install it with Node.js
    pause
    exit /b 1
)
echo [OK] npm is installed

echo.
echo Checking MongoDB...
echo MongoDB needs to be installed locally or you can use MongoDB Atlas (cloud)
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

if exist node_modules (
    echo Backend dependencies already installed
) else (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
)

REM Create .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/chat_app
        echo JWT_SECRET=your_jwt_secret_key_change_this_in_production
        echo JWT_EXPIRE=7d
        echo CORS_ORIGIN=http://localhost:3000
        echo NODE_ENV=development
    ) > .env
    echo [OK] Backend .env created
    echo Please update MONGODB_URI if using MongoDB Atlas
) else (
    echo [OK] Backend .env already exists
)

cd ..

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend

if exist node_modules (
    echo Frontend dependencies already installed
) else (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
)

REM Create .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo REACT_APP_SOCKET_URL=http://localhost:5000
    ) > .env
    echo [OK] Frontend .env created
) else (
    echo [OK] Frontend .env already exists
)

cd ..

REM Setup Complete
echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Update backend\.env with your MongoDB connection string (if using Atlas^)
echo 2. Start MongoDB (if using local^): mongod
echo 3. Start backend: cd backend ^&^& npm start
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo Frontend will open at: http://localhost:3000
echo Backend API at: http://localhost:5000
echo.
pause
