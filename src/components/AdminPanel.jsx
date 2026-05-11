import React from 'react';
import { db } from '../firebase';
import { doc, deleteDoc } from "firebase/firestore";

const AdminPanel = ({ requests, onLogout }) => {
  const approveWithdraw = async (id) => {
    await deleteDoc(doc(db, "withdraw_requests", id));
    alert("পেমেন্ট সম্পন্ন হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-red-500 uppercase italic">Admin Mode</h1>
        <button onClick={onLogout} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold">Logout</button>
      </div>
      <div className="grid gap-6">
        <h3 className="text-lg font-bold text-gray-400">Withdraw Requests ({requests.length})</h3>
        {requests.map(req => (
          <div key={req.id} className="bg-[#161926] p-6 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">{req.email}</p>
              <p className="text-xl font-black text-yellow-500">৳ {req.amount}</p>
              <p className="text-sm font-bold text-green-500">No: {req.phone}</p>
            </div>
            <button onClick={() => approveWithdraw(req.id)} className="bg-green-600 px-6 py-3 rounded-2xl font-bold">PAID</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminPanel;
