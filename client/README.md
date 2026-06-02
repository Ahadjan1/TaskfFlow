# 🖥️ TaskFlow — React Frontend

This is the React frontend application for the **TaskFlow** system. It is powered by React (v19), Vite (v8) for fast development, Recharts for dynamic dashboard visualization, and custom styled glassmorphic Vanilla CSS.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
*   The application will start locally on `http://localhost:5173`.
*   Make sure your backend server is running on `http://localhost:5000` (or configure the environment appropriately).

### 3. Production Build
To create a optimized production build of the static files:
```bash
npm run build
```

---

## 🛠️ Features Implemented
*   **📊 Analytics Dashboard:** Interactive task metrics, priority break-downs, and completion rate graphs with `Recharts`.
*   **📋 Kanban Task Board:** Dynamic categorization of tasks (Todo, In Progress, Done).
*   **📝 Task & Subtask Modals:** Create, view, edit tasks and manage subtask checklists in real time.
*   **🔒 Auth Interceptors:** Secured pages with automatic redirection for non-authenticated sessions.
*   **👤 Custom Profile Modal:** Direct password changes, user information viewing, and account details.

---

*For full project configuration, backend variables, and MySQL database setup, please refer to the [Root README.md](../README.md).*
