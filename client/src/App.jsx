import React, { useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/Community';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Loading from './pages/Loading';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

import { assets } from './assets/assets';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const adminToken = localStorage.getItem("adminToken");

  // 1️⃣ LOADING SCREEN
  if (loadingUser) return <Loading />;

  // 2️⃣ ADMIN ROUTES → always rendered separately
  if (pathname.startsWith("/admin")) {
    return (
      <>
        <Toaster />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={adminToken ? <AdminDashboard /> : <Navigate to="/admin" />}
          />
        </Routes>
      </>
    );
  }

  // 3️⃣ NORMAL USER ROUTES
  return (
    <>
      <Toaster />

      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (
        <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
