#!/bin/bash
# Find Chrome Profile Helper Script
# This script helps you locate your Chrome user data directory

echo "🔍 Finding Chrome Profile Locations..."
echo ""

# Detect OS
OS="$(uname -s)"

case "$OS" in
    Darwin)
        echo "📍 macOS Detected"
        CHROME_DIR="$HOME/Library/Application Support/Google/Chrome"
        ;;
    Linux)
        echo "📍 Linux Detected"
        CHROME_DIR="$HOME/.config/google-chrome"
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo "📍 Windows Detected"
        CHROME_DIR="$LOCALAPPDATA/Google/Chrome/User Data"
        ;;
    *)
        echo "❌ Unknown OS: $OS"
        exit 1
        ;;
esac

echo "Chrome Directory: $CHROME_DIR"
echo ""

if [ ! -d "$CHROME_DIR" ]; then
    echo "❌ Chrome directory not found at: $CHROME_DIR"
    echo ""
    echo "Please make sure Google Chrome is installed."
    exit 1
fi

echo "✅ Chrome directory found!"
echo ""
echo "📂 Available Profiles:"
echo ""

# List profiles
if [ -d "$CHROME_DIR/Default" ]; then
    echo "  • Default Profile:"
    echo "    Path: $CHROME_DIR/Default"
    echo ""
fi

# Check for additional profiles
for profile in "$CHROME_DIR"/Profile*; do
    if [ -d "$profile" ]; then
        profile_name=$(basename "$profile")
        echo "  • $profile_name:"
        echo "    Path: $profile"
        echo ""
    fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 To use your Chrome profile with browser-use tool:"
echo ""
echo "For Default Profile:"
echo "  chromeProfile: \"$CHROME_DIR/Default\""
echo ""
echo "Example usage in OpenCode:"
echo "  Use the execute tool with:"
echo "  - task: \"Go to Facebook and check my notifications\""
echo "  - chromeProfile: \"$CHROME_DIR/Default\""
echo "  - headless: false"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  Important Notes:"
echo "  1. Close Chrome before using the profile with browser-use"
echo "  2. Set headless=false to see the browser window"
echo "  3. The browser will use your saved cookies and credentials"
echo "  4. You'll be logged into sites where you're already logged in"
echo ""
