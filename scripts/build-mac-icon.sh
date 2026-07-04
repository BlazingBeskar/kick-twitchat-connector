#!/bin/bash

# Script to convert .ico to .icns for macOS builds
# Usage: ./scripts/convert-icon.sh

set -e

echo "🔄 Converting icon.ico to icon.icns..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script requires macOS (uses sips and iconutil)"
    exit 1
fi

# Check if icon.ico exists
if [ ! -f "assets/icon.ico" ]; then
    echo "❌ assets/icon.ico not found"
    exit 1
fi

# Create temporary directory
TEMP_DIR="temp_iconset"
ICONSET_DIR="icon.iconset"

echo "📦 Creating temporary PNG..."
sips -s format png assets/icon.ico --out "${TEMP_DIR}.png" > /dev/null 2>&1

echo "🎨 Generating iconset with multiple sizes..."
mkdir -p "$ICONSET_DIR"

# Generate all required icon sizes
sips -z 16 16     "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_16x16.png" > /dev/null 2>&1
sips -z 32 32     "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_16x16@2x.png" > /dev/null 2>&1
sips -z 32 32     "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_32x32.png" > /dev/null 2>&1
sips -z 64 64     "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_32x32@2x.png" > /dev/null 2>&1
sips -z 128 128   "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_128x128.png" > /dev/null 2>&1
sips -z 256 256   "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_128x128@2x.png" > /dev/null 2>&1
sips -z 256 256   "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_256x256.png" > /dev/null 2>&1
sips -z 512 512   "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_256x256@2x.png" > /dev/null 2>&1
sips -z 512 512   "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_512x512.png" > /dev/null 2>&1
sips -z 1024 1024 "${TEMP_DIR}.png" --out "${ICONSET_DIR}/icon_512x512@2x.png" > /dev/null 2>&1

echo "✨ Converting to .icns format..."
iconutil -c icns "$ICONSET_DIR" -o assets/icon.icns

echo "🧹 Cleaning up temporary files..."
rm -rf "$ICONSET_DIR" "${TEMP_DIR}.png"

echo "✅ Successfully created assets/icon.icns"
ls -lh assets/icon.icns

