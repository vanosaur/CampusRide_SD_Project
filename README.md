# 🚗 CampusRide - Smart Commute Platform

## 📌 Project Overview
CampusRide is a high-fidelity, full-stack ride-sharing platform designed specifically for university students. It solves the coordination problem and high cost of individual travel by allowing students to discover, join, and manage shared commutes in real-time.

---

## 🏗️ Architecture & Lead Developer Credits
**Vani Rudra (Lead Architect)**: Auth Service, Ride Logic, SOLID Implementation, Repo & API Architecture.

### **Core Design Patterns (SOLID)**
- **Singleton Pattern**: Managed via `SocketManager` and `RideService` for consistent state.
- **Factory Pattern**: The `NotificationFactory` handles dynamic creation of real-time alerts.
- **Strategy Pattern**: Flexible ride discovery using the `RideFilter` logic.
- **Decorator Pattern**: Implemented via the `catchAsync` wrapper for clean error handling.

---

## ⚡ Tech Stack
- **Backend**: Node.js, Express, TypeScript (Strict Mode)
- **Database**: MongoDB + Mongoose ODM
- **Validation**: Zod (Schema-based request guarding)
- **Security**: JWT (Stateless Auth), bcrypt (Password hashing)
- **Real-time**: Socket.io (Bi-directional communication)

---

## 🛠️ Global API Reference

### **Authentication Module**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Sends 6-digit OTP to university email. |
| `POST` | `/api/auth/verify-otp` | Validates OTP and registers the user. |
| `POST` | `/api/auth/login` | Authenticates User & Returns JWT. |
| `GET` | `/api/auth/me` | Fetches current user profile. |

### **Ride Service Module**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rides` | Creates a new ride (Auto-creates Driver membership). |
| `GET` | `/api/rides` | Discover rides with `destination` & `date` filters. |
| `GET` | `/api/rides/:id` | Detailed view of a ride, members, and chat. |
| `POST` | `/api/rides/:id/join` | Passenger request to join a ride. |
| `PUT` | `/api/rides/:id/members` | **Host Only**: Accept or Reject a member. |
| `PUT` | `/api/rides/:id/confirm` | **Host Only**: Finalize ride and block further joins. |

---

## 🛡️ Professional Error Architecture
The platform implements a **Centralized Error Handling Architecture** to ensure the API never crashes and provides consistent feedback:
- **`AppError` Class**: Distinguishes between Operational (User) errors and System bugs.
- **`globalErrorHandler`**: A single middleware safety net that catches all unhandled exceptions.
- **Error Format**:
```json
{
  "status": "fail",
  "message": "Invalid credentials",
}
```

---

## 🚀 Setup & Deployment

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` (See Environment Variables below)
4. `npm run dev`

### Frontend Setup
1. `npm install`
2. `npm run dev`

### Environment Variables
```bash
MONGO_URI=mongodb://localhost:27017/campusride
JWT_SECRET=your_secure_secret
PORT=5001
EMAIL_USER=your_university_email
EMAIL_PASS=your_app_password
```

---

## 👥 Team Members & Modules
1. **Vani Rudra (TL)** – Team Lead + Backend Architecture (Auth, Ride Service, SOLID)
2. **Bulbul Agarwalla** – Frontend Development (React Pages, AuthContext)
3. **Anuradha Raghuwanshi** – Real-Time & Chat (Socket.io, ChatBox)
4. **Apoorva Choudhary** – Database & API Design (Schema, REST Endpoints)
5. **Ganga Raghuwanshi** – Testing & Documentation (Test Cases, Flow Diagrams)
