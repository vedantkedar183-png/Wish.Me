<div align="center">

# 🎂 Wishora

### *Create beautiful, animated birthday surprises for someone special*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF4154?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## ✨ What is Wishora?

**Wishora** is a free, open-source web app that lets you create a stunning, personalized birthday page for someone you love — in under 60 seconds. Fill in their name, upload a photo, write a heartfelt message, pick a theme, and share a link. That's it. 💌

---

## 📸 Screenshots

> *Add screenshots here after running the app.*

| Landing Page | Creator Form | Birthday Page |
|:---:|:---:|:---:|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 🚀 Features

- 🎨 **6 Hand-crafted Themes** — Romantic Rose, Galaxy Dreams, Tropical Sunset, Golden Classic, Midnight Magic, and Pastel Candy
- 📸 **Photo Upload** — Drag & drop or click. Instant preview. Validates type & size (≤ 5 MB)
- ✍️ **Personal Message** — Up to 500 characters with a live character counter
- 🎵 **Background Music** — 4 royalty-free birthday tracks, or silent mode
- ✨ **Rich Animations** — Canvas confetti burst, floating emoji particles, typewriter name effect, photo glow ring, bouncing emoji row
- 🔗 **Shareable Link** — All data (name, message, theme, music) encoded into the URL — works instantly with no backend
- 📱 **QR Code** — Built-in QR code generator for quick sharing
- 💬 **WhatsApp Share** — One-tap WhatsApp deep-link button
- 👁️ **Live Preview** — Review the birthday page before publishing
- 💾 **Auto-Save** — Form data persists across page refreshes via `localStorage`
- 📱 **Fully Responsive** — Polished on every screen size from 375px to 4K
- ♿ **Accessible** — ARIA labels, focus-visible rings, semantic HTML throughout
- 🏗️ **Production-ready** — Clean folder structure, reusable components, code splitting

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite 5](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion 11](https://www.framer.com/motion/) | Animations & transitions |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | Confetti celebration |
| [qrcode.react](https://github.com/zpao/qrcode.react) | Client-side QR code |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [clsx](https://github.com/lukeed/clsx) | Conditional class names |
| Google Fonts | Dancing Script, Playfair Display, Inter |

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/wishora.git
cd wishora

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

### Build for production

```bash
npm run build
```

The production-ready files are output to `dist/`.

### Preview the production build locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
wishora/
├── public/
│   └── favicon.svg              # Emoji favicon
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable primitive components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   └── Select.jsx
│   │   ├── layout/
│   │   │   └── PageWrapper.jsx
│   │   ├── LandingPage.jsx      # Hero / home page
│   │   ├── CreatorForm.jsx      # Birthday creation form
│   │   ├── PreviewModal.jsx     # Live preview before generating
│   │   ├── BirthdayPage.jsx     # The animated birthday surprise
│   │   ├── FloatingHearts.jsx   # Floating emoji overlay
│   │   ├── ThemeCard.jsx        # Theme selection card
│   │   └── ShareModal.jsx       # Share link + QR code
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Persist state to localStorage
│   │   └── useConfetti.js       # canvas-confetti wrapper
│   ├── context/
│   │   └── BirthdayContext.jsx  # Global form state + photo storage
│   ├── utils/
│   │   ├── themes.js            # Theme & music definitions
│   │   ├── encode.js            # URL encode/decode birthday data
│   │   └── validation.js        # Form validation helpers
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Create.jsx
│   │   └── Surprise.jsx         # Resolves data from URL or localStorage
│   ├── App.jsx                  # Router + Provider setup
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

---

## 🔗 How Sharing Works

Wishora uses a **zero-backend sharing approach**:

1. When you click *Create Birthday Surprise*, all form data (name, message, theme, music, photo ID) is **JSON-encoded as a base64 string** and appended to the URL as `?d=<base64>`.
2. The uploaded photo is saved to **`localStorage`** with a unique ID.
3. Anyone who opens the link gets the full birthday experience — the name, message, and theme come from the URL itself.

### ⚠️ Photo limitation

Because `localStorage` is **device-local**, the uploaded photo will only appear for the recipient if they open the link on the **same device and browser** where the surprise was created. On other devices, a themed emoji placeholder is shown instead.

**Workaround:** For cross-device photo sharing, consider self-hosting with a small backend (Express + multer, or a serverless function on Vercel/Netlify).

---

## 🎨 Themes

| Theme | Gradient | Emoji |
|---|---|---|
| 🌹 Romantic Rose | Pink → Red | 🌹❤️✨💕🌸💖 |
| 🌟 Galaxy Dreams | Indigo → Violet | ✨🌟💫⭐🔮🌌 |
| 🌺 Tropical Sunset | Orange → Rose | 🌺🌴🎊🌅🍹🦜 |
| 🎂 Golden Classic | Yellow → Amber | 🎂🎁🥂🎈⭐🏆 |
| 🌙 Midnight Magic | Slate → Indigo | 🌙⭐🎇💎🌟✨ |
| 🎀 Pastel Candy | Purple → Rose | 🍭🎀🦋🌈💝🍬 |

---

## 🚀 Deployment

### Vercel (Recommended — zero config)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

Vercel auto-detects Vite and configures everything. ✅

### GitHub Pages

1. Add `VITE_BASE_PATH` to `vite.config.js` (already configured):

```bash
# Build with your repo name as the base path
VITE_BASE_PATH=/wishora/ npm run build
```

2. Install `gh-pages`:

```bash
npm install -D gh-pages
```

3. Add to `package.json` scripts:

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:

```bash
VITE_BASE_PATH=/wishora/ npm run build && npm run deploy
```

> **Note:** GitHub Pages serves SPAs incorrectly for deep links. Add a `404.html` redirect or use a [SPA redirect script](https://github.com/rafgraph/spa-github-pages).

### Netlify

Drag and drop the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop) — done in 30 seconds.

---

## 🎵 Music Credits

Background tracks are royalty-free previews from [Mixkit](https://mixkit.co/free-music/) by Envato. For a production deployment, download the full tracks from Mixkit and host them in `public/music/` to avoid external URL dependencies.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-theme`)
3. Commit your changes (`git commit -m 'feat: add amazing-theme'`)
4. Push to the branch (`git push origin feat/amazing-theme`)
5. Open a Pull Request

### Ideas for contributions

- [ ] Add more themes (ocean breeze, winter wonderland, etc.)
- [ ] Backend + persistent photo sharing (Express + Cloudinary)
- [ ] Image cropping before upload
- [ ] Custom music upload
- [ ] Birthday countdown timer
- [ ] Animated sticker packs

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by the Wishora team · Star ⭐ the repo if you find it useful!

</div>
