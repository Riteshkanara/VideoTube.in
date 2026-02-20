<div align="center">

# 🎬 VideoTube

### *A Modern Video Sharing Platform Built from Scratch*

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" width="100" height="100" />

**A full-stack YouTube clone with modern architecture, sleek UI, and production-ready features**

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [🛠️ Tech Stack](#️-tech-stack) • [📸 Screenshots](#-screenshots) • [🎯 Roadmap](#-roadmap)


### **Access the App**

Open your browser and navigate to:
- **Frontend:** https://video-tube-in-final.vercel.app/
- FRONTEND IN Vercel
- **Backend API:** https://videotube-production.up.railway.app/api/v1
- BACKEND IN Railway

<br />

---

</div>

## 📖 **About The Project**

VideoTube is a **feature-rich video sharing platform** inspired by YouTube, built entirely from scratch using the MERN stack. This project demonstrates modern web development practices, clean architecture, and a pixel-perfect user interface.

### **🎯 What Makes This Special?**

- 🎨 **Production-Quality UI** — Glassmorphism, smooth animations, and responsive design
- 🔐 **Secure Authentication** — JWT with refresh tokens, bcrypt password hashing
- ☁️ **Cloud Storage** — Cloudinary integration for videos and images
- 💾 **Robust Backend** — RESTful API with proper error handling and validation
- 📱 **Fully Responsive** — Works flawlessly on mobile, tablet, and desktop
- 🧪 **Testing Phase** — Currently in development with active feature additions

<br />

---

## ✨ **Features**

<table>
<tr>
<td width="50%">

### 🎬 **Video Management**
- ✅ Upload videos with thumbnails
- ✅ HD video streaming
- ✅ Video player with full controls
- ✅ View count tracking
- ✅ Video descriptions & metadata

</td>
<td width="50%">

### 👤 **User System**
- ✅ Register with avatar & cover image
- ✅ Secure login/logout
- ✅ JWT authentication
- ✅ User profiles & channels
- ✅ Session management

</td>
</tr>
<tr>
<td width="50%">

### 💬 **Social Features**
- ✅ Like/Unlike videos
- ✅ Subscribe to channels
- ✅ Comment system
- ✅ Tweet-style posts
- ✅ Playlist creation

</td>
<td width="50%">

### 🎨 **Modern UI/UX**
- ✅ Dark mode design
- ✅ Glassmorphism effects
- ✅ Smooth animations
- ✅ Loading states
- ✅ Toast notifications

</td>
</tr>
</table>

<br />

---

## 🚀 **Quick Start**

### **Prerequisites**

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or Atlas)
- [Cloudinary Account](https://cloudinary.com/) (for media storage)

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/videotube.git
cd videotube

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Set up environment variables
# Create .env files in both backend and frontend folders (see below)

# 5. Start MongoDB (if running locally)
mongod

# 6. Start the backend server
cd backend
npm run dev

# 7. Start the frontend (in a new terminal)
cd frontend
npm run dev
```

### **Environment Variables**

**Backend** (`.env` in `backend/` folder):
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/videotube
ACCESS_TOKEN_SECRET=your_super_secret_key_here_32_chars_min
REFRESH_TOKEN_SECRET=another_super_secret_key_here_32_chars_min
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`.env` in `frontend/` folder):
```env
VITE_API_URL=http://localhost:8000/api/v1
```




<br />

---

## 🛠️ **Tech Stack**

<div align="center">

### **Frontend**

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,javascript" />

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS** | Utility-first styling |
| **Zustand** | State management |
| **React Router** | Navigation |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |

### **Backend**

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **Cloudinary** | Media storage |
| **Multer** | File uploads |

</div>

<br />

---

## 📁 **Project Structure**

```
videotube/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Business logic
│   │   ├── 📂 models/          # Database schemas
│   │   ├── 📂 routes/          # API endpoints
│   │   ├── 📂 middlewares/     # Auth, validation
│   │   ├── 📂 utils/           # Helpers, cloudinary
│   │   └── 📄 index.js         # Entry point
│   ├── 📄 .env                 # Environment variables
│   └── 📄 package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/             # API calls
│   │   ├── 📂 components/      # React components
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 store/           # Zustand stores
│   │   ├── 📂 utils/           # Helpers
│   │   ├── 📄 App.jsx          # Main app
│   │   └── 📄 main.jsx         # Entry point
│   ├── 📄 .env                 # Environment variables
│   ├── 📄 index.html
│   ├── 📄 tailwind.config.js
│   └── 📄 package.json
│
└── 📄 README.md
```

<br />

---

## 📸 **Screenshots**

<div align="center">

### 🏠 **Homepage**
*Browse trending videos with a modern, responsive grid layout*

<img src="https://via.placeholder.com/800x450/0f0f0f/ff0000?text=Homepage+Screenshot" alt="Homepage" />

---

### 🎬 **Video Player**
*HD video streaming with like, subscribe, and comment features*

<img src="https://via.placeholder.com/800x450/0f0f0f/ff0000?text=Video+Player+Screenshot" alt="Video Player" />

---

### 👤 **User Profile**
*Personalized channel page with uploaded videos and statistics*

<img src="https://via.placeholder.com/800x450/0f0f0f/ff0000?text=Profile+Screenshot" alt="Profile" />

---

### 📤 **Upload Interface**
*Drag-and-drop video upload with thumbnail preview*

<img src="https://via.placeholder.com/800x450/0f0f0f/ff0000?text=Upload+Screenshot" alt="Upload" />

</div>

> **Note:** *Replace placeholder images with actual screenshots when available*

<br />

---

## 🎯 **Roadmap**

### ✅ **Completed**
- [x] User authentication (Register, Login, Logout)
- [x] Video upload with Cloudinary
- [x] Video player with controls
- [x] Like/Unlike functionality
- [x] Subscribe/Unsubscribe to channels
- [x] Comment system
- [x] Responsive UI design
- [x] Dark theme with glassmorphism

### 🚧 **In Progress**
- [ ] Video search functionality
- [ ] Related videos sidebar
- [ ] Watch history
- [ ] Playlist management improvements
- [ ] Tweet system completion

### 🔮 **Future Enhancements**
- [ ] Video recommendations algorithm
- [ ] Live streaming support
- [ ] Video editing in-browser
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Video quality selection (360p, 720p, 1080p)
- [ ] Subtitle support
- [ ] Community posts
- [ ] Channel verification badges

<br />

---

## 🎓 **What I Learned**

Building VideoTube was an incredible learning experience. Here are the key takeaways:

<table>
<tr>
<td width="50%">

### 🔧 **Technical Skills**
- RESTful API design patterns
- JWT authentication flows
- File upload handling with Multer
- Cloud storage integration (Cloudinary)
- MongoDB aggregation pipelines
- React state management (Zustand)
- Responsive design with Tailwind

</td>
<td width="50%">

### 💡 **Best Practices**
- Clean code architecture (MVC)
- Error handling strategies
- Security best practices (bcrypt, JWT)
- API rate limiting
- CORS configuration
- Environment variable management
- Git workflow and version control

</td>
</tr>
</table>

<br />

---

## 🐛 **Known Issues**

- ⚠️ Video transcoding not implemented (uploads as-is)
- ⚠️ Search functionality in development
- ⚠️ No video quality selection yet
- ⚠️ Comment replies not implemented

*Actively working on fixes! Check the [Issues](https://github.com/Riteshkanara/videotube/issues) page.*

<br />

---

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

<br />

---

## 📝 **License**

This project is for **educational and portfolio purposes only**.

<br />

---

## 👨‍💻 **Developer**

<div align="center">

### ** Ritesh Kanara **

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Riteshkanara)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ritesh-kanara-ahir-966677244/)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yourportfolio.com)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](riteshkanara7777@gmail.com)

**💼 Open to work | 🌟 Let's connect!**

</div>

<br />

---

## 🙏 **Acknowledgments**

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Cloudinary](https://cloudinary.com/) for media storage
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Inspired by [YouTube](https://youtube.com/)
- Icons from [Lucide React](https://lucide.dev/)

<br />

---

<div align="center">

### ⭐ **If you found this project helpful, please give it a star!** ⭐

<br />

**Made with ❤️ and ☕ by Ritesh Kanara **

<br />

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png" width="50" />

</div>
