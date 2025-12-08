import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const load = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get("/api/admin/transactions", { headers: { Authorization: token }});
      if (data.success) setTransactions(data.transactions);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(()=>{ load() }, []);

  const verify = async (orderId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.post("/api/admin/verify-payment", { orderId }, { headers: { Authorization: token }});
      if (data.success) {
        toast.success(data.message);
        load();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Transactions ({transactions.length})</h2>
      <div className="space-y-2">
        {transactions.map(t => (
          <div key={t._id} className="p-3 border rounded bg-white flex items-center justify-between">
            <div>
              <div className="font-medium">Order: {t.orderId} — {t.planId}</div>
              <div className="text-sm text-gray-600">User: {t.userId.toString()}</div>
              <div className="text-sm text-gray-600">Amount: ₹{t.amount} | Credits: {t.credits}</div>
              <div className="text-xs text-gray-500">Status: {t.status} | Paid: {String(t.isPaid)}</div>
            </div>
            <div className="flex flex-col gap-2">
              {!t.isPaid && <button onClick={()=> verify(t.orderId)} className="px-3 py-1 bg-green-600 text-white rounded">Verify</button>}
              <div className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTransactions;
