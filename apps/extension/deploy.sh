#!/bin/bash

# Build script for the extension
echo "Building extension..."
pnpm build

if [ $? -eq 0 ]; then
  echo "✓ Build completed successfully"
  echo ""
  echo "Extension built at: $(pwd)/dist"
  echo ""
  echo "Next steps:"
  echo "  - Chrome: Go to chrome://extensions/, enable 'Developer mode', and load the dist/ folder"
  echo "  - Firefox: Go to about:debugging#/runtime/this-firefox and load the dist/manifest.json"
else
  echo "✗ Build failed"
  exit 1
fi

