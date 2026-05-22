<div align="center">

# 🎬 VideoTube

### *A Modern Full-Stack Video Sharing Platform*

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" width="90" />

<br />

> A production-inspired video streaming and creator platform built using the MERN stack with modern UI/UX, scalable architecture, secure authentication, and real-world full-stack engineering practices.

<br />

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=339933)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-20232A?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-20232A?style=for-the-badge&logo=mongodb&logoColor=47A248)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-20232A?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/JWT-20232A?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-20232A?style=for-the-badge&logo=cloudinary&logoColor=3448C5)](https://cloudinary.com)

<br />

### 🌐 Live Demo

[🚀 Visit VideoTube](https://video-tube-in-final.vercel.app)

<br />

[✨ Features](#-features) •
[🛠️ Tech Stack](#️-tech-stack) •
[📸 Screenshots](#-screenshots) •
[🚀 Getting Started](#-getting-started) •
[🎯 Future Improvements](#-future-improvements)

</div>

---

# 📖 About The Project

VideoTube is a **modern full-stack video sharing platform** inspired by platforms like YouTube and X (Twitter), designed and developed completely from scratch using the **MERN stack**.

The goal of this project was not just to clone an existing platform, but to build a **production-style application** that demonstrates:

- scalable frontend architecture
- clean backend engineering
- secure authentication flows
- media handling pipelines
- responsive UI/UX design
- reusable component systems
- modern developer practices

This project helped me understand how real-world content platforms work internally — from authentication and media uploads to state management and optimized frontend rendering.

---

# ✨ Features

## 🎬 Video Platform

- Upload videos with thumbnails
- HD video playback
- Video metadata management
- Dynamic watch pages
- Like / unlike videos
- Subscribe to creators
- Responsive video layouts
- View count tracking
- Creator channel pages

---

## 💬 Community Features

- Tweet-style community posts
- Like interactions
- Social feed system
- Creator engagement features

---

## 🔐 Authentication & Security

- JWT Authentication
- Refresh & Access Tokens
- Protected Routes
- Secure Password Hashing
- Persistent Login Sessions
- Cookie-based authentication

---

## 🎨 Modern UI / UX

- Premium dark interface
- Responsive layouts
- Smooth hover interactions
- Reusable UI components
- Sidebar navigation system
- Modern typography & spacing
- Mobile-friendly experience

---

# 🛠️ Tech Stack

<div align="center">

## Frontend

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,javascript" />

</div>

| Technology | Usage |
|------------|-------|
| React.js | Frontend library |
| Vite | Fast build tool |
| Tailwind CSS | UI styling |
| Zustand | State management |
| React Router DOM | Routing |
| Axios | API requests |
| React Hot Toast | Notifications |

---

<div align="center">

## Backend

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

</div>

| Technology | Usage |
|------------|-------|
| Node.js | Runtime environment |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File uploads |
| Cloudinary | Media storage |

---

# 📸 Screenshots

## 🏠 Homepage

Modern responsive homepage with dynamic content layout.

<img width="100%" src="YOUR_SCREENSHOT_URL_HERE" />

---

## 🎬 Watch Page

Interactive video player with creator information and engagement actions.

<img width="100%" src="YOUR_SCREENSHOT_URL_HERE" />

---

## 📤 Upload Interface

Drag-and-drop inspired upload experience with thumbnail support.

<img width="100%" src="YOUR_SCREENSHOT_URL_HERE" />

---

## 👤 Channel Page

Dedicated creator profile page with video management structure.

<img width="100%" src="YOUR_SCREENSHOT_URL_HERE" />

---

## 💬 Tweets / Community

Social engagement section inspired by creator communities.

<img width="100%" src="YOUR_SCREENSHOT_URL_HERE" />

---

# 🧠 System Design & Architecture

```bash
VideoTube/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── store/
│   ├── hooks/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── database/
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js (v16+)
- MongoDB
- Cloudinary Account

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/videotube.git
cd videotube
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3. Configure Environment Variables

### Backend `.env`

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

---

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 4. Run The Project

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

# 🎯 Future Improvements

- Advanced search functionality
- AI-powered recommendations
- Real-time notifications
- Video comments replies
- Live streaming
- Playlist improvements
- Watch history optimization
- Analytics dashboard
- Mobile application
- Video transcoding & quality selection

---

# 🎓 Key Learnings

Building VideoTube helped me strengthen my understanding of:

## Frontend Engineering

- Component architecture
- Responsive UI design
- State management
- API integration
- Modern React patterns

---

## Backend Engineering

- REST API architecture
- JWT authentication systems
- Secure route handling
- File upload pipelines
- Database schema design

---

## Full Stack Development

- End-to-end application flow
- Deployment workflows
- Cloud media handling
- Production-style architecture
- Error handling & validation

---

# 🐛 Known Limitations

- Search functionality is currently being improved
- Video transcoding is not implemented yet
- Advanced recommendation system pending
- Reply threads for comments not added yet

---

# 🤝 Contributing

Contributions are welcome.

```bash
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
```

---

# 👨‍💻 Developer

<div align="center">

# Ritesh Kanara

### Full Stack Developer

Passionate about building scalable web applications, modern UI systems, and production-level full-stack projects.

<br />

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Riteshkanara)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ritesh-kanara-ahir-966677244)

</div>

---

# ⭐ Support

If you liked this project:

- Star the repository
- Share feedback
- Fork and improve it

---

# 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ Thank You For Visiting ⭐

Built with passion, curiosity, and lots of debugging ☕

</div>
