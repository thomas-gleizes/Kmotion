#!/bin/bash
# GETTING STARTED - Quick Reference Guide

cat << "EOF"

╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║          🚀 KMOTION EXTENSION - GETTING STARTED GUIDE 🚀         ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

📦 STEP 1: INSTALLATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  From workspace root:
  $ cd /home/thomas.gleizes@acelys.local/workspace/local-test
  $ pnpm install

  Or directly in extension:
  $ cd apps/extension
  $ pnpm install


🔨 STEP 2: BUILD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Development (watch mode):
  $ cd apps/extension
  $ pnpm dev

  Production build:
  $ cd apps/extension
  $ pnpm build

  Output folder: dist/


🌐 STEP 3: LOAD IN BROWSER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CHROME:
  ├─ Go to: chrome://extensions/
  ├─ Enable "Developer mode" (top right)
  ├─ Click "Load unpacked"
  └─ Select: apps/extension/dist/

  FIREFOX:
  ├─ Go to: about:debugging#/runtime/this-firefox
  ├─ Click "Load Temporary Add-on"
  └─ Select: apps/extension/dist/manifest.json


🔧 STEP 4: CONFIGURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Edit: src/utils/api.ts
  └─ Change prefixUrl if API is not on localhost:8000

  Or use environment variables:
  ├─ Copy: .env.example → .env
  └─ Edit: .env with your settings


📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Start here:
  └─ README.md ........................ Overview & intro

  Deep dive:
  ├─ ARCHITECTURE.md ................. Technical details
  ├─ DEV_NOTES.md .................... Development tips
  ├─ PROJECT_SUMMARY.md .............. Complete summary
  └─ QUICKSTART.sh ................... Auto-setup script

  Testing & verification:
  ├─ TEST_CHECKLIST.md ............... Manual tests
  └─ verify.sh ....................... Structure verification


🧪 TESTING YOUR EXTENSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Login Screen
     └─ Try login with test credentials
        Expected: Token saved, redirects to main view

  2. YouTube Detection
     └─ Go to: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        Expected: Popup shows video details

  3. Video Details
     └─ Click "Add Video" or "Convert to MP3"
        Expected: Loader shows, data updates after conversion

  4. Error Handling
     └─ Try invalid credentials, network errors
        Expected: Error messages shown

  See TEST_CHECKLIST.md for complete guide


⚠️  IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • API must be running on localhost:8000 (or configured)
  • After each pnpm build, reload extension in browser
  • Check browser DevTools (F12) for errors
  • Extension APIs endpoints must match your backend


🎯 KEY FILES TO MODIFY FOR YOUR API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  src/utils/api.ts
  ├─ prefixUrl: "http://localhost:8000/api/v1"
  └─ Methods must match your endpoints

  manifest.json
  ├─ name, version, description
  └─ permissions, host_permissions


🚀 QUICK COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Setup:
  $ cd /home/thomas.gleizes@acelys.local/workspace/local-test
  $ pnpm install
  $ cd apps/extension
  $ pnpm build

  Development:
  $ pnpm dev        # Watch mode
  $ pnpm build      # Build
  $ bash verify.sh  # Check structure

  Deployment:
  $ pnpm deploy     # Build & package


✨ PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  apps/extension/
  ├── src/
  │   ├── components/      ← React components
  │   ├── utils/           ← API client, helpers
  │   ├── stores.ts        ← Global state (Zustand)
  │   ├── popup.tsx        ← Entry point
  │   ├── background.ts    ← Service worker
  │   └── content.ts       ← Content script
  ├── manifest.json        ← Extension config
  ├── vite.config.ts       ← Build config
  ├── tailwind.config.js   ← Styling
  ├── package.json         ← Dependencies
  └── dist/                ← Build output


📊 TECHNOLOGIES INCLUDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ React 19              - UI framework
  ✅ TypeScript            - Type safety
  ✅ Tailwind CSS          - Responsive styling
  ✅ Zustand              - State management
  ✅ React Hook Form      - Form handling
  ✅ Ky                   - HTTP client
  ✅ React Icons          - UI icons
  ✅ Vite                 - Modern bundler
  ✅ Chrome APIs          - Extension APIs


🎯 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ JWT Authentication      - Secure login
  ✅ YouTube Detection       - Auto-detect videos
  ✅ Video Info Display      - Title, artist
  ✅ MP3 Conversion         - Convert with API
  ✅ Loading States         - Spinners, feedback
  ✅ Error Handling         - User-friendly messages
  ✅ Responsive UI          - Works on any screen
  ✅ Chrome & Firefox       - Cross-browser


💡 TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Debugging:
  • Right-click extension → Inspect popup
  • Chrome DevTools for debugging
  • Check Network tab for API calls

  Development:
  • Keep terminal open with pnpm build running
  • Reload extension after each build
  • Use test YouTube video IDs

  Performance:
  • Extension popup: 400x600px
  • Don't load heavy images
  • Cache API responses


🎉 YOU'RE ALL SET!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Next steps:
  1. ✅ Follow STEP 1-4 above
  2. ✅ Configure your API endpoints
  3. ✅ Test with TEST_CHECKLIST.md
  4. ✅ Deploy when ready

  Need help?
  • Check README.md for overview
  • See DEV_NOTES.md for troubleshooting
  • Review ARCHITECTURE.md for deep dive


═══════════════════════════════════════════════════════════════════

              Happy coding! 🚀

═══════════════════════════════════════════════════════════════════

EOF

