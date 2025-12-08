import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminUsers from "./AdminUsers";
import AdminTransactions from "./AdminTransactions";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [view, setView] = useState("transactions"); // or "users"
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

        <nav className="mb-4 space-x-2">
          <button onClick={() => setView("transactions")} className={`px-4 py-2 rounded ${view==="transactions" ? "bg-purple-600 text-white" : "border"}`}>Transactions</button>
          <button onClick={() => setView("users")} className={`px-4 py-2 rounded ${view==="users" ? "bg-purple-600 text-white" : "border"}`}>Users</button>
        </nav>

        <main>
          {view === "transactions" ? <AdminTransactions /> : <AdminUsers />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
