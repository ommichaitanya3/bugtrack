# BugTrack

A MERN stack bug tracking application where users can register, log in, and manage their own bugs.

## Key Features
- User registration and login with JWT authentication
- Passwords hashed with bcryptjs
- Bug CRUD: title, description, priority (Low/Medium/High), status (Open/In Progress/Resolved)
- Each user can only access their own bugs
- Filter by status, search by title
- Dashboard with bug counts by status

## Technologies Used
- MongoDB with Mongoose
- Express.js (Node.js)
- React.js (Vite), React Router, Axios
- JWT, bcryptjs

## Progress
- [x] Backend setup, MongoDB connection
- [x] User model, register and login (JWT)
- [x] Bug CRUD APIs, JWT middleware, stats endpoint
- [x] React client setup, auth pages, protected routes
- [x] Bug list, filters, create/edit form, dashboard
- [x] Final testing and polish

## Project Structure
```
bugtrack/
├── backend/   (Express API: config, models, controllers, routes, middleware)
└── client/    (React frontend: api, context, components, pages)
```

## Setup and Installation
Prerequisites: Node.js and MongoDB (local or Atlas).

1. Clone the repo
```bash
git clone https://github.com/ommichaitanya3/bugtrack.git
cd bugtrack
```

2. Backend
```bash
cd backend
npm install
```
Create `backend/.env` using `backend/.env.example` as a template:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bugtrack
JWT_SECRET=your_long_random_string
```

3. Client
```bash
cd ../client
npm install
```

## Running the Application
Backend (http://localhost:5000):
```bash
cd backend
npm run dev
```
Client (http://localhost:5173):
```bash
cd client
npm run dev
```

## API Endpoints
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/bugs` (supports `?status=` and `?search=`)
- `POST /api/bugs`
- `GET /api/bugs/stats`
- `GET /api/bugs/:id`, `PUT /api/bugs/:id`, `DELETE /api/bugs/:id`

All `/api/bugs` routes require `Authorization: Bearer <token>`.

## Code0 Usage Log
Code0 (CodeZero extension) was used in this project. Every change was planned by the tool, reviewed and approved by me, then tested manually.

1. Backend phase 1: generated db.js, server.js, User model, auth controller and routes using CodeZero (plan reviewed and approved by me). Verified with Thunder Client and MongoDB Compass.
2. Backend phase 2: generated JWT middleware, Bug model, bug controller and routes using CodeZero (plan reviewed and approved). Verified with Thunder Client (create, list, stats, 401 without token).
3. Frontend part A: generated axios instance, AuthContext, ProtectedRoute, login/register pages and routing using CodeZero (plan approved). Verified in browser (register auto-login, refresh persistence, logout, login).
4. Frontend part B: generated dashboard with stats cards, bug list, debounced search, status filter, reusable bug form with validation, and delete confirmation using CodeZero (plan approved). Verified in browser (create, edit, filter, search, delete).

## AI-Assisted Development Experience
I used Code0 (CodeZero) in plan-first mode: for each phase I wrote a detailed prompt, reviewed the plan it proposed, approved it, and then read and tested the generated code myself. The tool was fast at scaffolding the backend and the React UI, but it did not run tests, so I verified every phase manually with Thunder Client, MongoDB Compass and the browser. I also caught and fixed an issue the AI did not cause: PowerShell-created files were UTF-16, which stopped Git from ignoring `.env`, and I debugged it with `git check-ignore`. This workflow taught me to treat AI output as a draft that I must understand, test and own.

## Challenges
- The CodeZero plan-submission step initially showed a plans-directory issue. I informed the StartupMeu team and continued setup. Later the plan workflow worked and all code was generated through approved plans.
- A PowerShell-created `.gitignore` and `README.md` were UTF-16 encoded, so Git did not ignore `.env` at first. I found it with `git check-ignore`, re-saved the files as ASCII/UTF-8, and confirmed `.env` was never committed.