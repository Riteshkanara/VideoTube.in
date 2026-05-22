<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=VideoTube&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Full-Stack%20Video%20Sharing%20Platform&descAlignY=60&descSize=20" width="100%"/>

<br/>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=339933" />
  <img src="https://img.shields.io/badge/MongoDB-20232A?style=for-the-badge&logo=mongodb&logoColor=47A248" />
  <img src="https://img.shields.io/badge/Express-20232A?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-20232A?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4" />
  <img src="https://img.shields.io/badge/Cloudinary-20232A?style=for-the-badge&logo=cloudinary&logoColor=3448C5" />
  <img src="https://img.shields.io/badge/JWT-20232A?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Live%20%F0%9F%9F%A2-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
</p>

### 🚀 [**View Live Demo →**](https://video-tube-in-final.vercel.app)

<br/>

</div>

---

## 🎯 What is VideoTube?

> A **production-grade video sharing platform** built from scratch — think YouTube meets Twitter, powered by the **MERN stack**. Covers the full engineering journey: from auth pipelines to cloud media storage to reactive UI.

---

## ✨ Core Features

<table>
<tr>
<td width="50%">

**🎬 Video Platform**
- Upload videos + thumbnails
- HD playback & watch pages
- Like / Unlike & view tracking
- Subscribe to creators
- Creator channel pages

</td>
<td width="50%">

**🔐 Auth & Security**
- JWT Access + Refresh Tokens
- Cookie-based persistent sessions
- Protected routes
- Secure password hashing (Bcrypt)

</td>
</tr>
<tr>
<td width="50%">

**💬 Community**
- Tweet-style community posts
- Like interactions
- Social feed system

</td>
<td width="50%">

**🎨 UI / UX**
- Premium dark interface
- Fully responsive layouts
- Sidebar navigation
- Mobile-friendly design

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js · Vite · Tailwind CSS · Zustand · React Router DOM · Axios |
| **Backend** | Node.js · Express.js · MongoDB · Mongoose · Multer |
| **Auth** | JWT (Access + Refresh Tokens) · Bcrypt · Cookie-based sessions |
| **Media** | Cloudinary (video + thumbnail storage) |

</div>

---

## 🗂️ Project Structure

```
VideoTube/
├── frontend/          → React + Vite + Tailwind
│   ├── components/    → Reusable UI components
│   ├── pages/         → Route-level views
│   ├── store/         → Zustand state management
│   └── hooks/         → Custom React hooks
│
└── backend/           → Node + Express + MongoDB
    ├── controllers/   → Business logic
    ├── models/        → Mongoose schemas
    ├── routes/        → REST API endpoints
    └── middlewares/   → Auth, error handling, upload
```

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/Riteshkanara/videotube.git && cd videotube

# 2. Install
cd backend && npm install
cd ../frontend && npm install

# 3. Set env variables (see below), then run both
npm run dev   # backend
npm run dev   # frontend
```

<details>
<summary><b>📋 Environment Variables</b></summary>

**Backend `.env`**
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

</details>

---

## 🎓 Key Takeaways

- ✅ End-to-end JWT auth with refresh token rotation
- ✅ Scalable file upload pipeline via Multer → Cloudinary
- ✅ Clean REST API with protected routes & middleware
- ✅ Zustand state management for reactive UI
- ✅ Production-style folder architecture & error handling

---

## 🔮 Roadmap

- [ ] Search & AI-powered recommendations
- [ ] Real-time notifications
- [ ] Video comments & reply threads
- [ ] Live streaming
- [ ] Analytics dashboard

---

<div align="center">

## 👨‍💻 Built by Ritesh Kanara

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Riteshkanara)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ritesh-kanara-ahir-966677244)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
