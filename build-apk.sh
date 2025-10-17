#!/bin/bash

# Kebele Finance System - Flutter APK Build Script
# This script builds the Flutter app as a release APK

echo "=========================================="
echo "Kebele Finance - Flutter APK Builder"
echo "=========================================="
echo ""

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "Error: Flutter is not installed."
    echo "Please install Flutter from: https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Check if we're in the Flutter project root
if [ ! -f "pubspec.yaml" ]; then
    echo "Error: pubspec.yaml not found."
    echo "Please run this script from the Flutter project root directory."
    exit 1
fi

echo "Step 1: Cleaning previous builds..."
flutter clean
echo "✓ Clean complete"

echo ""
echo "Step 2: Getting dependencies..."
flutter pub get
echo "✓ Dependencies updated"

echo ""
echo "Step 3: Building release APK..."
echo "This may take 5-10 minutes..."
flutter build apk --release

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Build Successful!"
    echo "=========================================="
    echo ""
    echo "Your APK is ready at:"
    echo "build/app/outputs/flutter-app/release/app-release.apk"
    echo ""
    echo "Next steps:"
    echo "1. Copy the APK to a cloud storage (Google Drive, Dropbox, etc.)"
    echo "2. Share the link with your team"
    echo "3. They can download and install on their Android phones"
    echo ""
    echo "To install on a phone:"
    echo "1. Download the APK"
    echo "2. Go to Settings > Security > Unknown Sources (enable)"
    echo "3. Open the APK file and tap 'Install'"
    echo ""
else
    echo ""
    echo "Build failed. Please check the error messages above."
    exit 1
fi
