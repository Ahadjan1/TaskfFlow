# ⚙️ TaskFlow — Express & MySQL Backend API

This is the Express backend server for the **TaskFlow** Task Management System, fully powered by Node.js, Express (v5), and MySQL (v8).

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Create a `.env` file in this directory based on the `.env.example` file:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=taskmanager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Server Locally
To start the server with file watch mode enabled for auto-reloading:
```bash
npm run dev
```
*   The server will start listening at `http://localhost:5000`.

---

## 🛣️ API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
*   `POST /api/auth/register` — Register a new user profile
*   `POST /api/auth/login` — Authenticate user and sign JWT session token
*   `GET /api/auth/profile` — Fetch details of the currently authenticated user
*   `PUT /api/auth/profile/password` — Securely update account password

### 📋 Task Routes (`/api/tasks`)
*   `GET /api/tasks` — Retrieve all tasks for the logged-in user (with filters)
*   `POST /api/tasks` — Create a new task (supports tags, due dates, and priorities)
*   `PUT /api/tasks/:id` — Update status, priority, description, or attributes of a task
*   `DELETE /api/tasks/:id` — Safely remove a task (cascades to subtasks)
*   `POST /api/tasks/:id/subtasks` — Add actionable checklist subtasks
*   `PUT /api/tasks/:id/subtasks/:subtaskId` — Toggle completion of a subtask

---

## 🔒 Security Best Practices
*   Passwords are encrypted utilizing salt-round hashing via `bcryptjs`.
*   Routes are strictly secured using JWT token extraction middleware (`auth.js`).
*   Database calls are fully parameterized using prepare statement APIs in the `mysql2` driver to protect against injection attempts.

---

*For database installation script and client-side setup instructions, refer to the [Root README.md](../README.md).*
