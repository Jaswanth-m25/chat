#!/bin/bash

# Chat App Setup Script
# This script automates the setup of the Chat Application

echo "================================"
echo "Chat App Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install it from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Please install it with Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm is installed${NC}"

# Check if MongoDB is installed or Atlas URL provided
echo ""
echo -e "${BLUE}MongoDB Check:${NC}"
read -p "Are you using MongoDB Atlas (cloud)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please make sure you have your MongoDB Atlas connection string ready${NC}"
else
    if ! command -v mongod &> /dev/null; then
        echo -e "${YELLOW}MongoDB is not installed locally. Install it or use MongoDB Atlas${NC}"
        echo "Download from: https://www.mongodb.com/try/download/community"
    fi
fi
echo ""

# Backend Setup
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}Backend dependencies already installed${NC}"
else
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${YELLOW}✗ Failed to install backend dependencies${NC}"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${BLUE}Creating backend .env file...${NC}"
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your_jwt_secret_key_change_this_in_production_$(openssl rand -hex 8)
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ Backend .env created${NC}"
    echo -e "${YELLOW}Please update MONGODB_URI if using MongoDB Atlas${NC}"
else
    echo -e "${GREEN}✓ Backend .env already exists${NC}"
fi

cd ..

# Frontend Setup
echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
cd frontend

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}Frontend dependencies already installed${NC}"
else
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${YELLOW}✗ Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${BLUE}Creating frontend .env file...${NC}"
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env already exists${NC}"
fi

cd ..

# Setup Complete
echo ""
echo "================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB connection string (if using Atlas)"
echo "2. Run MongoDB (if using local): mongod"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Frontend will open at: http://localhost:3000"
echo "Backend API at: http://localhost:5000"
echo ""
