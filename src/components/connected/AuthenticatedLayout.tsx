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
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
