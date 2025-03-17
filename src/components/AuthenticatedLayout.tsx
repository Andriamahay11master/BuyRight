import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout; 