import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async (e) => {
    e.preventDefault();
    console.log("Attempting admin login with:", { username, password });

    try {
      console.log("Making request to:", axios.defaults.baseURL + "/api/admin/login");
      const { data } = await axios.post("/api/admin/login", {
        username,
        password,
      });
      console.log("Admin login response:", data);

      if (data.success) {
        console.log("Admin login success, token:", data.token ? data.token.substring(0, 20) + "..." : "undefined");
        localStorage.setItem("adminToken", data.token);
        console.log("Admin token saved to localStorage, checking:", localStorage.getItem("adminToken") ? "saved" : "failed");
        toast.success("Admin Login Successful");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Admin login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 to-black flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Admin Login
        </h2>

        <form onSubmit={loginAdmin} className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg text-lg font-semibold shadow-lg
                       transition-all duration-300"
          >
            Login
          </button>
        </form>

      </div>

    </div>
  );
};

export default AdminLogin;
