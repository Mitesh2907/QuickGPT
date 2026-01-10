import React, { useEffect } from "react";
import AdminUsers from "./AdminUsers";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div>
            <button onClick={() => { localStorage.removeItem("adminToken"); navigate("/admin"); }} className="mr-2 p-2 border rounded">Logout</button>
          </div>
        </header>

        <nav className="mb-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded">Users</button>
        </nav>

        <main>
          <AdminUsers />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
