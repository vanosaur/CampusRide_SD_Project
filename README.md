# 🚗 CabShare - Campus Ride Sharing Platform

## 📌 Overview

CabShare is a campus-based ride sharing platform that allows students to post, discover, and join rides in real-time. It helps reduce travel costs and improves coordination among students.

---

## 🎯 Problem Statement

Students often travel individually and pay high cab fares (~₹900). There is no structured way to find others traveling at the same time, leading to wasted money and poor coordination.

---

## 💡 Solution

CabShare provides a platform where students can:

* Create rides
* Join rides
* Split fares automatically
* Chat in real-time
* Receive notifications

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose ODM)
* **Real-time:** Socket.io (WebSockets)
* **Authentication:** JWT, bcrypt, Email OTP
* **Deployment:** Vercel, Railway

---

## ⚙️ Features

* Ride creation and management
* Join / leave ride
* Real-time fare splitting
* Live group chat (Socket.io)
* Notifications system
* Campus-only authentication via email OTP
* Real-time updates using WebSockets

---

## 🧠 OOP Concepts Used

* **Encapsulation** → Ride, User classes
* **Inheritance** → Notification hierarchy
* **Polymorphism** → Notification handling
* **Abstraction** → Services (Auth, Socket, Fare)

---

## 🧩 Design Patterns

* **Observer Pattern** → Notifications & ride updates
* **Strategy Pattern** → Ride filtering logic
* **Factory Pattern** → Notification creation
* **Singleton Pattern** → Database & Socket instances
* **Template Method Pattern** → Workflow handling (validate → process → notify)

---

## 📐 SOLID Principles

* **Single Responsibility** → Separate services (Auth, Ride, Notification)
* **Open/Closed** → Extend features without modifying existing code
* **Liskov Substitution** → Notification subclasses interchangeable
* **Interface Segregation** → Small, focused interfaces
* **Dependency Inversion** → Services depend on abstractions

---

## 🏗️ System Architecture

CabShare follows a **layered client-server architecture with real-time WebSocket communication**:

* Frontend (React) interacts via REST APIs
* Backend (Node.js + Express) handles business logic
* Socket.io manages real-time events (chat, ride updates)
* MongoDB stores flexible, document-based data (users, rides, messages, notifications)
* Mongoose ODM is used for schema modeling and database interaction

---

## 🔄 SDLC (Software Development Life Cycle)

1. Requirement Analysis – Identified campus ride-sharing problem
2. System Design – Designed architecture, database, APIs
3. Implementation – Developed frontend and backend modules
4. Testing – Created test cases and validated features
5. Deployment – Hosted using Vercel and Railway

---

