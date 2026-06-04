#!/bin/bash
# Verification script - Check if extension is properly structured

echo "🔍 Vérification de la structure de l'extension kMotion"
echo "====================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MISSING=0
TOTAL=0

check_file() {
  TOTAL=$((TOTAL + 1))
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${RED}❌${NC} $1"
    MISSING=$((MISSING + 1))
  fi
}

check_dir() {
  TOTAL=$((TOTAL + 1))
  if [ -d "$1" ]; then
    echo -e "${GREEN}✅${NC} $1/"
  else
    echo -e "${RED}❌${NC} $1/"
    MISSING=$((MISSING + 1))
  fi
}

echo "📁 Checking directories..."
check_dir "src"
check_dir "src/components"
check_dir "src/utils"

echo ""
echo "📄 Checking configuration files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "vite.config.ts"
check_file "manifest.json"
check_file "tailwind.config.js"
check_file "postcss.config.js"

echo ""
echo "🧩 Checking React components..."
check_file "src/components/LoginForm.tsx"
check_file "src/components/VideoDetails.tsx"
check_file "src/components/NoVideo.tsx"
check_file "src/components/PopupApp.tsx"

echo ""
echo "🛠️  Checking utilities..."
check_file "src/utils/api.ts"
check_file "src/utils/constants.ts"
check_file "src/utils/youtube.ts"

echo ""
echo "🔧 Checking core files..."
check_file "src/stores.ts"
check_file "src/types.d.ts"
check_file "src/popup.tsx"
check_file "src/popup.html"
check_file "src/index.css"

echo ""
echo "🔌 Checking extension scripts..."
check_file "src/background.ts"
check_file "src/content.ts"

echo ""
echo "📚 Checking documentation..."
check_file "README.md"
check_file "ARCHITECTURE.md"
check_file "DEV_NOTES.md"
check_file "PROJECT_SUMMARY.md"
check_file "TEST_CHECKLIST.md"
check_file "FILES_CHECKLIST.md"

echo ""
echo "⚙️  Checking config files..."
check_file ".env.example"
check_file ".gitignore"

echo ""
echo "====================================================="
echo "📊 Résultats: $(($TOTAL - $MISSING))/$TOTAL fichiers trouvés"

if [ $MISSING -eq 0 ]; then
  echo -e "${GREEN}✅ Tous les fichiers sont présents!${NC}"
  echo ""
  echo "🚀 Prochaines étapes:"
  echo "   1. cd apps/extension"
  echo "   2. pnpm install"
  echo "   3. pnpm build"
  echo "   4. Charger dist/ dans Chrome/Firefox"
  exit 0
else
  echo -e "${RED}❌ $MISSING fichiers manquent!${NC}"
  exit 1
fi

