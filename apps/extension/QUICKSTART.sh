#!/bin/bash
# Quick Start Guide for kMotion Extension Development

set -e

echo "🚀 kMotion Extension - Quick Start"
echo "=================================="
echo ""

# Check if running from workspace root
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the workspace root"
  exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "📖 Next steps:"
echo ""
echo "1️⃣  Development:"
echo "   cd apps/extension"
echo "   pnpm dev"
echo ""
echo "2️⃣  Build for production:"
echo "   cd apps/extension"
echo "   pnpm build"
echo ""
echo "3️⃣  Load in Chrome:"
echo "   - Go to chrome://extensions/"
echo "   - Enable 'Developer mode'"
echo "   - Click 'Load unpacked'"
echo "   - Select the 'dist' folder in apps/extension/"
echo ""
echo "4️⃣  Load in Firefox:"
echo "   - Go to about:debugging#/runtime/this-firefox"
echo "   - Click 'Load Temporary Add-on'"
echo "   - Select manifest.json from apps/extension/dist/"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Overview"
echo "   - ARCHITECTURE.md - Detailed structure"
echo "   - DEV_NOTES.md - Development notes"
echo "   - TEST_CHECKLIST.md - Testing guide"
echo ""
echo "💡 Tips:"
echo "   - Make sure the API is running on localhost:8000"
echo "   - Use valid credentials for testing"
echo "   - Check browser console for debugging"
echo "   - Reload the extension after each build during development"
echo ""
echo "🎯 What's included:"
echo "   ✅ React + TypeScript"
echo "   ✅ Tailwind CSS for styling"
echo "   ✅ Zustand for state management"
echo "   ✅ Chrome/Firefox compatibility"
echo "   ✅ Authentication with JWT"
echo "   ✅ YouTube video detection"
echo "   ✅ MP3 conversion integration"
echo ""

