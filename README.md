# 🚀 TaskFlow — Fullstack Task Management System

TaskFlow is a state-of-the-art, premium fullstack Task Management System built with a highly responsive, glassmorphic modern UI. It features secure user authentication, interactive Kanban task boards, real-time analytics with charts, customizable user profiles, and subtask checklists.

Designed with robust security practices (JWT and password hashing), TaskFlow provides a seamless experience for organizing tasks, prioritizing work, and visualizing productivity trends.

---

## 🌟 Key Features

*   **🔒 Secure Authentication:** JWT-based user authentication system with password hashing via `bcryptjs`.
*   **📊 Interactive Analytics Dashboard:** Real-time productivity analytics displaying completed vs. pending tasks, priority distributions, and trends visualized via interactive `Recharts`.
*   **📋 Kanban-style Task Board:** Easily organize tasks into **Todo**, **In Progress**, and **Done** columns.
*   **🏷️ Rich Task Attributes:** Categorize tasks with custom tags, due dates, priority levels (**Low**, **Medium**, **High**), and detailed descriptions.
*   **📝 Subtask Management:** Break down complex tasks into actionable checklists with progress indicators.
*   **👤 Custom User Profiles:** Professional profile settings where users can view account details, change passwords, and update metadata.
*   **🎨 Premium Modern UI:** Stunning glassmorphic dark theme, custom CSS micro-animations, and fluid responsive design optimized for all screen sizes.
*   **🚀 Production-Ready & Serverless Optimized:** Out-of-the-box support for database SSL connections (e.g., Aiven MySQL Cloud) and preconfigured serverless deployment via Vercel.

---

## 🛠️ Technology Stack

### Frontend
*   **Core:** React (v19) & Vite (v8) for blistering-fast HMR and build performance.
*   **Routing:** React Router DOM (v7) for secure, component-level route protection.
*   **Data Visualization:** Recharts (v3) for dynamic, interactive charts.
*   **API Client:** Axios for robust HTTP requests, custom interceptors, and CORS handling.
*   **Styling:** Modern Vanilla CSS (tailored HSL colors, responsive grids, Flexbox, glassmorphic gradients).

### Backend
*   **Core:** Node.js & Express (v5) server.
*   **Database:** MySQL (v8) with `mysql2` driver (optimized connections & SSL readiness).
*   **Security:** JSON Web Tokens (JWT) for stateless sessions and `bcryptjs` for encryption.
*   **CORS & Middleware:** Full CORS capability configured for production and debug operations.

---

## 📂 Project Structure

```text
task/
├── database.sql           # Complete MySQL database schema
├── README.md              # Project documentation (this file)
│
├── client/                # React Frontend Workspace
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # Axios client configurations & endpoints
│   │   ├── assets/        # Frontend visual assets
│   │   ├── components/    # Reusable UI components (Navbar, TaskCard, TaskModal, ProfileModal, PrivateRoute)
│   │   ├── context/       # Auth & State Context providers
│   │   ├── pages/         # Page Views (Dashboard, Login, Register)
│   │   ├── App.css        # Core custom overrides
│   │   ├── index.css      # Custom high-fidelity global stylesheet (21KB+)
│   │   ├── main.jsx       # React DOM entry point
│   │   └── App.jsx        # Routing and application entry
│   ├── package.json       # Frontend dependencies & scripts
│   └── vercel.json        # Frontend deployment configuration
│
└── server/                # Express Backend Workspace
    ├── config/            # DB configuration & SSL options
    ├── middleware/        # Authentication & request interceptors
    ├── routes/            # Route controllers (/api/auth, /api/tasks)
    ├── index.js           # Express main server entry point
    ├── init_cloud_db.js   # Script to initialize remote cloud databases
    ├── package.json       # Backend dependencies & scripts
    └── vercel.json        # Backend serverless deployment configuration
```

---

## ⚙️ Local Development Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MySQL Server](https://www.mysql.com/) installed and running locally, or a cloud instance (e.g., Aiven, AWS RDS).

---

### Step 1: Database Setup

1.  Log into your MySQL terminal/client:
    ```bash
    mysql -u your_username -p
    ```
2.  Import the database schema using the provided `database.sql` file:
    ```sql
    SOURCE /path/to/project/database.sql;
    ```
    *This creates the `taskmanager` database and sets up the `users`, `tasks`, and `subtasks` tables with cascading deletes.*

---

### Step 2: Backend Configuration & Start

1.  Navigate into the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example` and fill in your details:
    ```env
    PORT=5000
    JWT_SECRET=your_jwt_secret_key_here
    DB_HOST=localhost
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=taskmanager
    # Optional: Set DB_SSL=true if your cloud database requires SSL connection
    ```
4.  Run the backend server in development mode:
    ```bash
    npm run dev
    ```
    *The server starts listening on `http://localhost:5000`.*

---

### Step 3: Frontend Configuration & Start

1.  Navigate into the `client` directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React dev server:
    ```bash
    npm run dev
    ```
    *The development server will launch, typically at `http://localhost:5173`.*

---

## ☁️ Cloud Database & Vercel Deployment

TaskFlow is optimized out-of-the-box for production deployment on platforms like **Vercel** with fully-managed cloud databases (like **Aiven MySQL**).

### 1. Cloud Database & SSL
*   If connecting to a secure cloud database, toggle `DB_SSL=true` in your server environment variables.
*   Run `node init_cloud_db.js` inside the `server/` directory to automatically initialize tables on your cloud instance.

### 2. Backend Deployment on Vercel
Deploy the server folder using Vercel CLI:
```bash
cd server
vercel
```
Ensure you configure the server environment variables in your Vercel Dashboard (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).

### 3. Frontend Deployment on Vercel
Deploy the client folder:
```bash
cd client
vercel
```
Set the API base URL in your frontend configs to target your live deployed backend URL.

---

## 🔒 Security & Best Practices
*   **Password Encryption:** All passwords are encrypted using `bcryptjs` before storage.
*   **Protected Routes:** Private React components prevent unauthorized access to the `Dashboard` and redirect anonymous traffic to `/login`.
*   **SQL Injection Prevention:** Uses prepared statements/parameterized queries natively provided by the MySQL `mysql2` driver.
*   **CORS Safety:** Pre-configured CORS policies prevent cross-origin scripting vulnerabilities.

---

## 📄 License
This project is licensed under the ISC License. Feel free to clone, modify, and build upon it!
