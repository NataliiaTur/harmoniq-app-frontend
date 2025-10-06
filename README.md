Harmoniq - Content Sharing Platform

# Analytics System (Individual Feature)
Custom analytics implementation developed independently after team project completion (alternative to Google Analytics):

User session tracking with browser fingerprinting
Automatic event tracking (page views, scrolling, time on page)
Manual event tracking for specific actions (favorites, subscriptions, article views)
UTM parameter support for campaign tracking
Privacy-focused approach with anonymous data collection
Visual dashboard with charts and metrics


A modern web application for creating, sharing, and discovering articles on any topic. Built with React, Redux, and Vite.
Team project with individual post-development enhancement.
Features
For All Users

Browse articles on diverse topics from various authors
Search and discover content creators
Responsive design for mobile and desktop
Real-time article preview with syntax highlighting
Save articles to favorites
Subscribe to favorite authors

For Content Creators

Create and publish articles on any topic
Rich text editor for content creation
Upload and manage article images via Cloudinary
Track content performance with built-in analytics dashboard:

Visitor statistics and page views
Traffic sources (direct, social media, UTM campaigns)
Device breakdown (mobile, desktop, tablet)
Article engagement metrics (views, favorites)
Conversion rates and session duration
New subscribers tracking


Manage subscriber base
Personal profile with published articles, saved content, and followers

Tech Stack
Core:

React 18
Redux Toolkit for state management
React Router for navigation
Vite for fast development and building

Styling:

CSS Modules
clsx for conditional classes

Data Visualization:

Recharts for analytics charts
React Flow for user journey visualization

Form Handling:

Formik with Yup validation

Additional Libraries:

Axios for API requests
React Toastify for notifications
DOMPurify for sanitizing HTML
FingerprintJS for analytics
Redux Persist for local state persistence

Getting Started
Prerequisites

Node.js (v18+)
npm or yarn

Installation
bash# Clone repository
git clone https://github.com/NataliiaTur/harmoniq-app-frontend.git

# Navigate to directory
cd harmoniq-app-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
Environment Variables
envVITE_API_URL=your_backend_url
Development
bashnpm run dev
Opens at http://localhost:5173
Build
bashnpm run build
Production files will be in the dist/ folder.
Project Structure
src/
├── components/        # Reusable UI components
├── pages/            # Page components
│   └── AnalyticsPage/  # Analytics dashboard (individual feature)
├── redux/            # Redux store, slices, and operations
│   ├── articlesSlice/
│   ├── authSlice/
│   ├── usersSlice/
│   └── store.js
├── utils/            # Helper functions and utilities
│   ├── analytics.js  # Custom analytics implementation (individual feature)
│   └── tokenService.js
├── assets/           # Images, icons, animations
└── App.jsx           # Main app component
Key Features Implementation
Authentication
JWT-based authentication with refresh token rotation. Supports multiple active sessions per user.
Analytics System (Individual Implementation)
Custom-built analytics system developed independently after the main project:

Creates anonymous user sessions with fingerprinting
Tracks events: page views, article views, favorites, follows
Stores UTM parameters for campaign attribution
Calculates metrics: conversion rates, engagement, traffic sources
Dashboard with visual charts and tables
Backend integration with MongoDB for data persistence

State Management
Redux Toolkit with persistence for:

User authentication state
Articles data and filters
Saved articles and subscriptions
Loading and error states

Development History
The core platform was developed as a team project to create a universal content-sharing platform where anyone can publish and read articles. Following project completion, an analytics system was independently designed and implemented to provide authors with insights into their audience and content performance.
Backend Repository
harmoniq-app-backend
Deployment
Deployed on Vercel: Live Demo
License
MIT
Author
Nataliia Tur
Team project with independent analytics feature development
