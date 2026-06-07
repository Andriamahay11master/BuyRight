import React from "react";
import Navbar from "../navbar/Navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <div className="app">
      <Navbar data-testid="navbar" />
      <main className="main-content" data-testid="children">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
