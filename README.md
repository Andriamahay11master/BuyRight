# BuyRight - Shopping List App

A modern, feature-rich web application for creating and managing shopping lists with real-time cloud synchronization. Built with React, TypeScript, and Firebase.

## ✨ Features

- **Multiple Lists Management** - Create and organize multiple shopping lists
- **Item Management** - Add, edit, and delete items within lists
- **Progress Tracking** - Mark items as completed to track shopping progress
- **Drag & Drop Reordering** - Easily reorganize items in your lists
- **Real-time Synchronization** - Cloud-based storage with instant updates across devices
- **User Authentication** - Secure login and registration with Firebase
- **Responsive Design** - Seamless experience on mobile, tablet, and desktop
- **Intuitive UI** - Clean, user-friendly interface with onboarding guide

## 🛠 Tech Stack

- **Frontend Framework** - React 18 with TypeScript
- **Build Tool** - Vite
- **Backend & Database** - Firebase (Authentication & Firestore)
- **Styling** - SCSS with component-based architecture
- **Routing** - React Router
- **Icons** - IcoMoon custom font icons

## 📦 Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page-level components
├── contexts/        # Context API for state management
├── models/          # TypeScript data models
├── styles/          # SCSS stylesheets
├── utils/           # Utility functions
└── data/            # Static data (categories, units)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Andriamahay11master/BuyRight.git
   cd BuyRight
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase** (if not already configured)
   - Set up your Firebase project credentials in `src/firebase.ts`

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173` in your web browser

## 📱 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Test unit (add -- path="" for specific file)

## 🔐 Authentication

The app supports secure user authentication with:

- Email/Password registration and login
- Password reset functionality
- Protected routes for authenticated users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
