import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthenticatedLayout from "./components/connected/AuthenticatedLayout";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import PublicRoute from "./components/public/PublicRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateListPage from "./pages/CreateListPage";
import ListDetailPage from "./pages/ListDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SplashScreen from "./components/splashscreen/SplashScreen";
import "./styles/main.scss";
import WelcomePage from "./pages/WelcomePage";
import EditListPage from "./pages/EditListPage";
import OnboardingPage from "./pages/OnboardingPage";
import ListItemPage from "./pages/ListItemPage";
import AddItemPage from "./pages/AddItemPage";
import ChoiceItemPage from "./pages/ChoiceItemsPage";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      <AuthProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <Routes>
            {/* Public routes - only accessible when not authenticated */}
            <Route
              path="/welcome"
              element={
                <PublicRoute>
                  <WelcomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <PublicRoute>
                  <OnboardingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              }
            />

            {/* Protected routes - only accessible when authenticated */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <HomePage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CreateListPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/selectItem"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ChoiceItemPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/list/:listId"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ListDetailPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:listId"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <EditListPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ProfilePage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ListItemPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-item"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <AddItemPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AuthProvider>
    </Router>
  );
};

export default App;
