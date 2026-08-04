<div align="center">

<br/>

```
██╗   ██╗██╗██████╗ ███████╗ ██████╗ ████████╗██╗   ██╗██████╗ ███████╗
██║   ██║██║██╔══██╗██╔════╝██╔═══██╗╚══██╔══╝██║   ██║██╔══██╗██╔════╝
██║   ██║██║██║  ██║█████╗  ██║   ██║   ██║   ██║   ██║██████╔╝█████╗  
╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝  
 ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝   ██║   ╚██████╔╝██████╔╝███████╗
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝
```

<h2>🎬 A Production-Grade Video Sharing Platform — Built Solo, End to End</h2>

<p><em>YouTube's watch experience. Twitter's community layer. One MERN codebase.</em><br/>
Upload, stream, subscribe, tweet, like — the full content-platform loop, shipped and deployed.</p>

<br/>

<!-- Tech Stack Badges -->
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-338033?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-F46519?style=for-the-badge&logo=npm&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

<br/><br/>

<!-- Status Badges -->
![Status](https://img.shields.io/badge/Status-Live_%F0%9F%9F%A2-brightgreen?style=flat-square)
![Build](https://img.shields.io/badge/Build_Time-Solo_%C2%B7_4--6_Weeks-blue?style=flat-square)
![Commits](https://img.shields.io/badge/Commits-40%2B-yellow?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

<br/><br/>

[🎬 Live Demo](https://videotube-riteshkanara.vercel.app/) · [📦 GitHub Repo](https://github.com/Riteshkanara/videotube) · [👨‍💻 Developer](https://www.linkedin.com/in/ritesh-kanara-ahir-966677244) · [🐛 Report Bug](#) · [💡 Request Feature](#)

</div>

---

## 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [🎯 What Is VideoTube](#-what-is-videotube)
- [🖼️ Screenshots](#️-screenshots)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Request Flow](#-request-flow)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [📡 REST API Reference](#-rest-api-reference)
- [💡 Engineering Decisions](#-engineering-decisions)
- [⚡ Challenges Faced](#-challenges-faced)
- [🧠 Learning Outcomes](#-learning-outcomes)
- [🛣️ Roadmap](#️-roadmap)
- [⚙️ Local Setup](#️-local-setup)
- [🔐 Environment Variables](#-environment-variables)
- [🌟 Why This Project Stands Out](#-why-this-project-stands-out)
- [👨‍💻 About the Developer](#-about-the-developer)

</details>

---

## 🎯 What Is VideoTube

> **VideoTube is a full-stack video sharing platform built from the ground up — no boilerplate, no starter kit.**

It replicates the two things that make a modern content platform actually work: a smooth **video consumption experience** (upload → thumbnail → watch → like → subscribe) and a **social layer** on top of it (tweet-style posts, likes, a real community feed). Built solo across every layer — schema design, auth pipeline, media pipeline, and UI — and deployed live.

VideoTube gives you:

- 🎬 **Full video pipeline** — upload video + thumbnail, watch page, view tracking, like/unlike
- 🔐 **Production-grade auth** — JWT access + refresh token rotation, httpOnly cookies, protected routes
- 👥 **Subscriptions & channels** — subscribe to creators, dedicated channel pages
- 💬 **Community layer** — tweet-style posts with likes, a social feed alongside the video feed
- 🎨 **Premium dark UI** — fully responsive, glassmorphism-inspired, built for mobile and desktop
- ☁️ **Cloud media storage** — Cloudinary-backed video and thumbnail delivery, no local file bloat

---

## 🖼️ Screenshots

<div align="center">

| Home Feed | Watch Page |
|:---:|:---:|
| ![Home Feed](assets/screenshots/home-feed.png) | ![Watch Page](assets/screenshots/watch-page.png) |

| Upload Video | Tweets / Community Feed |
|:---:|:---:|
| ![Upload Video](assets/screenshots/upload-video.png) | ![Tweets Feed](assets/screenshots/tweets-feed.png) |

| Sign In | Create Account |
|:---:|:---:|
| ![Sign In](assets/screenshots/sign-in.png) | ![Create Account](assets/screenshots/create-account.png) |

</div>

---

## ✨ Key Features

<details>
<summary>🎬 Full Video Pipeline</summary>

Upload a video file and thumbnail together via a Multer → Cloudinary pipeline. Videos get their own watch page with a custom HTML5 player, view-count tracking on load, and like/unlike with optimistic UI updates. No third-party video CDN lock-in — Cloudinary handles transcoding and delivery.

</details>

<details>
<summary>🔐 JWT Auth with Refresh Rotation</summary>

Short-lived access tokens for API calls, long-lived refresh tokens stored in httpOnly cookies for silent re-authentication. Passwords hashed with Bcrypt before they ever touch the database. Protected routes verify the access token on every request via Express middleware — no session store required.

</details>

<details>
<summary>👥 Subscriptions & Creator Channels</summary>

Every user gets a channel page showing their uploaded videos, subscriber count, and subscribe/unsubscribe toggle. Subscriptions are modeled as their own collection so subscriber/subscribing counts can be aggregated without bloating the User document.

</details>

<details>
<summary>💬 Tweet-Style Community Posts</summary>

A lightweight social layer sitting next to the video feed — short-form text posts with like interactions, so creators aren't limited to long-form video to engage their audience.

</details>

<details>
<summary>🎨 Premium Dark Interface</summary>

A custom dark theme (not a Tailwind default palette swap) with a responsive sidebar, mobile-first breakpoints, and consistent spacing/typography across every page — home feed, watch page, channel page, and upload flow.

</details>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js · Vite · Tailwind CSS · Zustand · React Router DOM · Axios |
| **Backend** | Node.js · Express.js · MongoDB · Mongoose · Multer |
| **Auth** | JWT (Access + Refresh Tokens) · Bcrypt · httpOnly Cookie Sessions |
| **Media** | Cloudinary (video + thumbnail storage & delivery) |
| **Deployment** | Vercel (frontend) · Railway (backend) · MongoDB Atlas |

</div>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  React + Vite + Tailwind CSS + Zustand                  │  │
│   │                                                          │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │  │
│   │  │  Auth    │  │  Watch   │  │ Channel  │  │Tweets  │  │  │
│   │  │  Pages   │  │  Page    │  │  Pages   │  │ Feed   │  │  │
│   │  └──────────┘  └──────────┘  └──────────┘  └────────┘  │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                    Axios + JWT Interceptors                      │
└─────────────────────────────────────────────────────────────────┘
                               │
                    HTTPS REST API Calls
                               │
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │             Node.js + Express.js (on Railway)            │  │
│   │                                                          │  │
│   │  CORS + Cookie Parser → Routes → JWT Middleware          │  │
│   │                              │                          │  │
│   │                         Controllers                     │  │
│   │                         (MVC Logic)                     │  │
│   │                              │                          │  │
│   │           ┌──────────────────┴─────────────────┐       │  │
│   │           │                                    │        │  │
│   │      Multer (temp)                    MongoDB Service   │  │
│   │           │                                    │        │  │
│   │           ▼                                    │        │  │
│   │      Cloudinary                                │        │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                                        │
          ▼                                        ▼
┌──────────────────┐                   ┌──────────────────────┐
│    Cloudinary     │                   │    MongoDB Atlas      │
│                  │                   │    (videotube-cluster)│
│  • Video storage │                   │                      │
│  • Thumbnail CDN │                   │  Users / Videos /     │
│  • Transcoding   │                   │  Subscriptions /      │
│                  │                   │  Tweets / Likes       │
└──────────────────┘                   └──────────────────────┘
```

---

## 🔄 Request Flow

**Example: uploading a video**

```
User selects video + thumbnail on Upload page
              │
              ▼
┌─────────────────────────┐
│  React Frontend          │
│  (multipart form)        │
└──────────┬──────────────┘
           │  POST /api/v1/videos
           │  Authorization: Bearer <access_token>
           ▼
┌─────────────────────────┐
│  JWT Middleware          │  ← verifies token, attaches req.user
│  verifyJWT()              │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Multer                  │  ← receives multipart files,
│  (temp local storage)    │     hands off buffers/paths
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Cloudinary Upload        │  ← video + thumbnail pushed to
│  Service                  │     Cloudinary, returns secure URLs
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Video Model              │  ← saves URLs + metadata
│  MongoDB Atlas             │     to videos collection
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  JSON Response            │  ← { video, thumbnail, owner }
│  → Frontend redirects      │     to the new watch page
│    to watch page           │
└─────────────────────────┘
```

---

## 📁 Project Structure

```
VideoTube/
│
├── 📄 .gitignore                    ← Protects .env, node_modules
├── 📄 README.md                     ← You are here
│
├── 📁 frontend/                     ← React Frontend
│   ├── 📄 vite.config.js
│   ├── 📄 package.json
│   └── 📁 src/
│       ├── 📄 main.jsx              ← React DOM entry point
│       ├── 📄 App.jsx               ← Route definitions (react-router-dom)
│       │
│       ├── 📁 pages/                ← Route-level views
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Watch.jsx
│       │   ├── Upload.jsx
│       │   ├── Channel.jsx
│       │   └── Tweets.jsx
│       │
│       ├── 📁 components/           ← Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── VideoCard.jsx
│       │   ├── VideoPlayer.jsx
│       │   ├── SubscribeButton.jsx
│       │   └── TweetCard.jsx
│       │
│       ├── 📁 store/                ← Zustand state management
│       │   ├── authStore.js
│       │   └── videoStore.js
│       │
│       └── 📁 hooks/                ← Custom React hooks
│           └── useAuth.js
│
└── 📁 backend/                      ← Express Backend
    ├── 📄 index.js                  ← Server entry (Express + MongoDB connect)
    ├── 📄 .env                      ← 🔒 Never committed
    ├── 📄 .env.sample                ← Template for new developers
    │
    ├── 📁 routes/                  ← API route definitions only
    │   ├── user.routes.js
    │   ├── video.routes.js
    │   ├── subscription.routes.js
    │   └── tweet.routes.js
    │
    ├── 📁 controllers/             ← Business logic
    │   ├── user.controller.js
    │   ├── video.controller.js
    │   ├── subscription.controller.js
    │   └── tweet.controller.js
    │
    ├── 📁 models/                  ← Mongoose schemas
    │   ├── user.model.js
    │   ├── video.model.js
    │   ├── subscription.model.js
    │   └── tweet.model.js
    │
    └── 📁 middlewares/             ← Request pipeline guards
        ├── auth.middleware.js      ← JWT verification
        ├── multer.middleware.js    ← File upload handling
        └── error.middleware.js     ← Centralized error handling
```

---

## 🗄️ Database Schema

```
┌──────────────────────────────────────────────────────────────────┐
│                            USERS                                 │
│                                                                  │
│  _id          ObjectId (PK)                                      │
│  username     String (unique, indexed)                           │
│  email        String (unique, indexed)                           │
│  fullName     String                                              │
│  avatar       String (Cloudinary URL)                             │
│  coverImage   String (Cloudinary URL)                             │
│  password     String (bcrypt hashed)                              │
│  refreshToken String                                              │
│  watchHistory [ObjectId] (FK → Videos)                            │
│  createdAt    Date                                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │  1 User → Many Videos
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                           VIDEOS                                 │
│                                                                  │
│  _id          ObjectId (PK)                                      │
│  owner        ObjectId (FK → Users)                              │
│  videoFile    String (Cloudinary URL)                            │
│  thumbnail    String (Cloudinary URL)                            │
│  title        String                                              │
│  description  String                                              │
│  duration     Number (seconds)                                    │
│  views        Number                                              │
│  isPublished  Boolean                                             │
│  createdAt    Date                                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
              ┌──────────┴───────────┐
              ▼                      ▼
┌─────────────────────────┐  ┌─────────────────────────────────────┐
│     SUBSCRIPTIONS       │  │                LIKES                 │
│                         │  │                                     │
│  _id       ObjectId     │  │  _id         ObjectId                │
│  subscriber ObjectId    │  │  video       ObjectId | null         │
│           (FK → Users)  │  │  tweet       ObjectId | null         │
│  channel   ObjectId     │  │  likedBy     ObjectId (FK → Users)   │
│           (FK → Users)  │  │  createdAt   Date                    │
└─────────────────────────┘  └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                            TWEETS                                │
│                                                                  │
│  _id          ObjectId (PK)                                      │
│  owner        ObjectId (FK → Users)                              │
│  content      String                                              │
│  createdAt    Date                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📡 REST API Reference

### 🔐 User Routes

```
POST   /api/v1/users/register
       Body:   FormData { username, email, password, avatar, coverImage }
       Returns: { user }

POST   /api/v1/users/login
       Body:   { email, password }
       Returns: { accessToken, user }
       Cookie:  refreshToken (httpOnly)

POST   /api/v1/users/refresh-token
       Cookie:  refreshToken
       Returns: { accessToken } (rotated)

POST   /api/v1/users/logout
       Clears refreshToken cookie

GET    /api/v1/users/channel/:username
       Returns: { channel profile, subscriberCount, isSubscribed }
```

### 🎬 Video Routes *(protected — requires JWT)*

```
POST   /api/v1/videos
       Body:   FormData { videoFile, thumbnail, title, description }
       Returns: { video }

GET    /api/v1/videos
       Returns: [{ video summaries for home feed }]

GET    /api/v1/videos/:id
       Returns: Full video object + owner details, increments view count

PATCH  /api/v1/videos/:id
       Body:   { title?, description?, thumbnail? }
       Returns: { updated video }

DELETE /api/v1/videos/:id
       Returns: { success }

POST   /api/v1/videos/:id/like
       Toggles like on the video, returns updated like count
```

### 👥 Subscription Routes *(protected)*

```
POST   /api/v1/subscriptions/:channelId
       Toggles subscribe/unsubscribe

GET    /api/v1/subscriptions/:channelId
       Returns: [{ subscribers of this channel }]
```

### 💬 Tweet Routes *(protected)*

```
POST   /api/v1/tweets
       Body:   { content }
       Returns: { tweet }

GET    /api/v1/tweets/:userId
       Returns: [{ tweets by this user }]

POST   /api/v1/tweets/:id/like
       Toggles like on the tweet
```

---

## 💡 Engineering Decisions

> *Every decision here was a choice — not a default.*

<details>
<summary>🔐 Why JWT + Refresh Tokens (not sessions)?</summary>

Stateless auth that scales cleanly across separate Vercel (frontend) and Railway (backend) deployments — no shared session store to manage. Short-lived access tokens limit the damage window if one is intercepted, while a long-lived refresh token in an httpOnly cookie handles silent re-auth so users aren't logged out mid-session. Same pattern production apps use for exactly this reason.

</details>

<details>
<summary>🍃 Why MongoDB over a relational database?</summary>

A video document naturally owns loosely-structured, evolving metadata (title, description, duration, view count) without a fixed relational shape, and the read pattern for a home feed is "give me N video documents" — not multi-table joins. Mongoose schemas still enforce structure at the application layer, so this isn't a schema-less free-for-all — it's document modeling that matches how the data is actually queried.

</details>

<details>
<summary>☁️ Why Cloudinary over self-hosted storage?</summary>

Video is the one asset type you don't want to hand-roll storage for — transcoding, adaptive delivery, and CDN distribution are solved problems. Multer handles the multipart upload into a temp location, then hands off to Cloudinary, which returns a stable, optimized URL to store in MongoDB. This keeps the Node server stateless and avoids ever storing large binaries on the app server itself.

</details>

<details>
<summary>🏛️ Why separate Subscriptions and Likes as their own collections?</summary>

Embedding subscriber lists inside the User document or like lists inside the Video document works until either array grows — then every read of that document drags the whole array with it. Modeling subscriptions and likes as their own collections keeps User and Video documents small and lets subscriber/like counts be computed via aggregation instead of loading and counting embedded arrays.

</details>

<details>
<summary>🐘 Why Zustand over Redux for frontend state?</summary>

Auth state and a handful of video/UI flags don't need Redux's boilerplate — actions, reducers, and a provider tree for what amounts to a few global values. Zustand gives the same shared-state guarantees with a fraction of the setup, which matters when you're the only one maintaining the codebase.

</details>

<details>
<summary>🚂 Why split Vercel (frontend) + Railway (backend)?</summary>

Vercel is purpose-built for static/SPA frontend hosting with fast global edge delivery; Railway gives a persistent Node process for the Express server and easy MongoDB Atlas connectivity, without forcing the backend into a serverless function shape it wasn't written for. The tradeoff — cross-origin cookies — is handled explicitly rather than avoided (see Challenges below).

</details>

---

## ⚡ Challenges Faced

<details>
<summary>🍪 Cross-origin refresh cookies (Vercel ↔ Railway)</summary>

Frontend and backend live on different domains, so the refresh token cookie needed `SameSite=None; Secure`, explicit CORS `origin` + `credentials: true` on the server, and `withCredentials: true` on every Axios call. Getting silent token refresh working reliably across the two deployments took real debugging — now it's just configuration.

</details>

<details>
<summary>⏳ Railway session/token expiry in production</summary>

After a period of inactivity, Railway-hosted sessions were expiring in a way that logged users out unexpectedly instead of triggering the refresh flow. Traced it to the refresh token cookie's expiry not being aligned with the actual JWT refresh window, and fixed the cookie `maxAge` and refresh-endpoint logic to match.

</details>

<details>
<summary>🔑 Google Auth token expiry edge case</summary>

Users authenticating via Google would occasionally hit a stale-token state where the access token expired but the client didn't trigger a refresh before the next API call, resulting in a failed request instead of a silent retry. Fixed by adding an Axios response interceptor that catches a 401, attempts a token refresh, and retries the original request once before failing.

</details>

<details>
<summary>📦 Multer → Cloudinary handoff without losing files on crash</summary>

Multer initially wrote uploads to a temp directory that wasn't reliably cleaned up if the Cloudinary upload step failed mid-request. Solution: wrap the upload step in try/catch, and explicitly unlink the temp file in a `finally` block regardless of whether the Cloudinary call succeeded — so failed uploads don't silently leak disk space.

</details>

---

## 🧠 Learning Outcomes

Building VideoTube solo required putting together:

```
✅  MERN full-stack development (end-to-end solo)
✅  JWT authentication with refresh token rotation
✅  Cross-origin cookie handling (Vercel + Railway)
✅  MongoDB schema design + aggregation pipelines
✅  File upload pipelines (Multer → Cloudinary)
✅  REST API design with versioned, protected routes
✅  Zustand state management for reactive UI
✅  Production debugging (token expiry, session handling)
✅  Responsive, accessible dark-mode UI design
✅  Deploying a split frontend/backend architecture
```

---

## 🛣️ Roadmap

```
Phase 1 — Core Platform       [██████████]  Shipped
  Auth, Video Pipeline, Subscriptions, Tweets, Deploy

Phase 2 — Discovery            [░░░░░░░░░░]  Planned
  Search + AI-powered recommendations

Phase 3 — Real-Time            [░░░░░░░░░░]  Planned
  Notifications, Live Comments & Reply Threads

Phase 4 — Live & Analytics     [░░░░░░░░░░]  Planned
  Live Streaming, Creator Analytics Dashboard
```

**Planned:**
- 🔍 Search & AI-powered recommendations
- 🔔 Real-time notifications
- 💬 Video comments & reply threads
- 📡 Live streaming
- 📊 Creator analytics dashboard

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free M0 tier works)
- Cloudinary account (free tier)

### Clone and Install

```bash
git clone https://github.com/Riteshkanara/videotube.git && cd videotube

cd backend && npm install
cd ../frontend && npm install
```

### Configure Environment

```bash
cp backend/.env.sample backend/.env
# Fill in your keys — see Environment Variables below
```

### Run Development Servers

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

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

---

## 🌟 Why This Project Stands Out

| Dimension | Typical Student Video App | VideoTube |
|---|---|---|
| Architecture | Single controller file | Full MVC with clean route/controller/model separation |
| Auth | Basic session cookie | JWT + refresh token rotation, httpOnly cookies, cross-origin hardened |
| Media | Local file storage | Cloudinary CDN, no binaries touching the app server |
| Database | Flat, unindexed collections | Modeled relations (Subscriptions/Likes as own collections), indexed fields |
| Social layer | None | Tweet-style posts + likes alongside the video feed |
| Deployment | Not deployed | Live on Vercel + Railway, environment-protected |
| Production hardening | Untested | Fixed real production bugs — token expiry, session handling |
| Documentation | No README | This |

---

## 👨‍💻 About the Developer

<div align="center">

**Ritesh Kanara** · MERN Developer

*CSE Student · CHARUSAT University, Gujarat · CGPA: 8.25*

[![GitHub](https://img.shields.io/badge/GitHub-Riteshkanara-181717?style=for-the-badge&logo=github)](https://github.com/Riteshkanara)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ritesh_Kanara-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ritesh-kanara-ahir-966677244)

</div>

**Also building:** [MockMate](https://github.com/Riteshkanara/MockMate) — an AI-powered mock interview platform for Indian campus placements, with Gemini-driven question generation, voice answer mode, and college leaderboards.

---

## 🤝 Contributing

VideoTube was built solo as a portfolio project. If you'd like to suggest a feature or report a bug, open an issue on GitHub.

---

## 📄 License

MIT — use freely, credit appreciated.

---

<div align="center">

**⭐ Star this repo if you found it useful.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
