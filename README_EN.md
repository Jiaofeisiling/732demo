<h1 align="center">
  <a href="https://github.com">
    <img src="https://github.com/Jiaofeisiling/732demo/blob/099be042fc88f0b0be3fa42862fa6fc8611953ec/client/public/logo.png?raw=true" width="150" height="150" alt="banner" />
  </a>
</h1>
<p align="center">
    English | <a href="./README.md">中文</a> <br></p>
<div align="center">
</div>

# Gamified Task Management System

A task management system built with the MERN stack (MongoDB, Express, React, Node.js), incorporating gamification elements like task cards, equipment slots, and reward mechanisms to enhance user experience.

## Key Features

### Core Functionality
- ✅ User authentication (Register/Login)
- ✅ Task management (Create/Edit/Delete)
- ✅ Task categorization (Short-term/Long-term)
- ✅ Subtask system (Breakdown for long-term tasks)
- ✅ Task equipment slots (3 daily slots)

### Gamification Elements
- 🃏 Card system (Blank cards, Reward cards)
- 🎯 Daily card quota mechanism
- ⏳ Periodic card cooldown
- 🏆 Task completion reward bonuses

## Technology Stack

### Frontend
- React 18 + React Router 6
- Tailwind CSS + Custom theme
- Axios HTTP client
- Framer Motion animation library

### Backend
- Express.js framework
- MongoDB database
- Mongoose ODM
- JWT authentication

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 4.4+

### Installation
1. Clone repository
   ```bash
   git clone <repo-url>
   ```

2. Install dependencies
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Configure environment
    - Copy `.env.example` to `.env` and fill configurations
    - Ensure MongoDB service is running

4. Start development servers
   ```bash
   # Backend
   cd server && npm run dev
   
   # Frontend
   cd client && npm start
   ```

## Project Structure

```
├── client/            # React frontend
│   ├── public/        # Static assets
│   └── src/           # Source code
│       ├── components/ # Reusable components
│       ├── pages/      # Page components
│       └── services/   # API services
│
├── server/            # Express backend
│   ├── config/        # DB configuration
│   ├── controllers/   # Business logic
│   ├── models/        # Data models
│   └── routes/        # API routes
└── README.md          # Project documentation
```

## Development Guide

### Common Commands
| Command             | Purpose                |
|---------------------|------------------------|
| `npm run dev`       | Start backend server   |
| `npm start`         | Start frontend server  |
| `npm test`          | Run frontend tests     |

### Extension Ideas
- Add more card types
- Implement achievement system
- Develop mobile adaptation

## Contribution
Welcome to submit Issues and PRs. Please follow existing code style.
```