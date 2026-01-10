import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setUsers(data.users);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      load();
    } else {
      console.log("AdminUsers - no token, skipping load");
    }
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">All Users ({users.length})</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="p-3 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div className="text-sm text-gray-500">Joined: {new Date(u.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
