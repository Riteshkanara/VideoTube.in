import { useState, useEffect } from "react";

const phases = [
  {
    id: 1, emoji: "🔍", color: "#3B82F6", label: "Sanity",
    title: "Phase 1 — Basic Sanity Check",
    subtitle: "Make sure nothing is obviously broken before deep testing",
    categories: [
      {
        name: "🖥️ Server & Environment",
        steps: [
          { text: "Run `npm run dev` — frontend starts with no errors in terminal" },
          { text: "Run backend server — no crash on startup" },
          { text: "MongoDB connection confirmed (check backend logs for 'Connected')" },
          { text: "Open browser console (F12) — ZERO red errors on initial load" },
          { text: "App loads at http://localhost:5173 — not a blank white page" },
          { text: "Network tab shows no 404 requests on load" },
          { text: "`.env` files exist in both frontend AND backend folders" },
          { text: "Tailwind styles are loading — dark background, not plain HTML" },
        ]
      },
      {
        name: "👁️ Visual First Look",
        steps: [
          { text: "Dark background (#0F0F0F) visible on all pages — NOT white" },
          { text: "Header appears fixed at the top of screen" },
          { text: "Sidebar appears on the left side" },
          { text: "Logo displays correctly — no broken image or plain text" },
          { text: "NO image covering full screen (the avatar bug is fixed)" },
          { text: "NO overlapping elements anywhere on homepage" },
          { text: "Content area is visible and properly spaced from sidebar" },
          { text: "All fonts loading — not just default browser system font" },
        ]
      },
      {
        name: "🧭 Navigation Basics",
        steps: [
          { text: "Clicking logo navigates to homepage" },
          { text: "All sidebar links are clickable and navigate correctly" },
          { text: "Header buttons are visible and hoverable" },
          { text: "Browser BACK button works properly" },
          { text: "Browser FORWARD button works properly" },
          { text: "Refreshing any page doesn't crash or show 404" },
        ]
      }
    ]
  },
  {
    id: 2, emoji: "🔐", color: "#EF4444", label: "Auth",
    title: "Phase 2 — Authentication Testing",
    subtitle: "Test every auth flow — this is the most critical part",
    categories: [
      {
        name: "📝 Register Flow",
        steps: [
          { text: "Register page loads at /register with modern 3-step design" },
          { text: "Step 1: Username, Full Name, Email fields all accept input" },
          { text: "Step 1: Email field rejects invalid format (e.g. 'abc' without @)" },
          { text: "Step 1: Can NOT proceed to Step 2 without filling all fields" },
          { text: "Step 2: Password field hides characters by default" },
          { text: "Step 2: Password strength meter animates as you type" },
          { text: "Step 2: Confirm password shows ✅ green when matching" },
          { text: "Step 2: Confirm password shows ❌ red when NOT matching" },
          { text: "Step 2: Can NOT proceed with mismatched passwords" },
          { text: "Step 3: Avatar upload opens file picker" },
          { text: "Step 3: Avatar preview circle shows selected image" },
          { text: "Step 3: Can remove uploaded avatar (×) button works" },
          { text: "Step 3: Cover image upload works (optional field)" },
          { text: "Step 3: Back button returns to previous step correctly" },
          { text: "Submitting with no avatar shows toast error" },
          { text: "Successful registration shows success toast message" },
          { text: "After register, automatically redirected to /login" },
          { text: "Open MongoDB Compass — new user document exists in DB" },
          { text: "Open Cloudinary dashboard — avatar image uploaded there" },
        ]
      },
      {
        name: "🔑 Login Flow",
        steps: [
          { text: "Login page loads at /login with modern glassmorphism design" },
          { text: "Email and password fields accept input" },
          { text: "Password show/hide eye button toggles visibility" },
          { text: "Submitting empty form shows validation error" },
          { text: "Wrong email/password shows error toast (not crash)" },
          { text: "Correct credentials — success toast appears" },
          { text: "After login, redirected to homepage /" },
          { text: "Header now shows user's AVATAR (not 'Sign In' button)" },
          { text: "Sidebar shows authenticated items (Upload, Liked, etc.)" },
          { text: "Open DevTools → Application → Local Storage → accessToken exists" },
          { text: "Hard refresh (Ctrl+Shift+R) — user is STILL logged in" },
          { text: "User info persists across browser tab refreshes" },
        ]
      },
      {
        name: "🚪 Logout & Protection",
        steps: [
          { text: "User dropdown appears on clicking avatar in header" },
          { text: "Logout button is visible in dropdown" },
          { text: "Clicking Logout → success toast → redirected to /login" },
          { text: "localStorage accessToken is REMOVED after logout" },
          { text: "Sidebar hides authenticated items after logout" },
          { text: "Visit /upload while logged OUT → redirected to /login" },
          { text: "Visit /playlists while logged OUT → redirected to /login" },
          { text: "Visit /subscriptions while logged OUT → redirected to /login" },
          { text: "Visit /liked-videos while logged OUT → redirected to /login" },
        ]
      }
    ]
  },
  {
    id: 3, emoji: "🎬", color: "#8B5CF6", label: "Videos",
    title: "Phase 3 — Video Features",
    subtitle: "Test the core video functionality users rely on most",
    categories: [
      {
        name: "🏠 Homepage",
        steps: [
          { text: "Video grid loads on homepage with all video cards" },
          { text: "Skeleton loading animation shows while videos are fetching" },
          { text: "Videos show in proper responsive grid (1→2→3→4 columns)" },
          { text: "Each card shows: thumbnail image, title, owner avatar" },
          { text: "Each card shows: view count, upload date, duration badge" },
          { text: "Hovering a card shows play button overlay" },
          { text: "Hovering a card zooms the thumbnail smoothly" },
          { text: "Clicking a card navigates to /watch/:videoId" },
          { text: "Empty state message shows when no videos exist" },
        ]
      },
      {
        name: "📤 Video Upload",
        steps: [
          { text: "Upload page loads at /upload with all 3 sections visible" },
          { text: "Drag a video file onto the drop zone — it highlights" },
          { text: "Dropping a video file shows the preview player" },
          { text: "Browse button opens file picker and selects video" },
          { text: "Video preview plays inside the upload page" },
          { text: "File name and file size (MB) displayed below preview" },
          { text: "× button removes selected video and shows drop zone again" },
          { text: "Thumbnail section — upload button opens file picker" },
          { text: "Thumbnail image preview shows in 16:9 aspect ratio" },
          { text: "× button removes thumbnail and shows upload zone again" },
          { text: "Title field — character counter updates (0/100)" },
          { text: "Description field — character counter updates (0/5000)" },
          { text: "Upload button is DISABLED without video, thumbnail, title, desc" },
          { text: "Submitting valid form shows animated progress bar" },
          { text: "Progress % increments from 0→100 smoothly" },
          { text: "Success toast appears after upload completes" },
          { text: "Redirected to /watch/:newVideoId after upload" },
          { text: "New video appears in Cloudinary dashboard" },
          { text: "New video appears on homepage grid" },
        ]
      },
      {
        name: "▶️ Video Watch Page",
        steps: [
          { text: "Watch page loads for a valid /watch/:videoId URL" },
          { text: "Video player renders and plays on click" },
          { text: "All controls work: play/pause, volume, fullscreen, scrub" },
          { text: "Video title displayed below player" },
          { text: "View count and upload date shown" },
          { text: "Video description visible and readable" },
          { text: "Owner avatar, name, subscriber count shown" },
          { text: "Like button visible with current like count" },
          { text: "Clicking Like — button changes color (red/filled)" },
          { text: "Clicking Like again — toggles back (unliked state)" },
          { text: "Like count increments and decrements correctly" },
          { text: "Subscribe button visible (for channels you don't own)" },
          { text: "Subscribe button toggles between subscribed/not subscribed" },
          { text: "Invalid video ID shows a 404 / Not Found message" },
        ]
      }
    ]
  },
  {
    id: 4, emoji: "💬", color: "#10B981", label: "Social",
    title: "Phase 4 — Social Features",
    subtitle: "Comments, tweets, playlists, subscriptions",
    categories: [
      {
        name: "💬 Comments System",
        steps: [
          { text: "Comments section loads below the video on watch page" },
          { text: "Comment count shows correct number" },
          { text: "Each comment shows: avatar, author name, text, timestamp" },
          { text: "Add comment form visible when logged IN" },
          { text: "Add comment form HIDDEN when logged OUT" },
          { text: "Type comment and submit — new comment appears at TOP" },
          { text: "Adding comment shows success toast" },
          { text: "Edit (pencil) button only shows on YOUR OWN comments" },
          { text: "Editing your comment updates it immediately in the list" },
          { text: "Delete button only shows on YOUR OWN comments" },
          { text: "Deleting your comment removes it from list immediately" },
          { text: "Like button on comments toggles and updates count" },
        ]
      },
      {
        name: "🐦 Tweets Page",
        steps: [
          { text: "Tweets page loads at /tweets" },
          { text: "Existing tweets display in a feed" },
          { text: "Create tweet textarea is visible" },
          { text: "Can type and submit a new tweet" },
          { text: "New tweet appears at TOP of feed immediately" },
          { text: "Edit and Delete only on YOUR OWN tweets" },
          { text: "Editing tweet updates text immediately" },
          { text: "Deleting tweet removes it immediately" },
          { text: "Like button on tweets toggles and updates count" },
        ]
      },
      {
        name: "📂 Playlists",
        steps: [
          { text: "Playlists page loads at /playlists" },
          { text: "Existing playlists show in a grid" },
          { text: "Create Playlist button opens a form/modal" },
          { text: "Can enter name and description for new playlist" },
          { text: "Submitting creates playlist and shows in grid" },
          { text: "Playlist card shows name, video count, thumbnail" },
          { text: "Clicking a playlist shows its videos" },
          { text: "Can delete a playlist — it disappears from grid" },
        ]
      },
      {
        name: "👥 Subscriptions & Channels",
        steps: [
          { text: "Subscriptions page loads at /subscriptions" },
          { text: "Subscribed channels show with avatar and name" },
          { text: "Channel page loads at /channel/:username" },
          { text: "Channel header shows avatar, cover image, name, sub count" },
          { text: "Subscribe/Unsubscribe button toggles correctly" },
          { text: "Subscriber count updates immediately on toggle" },
          { text: "Videos tab shows the channel's videos" },
          { text: "Tweets tab shows the channel's tweets" },
        ]
      }
    ]
  },
  {
    id: 5, emoji: "🎨", color: "#F59E0B", label: "UI/UX",
    title: "Phase 5 — UI/UX Quality",
    subtitle: "Visual design, animations, and user experience quality",
    categories: [
      {
        name: "🖼️ Visual Design",
        steps: [
          { text: "Consistent dark theme on ALL pages — no surprise white pages" },
          { text: "Red/pink gradient used consistently on buttons and accents" },
          { text: "Proper spacing between ALL elements — nothing cramped" },
          { text: "Cards have visible borders — elements are clearly separated" },
          { text: "Text is readable — not too dark or too small" },
          { text: "Fonts consistent throughout the entire app" },
          { text: "Buttons are consistent size across all pages" },
          { text: "Input field styles match across all forms" },
          { text: "Logo appears on all pages that have a header" },
          { text: "All images are properly contained — no overflow" },
        ]
      },
      {
        name: "✨ Animations & Interactions",
        steps: [
          { text: "Hover effects work on all buttons (scale/glow)" },
          { text: "Video card hover shows play button overlay" },
          { text: "Sidebar items slide right slightly on hover" },
          { text: "User dropdown opens with smooth fade animation" },
          { text: "Loading spinners visible during every API call" },
          { text: "Skeleton loaders show on initial page loads" },
          { text: "Toast notifications slide in and out smoothly" },
          { text: "Input fields show glow ring when focused" },
          { text: "Sidebar slides smoothly on mobile (not instant jump)" },
          { text: "Dark overlay fades in behind mobile sidebar" },
        ]
      },
      {
        name: "📋 Forms & Validation",
        steps: [
          { text: "All required fields show error if submitted empty" },
          { text: "Error messages are visible, clear, and helpful" },
          { text: "Success toasts appear after every successful action" },
          { text: "Buttons disabled during loading (prevent double submit)" },
          { text: "File inputs only accept the correct file types" },
          { text: "Character counters update in real time" },
          { text: "Form fields clear after successful submission" },
          { text: "All placeholder text is descriptive and helpful" },
        ]
      },
      {
        name: "🚫 Empty & Error States",
        steps: [
          { text: "Empty homepage shows a friendly 'No videos yet' message" },
          { text: "Empty playlists page prompts to create one" },
          { text: "Failed API calls show error message + retry button" },
          { text: "Invalid URL (e.g. /random) shows a 404 page" },
          { text: "Invalid video ID shows 'Video not found' — not a crash" },
          { text: "Network error shows user-friendly message" },
          { text: "Full-screen loader shows during initial auth check" },
        ]
      }
    ]
  },
  {
    id: 6, emoji: "📱", color: "#EC4899", label: "Responsive",
    title: "Phase 6 — Responsive Testing",
    subtitle: "Must look good on ALL screen sizes before deploying",
    categories: [
      {
        name: "📱 Mobile — 375px (iPhone SE)",
        howto: "DevTools (F12) → Toggle Device Toolbar → Select iPhone SE",
        steps: [
          { text: "Header fits without any content overflowing" },
          { text: "Logo visible and not cut off on mobile" },
          { text: "Hamburger menu (☰) button visible in header" },
          { text: "Sidebar is HIDDEN by default on mobile" },
          { text: "Clicking hamburger opens sidebar from the left" },
          { text: "Dark overlay appears behind open sidebar" },
          { text: "Clicking overlay closes the sidebar" },
          { text: "Sidebar menu items are large enough to tap" },
          { text: "Video grid shows exactly 1 column on mobile" },
          { text: "Video cards stretch full width on mobile" },
          { text: "Video title doesn't overflow (line-clamp works)" },
          { text: "Login form fits on screen without horizontal scroll" },
          { text: "Register form fits on all 3 steps" },
          { text: "Upload page shows all 3 sections vertically" },
          { text: "NO horizontal scrollbar on any page" },
          { text: "Buttons are large enough for finger tapping" },
        ]
      },
      {
        name: "📟 Tablet — 768px (iPad)",
        howto: "DevTools → set width to 768px manually",
        steps: [
          { text: "Video grid shows exactly 2 columns at tablet size" },
          { text: "Header and search bar display correctly" },
          { text: "Sidebar behavior appropriate for tablet" },
          { text: "Forms are readable and usable" },
          { text: "No layout breaks or content overflow" },
        ]
      },
      {
        name: "🖥️ Desktop — 1280px+",
        howto: "Use full-screen browser window",
        steps: [
          { text: "Sidebar is ALWAYS visible — no hamburger needed" },
          { text: "Content area has proper left margin (not hidden under sidebar)" },
          { text: "Video grid shows 3-4 columns" },
          { text: "Header search bar is visible on desktop" },
          { text: "Dropdown menus open on hover" },
          { text: "Content doesn't stretch too wide on ultra-wide screens" },
        ]
      }
    ]
  },
  {
    id: 7, emoji: "⚡", color: "#F97316", label: "Performance",
    title: "Phase 7 — Performance Testing",
    subtitle: "Make sure your app is fast enough for real users",
    categories: [
      {
        name: "🔦 Lighthouse Audit",
        howto: "F12 → Lighthouse tab → Analyze page load",
        steps: [
          { text: "Performance score ≥ 70 (aim for 90+)" },
          { text: "Accessibility score ≥ 80 (aim for 95+)" },
          { text: "Best Practices score ≥ 85" },
          { text: "SEO score ≥ 80" },
          { text: "No CRITICAL errors flagged in report" },
          { text: "Largest Contentful Paint (LCP) < 2.5 seconds" },
          { text: "Total Blocking Time (TBT) < 300ms" },
          { text: "Cumulative Layout Shift (CLS) < 0.1" },
        ]
      },
      {
        name: "🌐 Network Performance",
        howto: "F12 → Network tab → Check Disable cache",
        steps: [
          { text: "Page fully loads in under 3 seconds on fast connection" },
          { text: "No single API request takes longer than 5 seconds" },
          { text: "No unnecessary duplicate API calls happening" },
          { text: "Thumbnail images are reasonable size (not 5MB each)" },
          { text: "Throttle to Slow 3G — loading states appear" },
          { text: "App is still USABLE on slow 3G (not totally broken)" },
        ]
      },
      {
        name: "📦 Production Build",
        howto: "Run: npm run build, then: npm run preview",
        steps: [
          { text: "`npm run build` completes with no errors" },
          { text: "`npm run build` has no critical warnings" },
          { text: "dist/ folder is created after build" },
          { text: "`npm run preview` serves the app correctly" },
          { text: "ALL features work in the preview build" },
          { text: "No console errors in preview build" },
          { text: "Build JS bundle is under 1MB (check dist/assets/)" },
        ]
      }
    ]
  },
  {
    id: 8, emoji: "🚀", color: "#6366F1", label: "Deploy",
    title: "Phase 8 — Pre-Deployment Final Check",
    subtitle: "The last checklist before going live to production!",
    categories: [
      {
        name: "🧹 Code Cleanup",
        steps: [
          { text: "Remove ALL 
          { text: "Remove TestingDashboard route from App.jsx" },
          { text: "Remove any hardcoded localhost:8000 URLs from frontend" },
          { text: "No API keys or secrets hardcoded anywhere in frontend" },
          { text: ".env files are listed in .gitignore (CRITICAL!)" },
          { text: "No unused imports or dead code" },
        ]
      },
      {
        name: "⚙️ Environment Variables",
        steps: [
          { text: "Frontend .env has: VITE_API_URL=https://your-backend.com" },
          { text: "Backend .env has: MONGODB_URI (production Atlas URL)" },
          { text: "Backend .env has: ACCESS_TOKEN_SECRET (32+ chars)" },
          { text: "Backend .env has: REFRESH_TOKEN_SECRET (32+ chars)" },
          { text: "Backend .env has: CLOUDINARY_CLOUD_NAME" },
          { text: "Backend .env has: CLOUDINARY_API_KEY" },
          { text: "Backend .env has: CLOUDINARY_API_SECRET" },
          { text: "Backend .env has: CORS_ORIGIN=https://your-frontend.com" },
          { text: "Created .env.example file (with placeholder values only)" },
        ]
      },
      {
        name: "📁 GitHub Repository",
        steps: [
          { text: ".gitignore includes: node_modules, .env, dist/" },
          { text: "README.md written with project description" },
          { text: "README has: live demo link" },
          { text: "README has: tech stack listed" },
          { text: "README has: setup instructions" },
          { text: "README has: screenshots of the app" },
          { text: "Repository is PUBLIC (for portfolio visibility)" },
          { text: "Latest code committed and pushed to main branch" },
          { text: "No .env files visible in GitHub repository" },
        ]
      },
      {
        name: "🌍 Deployment Platform",
        steps: [
          { text: "Vercel or Netlify account created" },
          { text: "Repository connected to deployment platform" },
          { text: "VITE_API_URL set in platform environment variables" },
          { text: "Backend deployed (Railway / Render / Heroku)" },
          { text: "Backend CORS_ORIGIN updated to production frontend URL" },
          { text: "MongoDB Atlas production cluster connected" },
          { text: "Test: Register new account on LIVE URL" },
          { text: "Test: Login on LIVE URL works" },
          { text: "Test: Upload video on LIVE URL works" },
          { text: "Test: Watch video on LIVE URL works" },
          { text: "Share live URL with a friend and get feedback!" },
        ]
      }
    ]
  }
];

export default function TestingDashboard() {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem("vt_test_progress");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [activePhase, setActivePhase] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    localStorage.setItem("vt_test_progress", JSON.stringify(checked));
  }, [checked]);

  const toggle = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));
  const toggleCategory = (key) => setExpandedCategories(p => ({ ...p, [key]: !p[key] }));

  const phaseStats = (phase) => {
    let total = 0, done = 0;
    phase.categories.forEach((cat, ci) => {
      cat.steps.forEach((_, si) => {
        total++;
        if (checked[`${phase.id}-${ci}-${si}`]) done++;
      });
    });
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  };

  const overall = () => {
    let total = 0, done = 0;
    phases.forEach(ph => { const s = phaseStats(ph); total += s.total; done += s.done; });
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  };

  const ov = overall();
  const phase = phases[activePhase];
  const ps = phaseStats(phase);

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#080808", minHeight: "100vh", color: "#fff" }}>
      {/* Top bar */}
      <div style={{ background: "linear-gradient(90deg,#FF0000,#FF4D8D)", padding: "3px 0" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              background: "linear-gradient(135deg,#FF0000,#FF4D8D)",
              borderRadius: 12, width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 0 20px rgba(255,0,0,0.5)"
            }}>🧪</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: -1 }}>
                UI Testing Dashboard
              </h1>
              <p style={{ color: "#666", margin: 0, fontSize: 13 }}>
                VideoTube — Production Readiness Checklist
              </p>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div style={{
          background: "#111", border: "1px solid #1e1e1e",
          borderRadius: 16, padding: "24px 28px", marginBottom: 28
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                Overall Progress
              </div>
              <div style={{ fontSize: 15, color: "#888" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>{ov.done}</span>
                {" "}of {ov.total} tests completed
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 52, fontWeight: 900, lineHeight: 1,
                background: ov.pct === 100
                  ? "linear-gradient(135deg,#10B981,#34D399)"
                  : "linear-gradient(135deg,#FF0000,#FF4D8D)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                {ov.pct}%
              </div>
              <div style={{ fontSize: 12, color: ov.pct === 100 ? "#10B981" : "#555", marginTop: 2 }}>
                {ov.pct === 100 ? "🎉 READY TO DEPLOY!" : ov.pct >= 75 ? "Almost there..." : ov.pct >= 50 ? "Good progress!" : "Keep going!"}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: "#1a1a1a", borderRadius: 100, height: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 100,
              background: ov.pct === 100
                ? "linear-gradient(90deg,#10B981,#34D399)"
                : "linear-gradient(90deg,#FF0000,#FF4D8D)",
              width: `${ov.pct}%`,
              transition: "width 0.6s ease",
              boxShadow: ov.pct > 0 ? "0 0 12px rgba(255,0,0,0.5)" : "none"
            }} />
          </div>

          {/* Phase pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
            {phases.map((ph, i) => {
              const s = phaseStats(ph);
              const done = s.pct === 100;
              return (
                <button
                  key={ph.id}
                  onClick={() => setActivePhase(i)}
                  style={{
                    padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                    border: activePhase === i ? `1.5px solid ${ph.color}` : "1.5px solid #222",
                    background: activePhase === i ? `${ph.color}22` : done ? "#0a2a1a" : "#111",
                    color: activePhase === i ? ph.color : done ? "#10B981" : "#555",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 5
                  }}
                >
                  {done ? "✓" : ph.emoji} {ph.label}
                  <span style={{
                    background: activePhase === i ? ph.color : done ? "#10B981" : "#222",
                    color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 10
                  }}>
                    {s.pct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase content */}
        <div>
          {/* Phase header */}
          <div style={{
            background: `linear-gradient(135deg, ${phase.color}22, ${phase.color}08)`,
            border: `1px solid ${phase.color}44`,
            borderRadius: 16, padding: "20px 24px", marginBottom: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{phase.emoji}</div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{phase.title}</h2>
              <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>{phase.subtitle}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 44, fontWeight: 900, lineHeight: 1,
                color: ps.pct === 100 ? "#10B981" : phase.color
              }}>{ps.pct}%</div>
              <div style={{ color: "#555", fontSize: 12 }}>{ps.done}/{ps.total} done</div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {phase.categories.map((cat, ci) => {
              const catKey = `cat-${phase.id}-${ci}`;
              const isOpen = expandedCategories[catKey] !== false;
              const catDone = cat.steps.filter((_, si) => checked[`${phase.id}-${ci}-${si}`]).length;
              const catPct = Math.round(catDone / cat.steps.length * 100);

              return (
                <div key={ci} style={{
                  background: "#0e0e0e", border: "1px solid #1a1a1a",
                  borderRadius: 14, overflow: "hidden"
                }}>
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(catKey)}
                    style={{
                      width: "100%", padding: "14px 20px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "none", border: "none", color: "#fff",
                      cursor: "pointer", gap: 12
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.name}</span>
                      {cat.howto && (
                        <span style={{
                          background: "#1a1a1a", color: "#666",
                          padding: "2px 8px", borderRadius: 6, fontSize: 11
                        }}>
                          💡 {cat.howto}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        background: catPct === 100 ? "#10B981" : "#1a1a1a",
                        color: catPct === 100 ? "#fff" : "#666",
                        borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700
                      }}>
                        {catDone}/{cat.steps.length}
                      </div>
                      <span style={{ color: "#444", fontSize: 18 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Progress bar for category */}
                  <div style={{ height: 2, background: "#1a1a1a" }}>
                    <div style={{
                      height: "100%",
                      background: catPct === 100 ? "#10B981" : phase.color,
                      width: `${catPct}%`, transition: "width 0.4s ease"
                    }} />
                  </div>

                  {/* Steps */}
                  {isOpen && (
                    <div>
                      {cat.steps.map((step, si) => {
                        const key = `${phase.id}-${ci}-${si}`;
                        const isDone = checked[key];
                        return (
                          <div
                            key={si}
                            onClick={() => toggle(key)}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 14,
                              padding: "12px 20px", cursor: "pointer",
                              borderTop: "1px solid #141414",
                              background: isDone ? "#0a1a0a" : "transparent",
                              transition: "background 0.2s"
                            }}
                          >
                            {/* Checkbox */}
                            <div style={{
                              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                              border: isDone ? "none" : `1.5px solid #333`,
                              background: isDone ? "#10B981" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s",
                              boxShadow: isDone ? "0 0 8px rgba(16,185,129,0.4)" : "none"
                            }}>
                              {isDone && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </div>

                            {/* Step number & text */}
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                              <span style={{
                                fontSize: 11, color: "#333", fontWeight: 700,
                                minWidth: 24, paddingTop: 2
                              }}>
                                {String(si + 1).padStart(2, "0")}
                              </span>
                              <span style={{
                                fontSize: 13.5, lineHeight: 1.6,
                                color: isDone ? "#444" : "#ccc",
                                textDecoration: isDone ? "line-through" : "none",
                                transition: "all 0.2s"
                              }}>
                                {step.text}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Phase navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {activePhase > 0 && (
              <button
                onClick={() => setActivePhase(p => p - 1)}
                style={{
                  flex: 1, padding: "14px 24px", borderRadius: 12,
                  background: "#111", border: "1px solid #222", color: "#888",
                  fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >
                ← {phases[activePhase - 1].emoji} {phases[activePhase - 1].title.split("—")[1]}
              </button>
            )}
            {activePhase < phases.length - 1 && (
              <button
                onClick={() => setActivePhase(p => p + 1)}
                style={{
                  flex: 1, padding: "14px 24px", borderRadius: 12,
                  background: `linear-gradient(135deg,${phases[activePhase + 1].color},${phases[activePhase + 1].color}bb)`,
                  border: "none", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 4px 20px ${phases[activePhase + 1].color}44`
                }}
              >
                Next: {phases[activePhase + 1].emoji} {phases[activePhase + 1].title.split("—")[1]} →
              </button>
            )}
          </div>

          {/* Final completion */}
          {activePhase === phases.length - 1 && ov.pct === 100 && (
            <div style={{
              marginTop: 24, background: "linear-gradient(135deg,#064e3b,#065f46)",
              border: "1px solid #10B98144", borderRadius: 16, padding: 32, textAlign: "center"
            }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>All Tests Passed!</h2>
              <p style={{ color: "#6ee7b7", marginBottom: 20 }}>Your app is production-ready. Time to deploy!</p>
              <div style={{
                background: "#022c22", borderRadius: 10, padding: 16,
                fontFamily: "monospace", textAlign: "left", fontSize: 13, color: "#34D399"
              }}>
                <div style={{ color: "#666", marginBottom: 4 }}># Deploy to Vercel</div>
                <div>npm run build</div>
                <div>npx vercel --prod</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #1a1a1a", textAlign: "center", color: "#333", fontSize: 12 }}>
          🧪 VideoTube Testing Dashboard — Remove this page before deploying to production!
        </div>
      </div>
    </div>
  );
}