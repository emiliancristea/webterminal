#!/bin/bash

# Development setup script for Web Terminal
# This script sets up the development environment and installs dependencies

set -e

echo "🚀 Setting up Web Terminal development environment..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION is supported"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run check

# Build the project to verify everything works
echo "🔨 Building project..."
npm run build

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  • Run 'npm run dev' to start the development server"
echo "  • Open http://localhost:5173 in your browser"
echo "  • Check out the docs/ folder for more information"
echo ""
echo "Happy coding! 🎉"