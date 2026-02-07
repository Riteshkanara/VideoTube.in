# 🚀 Professional Backend JavaScript Project

This is a production-grade backend architecture built with **Node.js**, **Express.js**, and **MongoDB**. It follows a modular structure to ensure scalability, security, and clean code practices.

## 🏗️ Project Architecture

This project uses a "separation of concerns" model:

* **`src/models`**: Mongoose schemas for data modeling (Users, Videos, etc.).
* **`src/controllers`**: The brain of the app. Contains the logic for registration, login, and video management.
* **`src/routes`**: Defined endpoints using Express Router for clean URL structures.
* **`src/middlewares`**: Logic that runs between the request and the controller (e.g., Multer for files, JWT for Auth).
* **`src/db`**: Dedicated connection logic for MongoDB.
* **`src/utils`**: Standardized wrappers for API Responses and Error Handling.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Object Modeling:** Mongoose
- **Storage:** Cloudinary (Media) & Multer (Local Temp)
- **Security:** JWT (JSON Web Tokens) & Bcrypt

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js and npm installed.

### 2. Installation
```bash
git clone [https://github.com/Riteshkanara/backend.js.git](https://github.com/Riteshkanara/backend.js.git)
cd backend.js
npm install
