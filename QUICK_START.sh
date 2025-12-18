#!/bin/bash

echo "🚀 NexoraSIM Quick Start"
echo "========================"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your credentials"
fi

# Start development server
echo "🎯 Starting development server..."
npm start