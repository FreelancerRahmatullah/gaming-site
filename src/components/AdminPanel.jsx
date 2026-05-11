import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

const AdminPanel = ({ onLogout }) => {
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [users, setUsers] = useState([]);
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    onSnapshot(collection(db, "deposit_requests"), (sn) => setDeposits(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(collection(db, "withdraw_requests"), (sn) => setWithdraws(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(collection(db, "users"), (sn) => setUsers(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  // ব্যালেন্স এডিট লজিক
  const handleUpdateBalance = async (userId, currentBal, type) => {
    if (!editAmount || isNaN(editAmount)) return alert("Enter valid amount");
    const newAmt = type === 'add' ? (currentBal || 0) + Number(editAmount) : (currentBal || 0) - Number(editAmount);
    try {
      await updateDoc(doc(db, "users", userId), { balance: newAmt });
      setEditAmount("");
      alert("Balance Updated!");
    } catch (e) { alert(e.message); }
  };

  // ডিপোজিট অ্যাপ্রুভ
  const approveDeposit = async (req) => {
    const userRef = doc(db, "users", req.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, { balance: (userSnap.data().balance || 0) + req.amount });
      await deleteDoc(doc(db, "deposit_requests", req.id));
      alert("Deposit Approved!");
    }
  };

  // ডিপোজিট রিজেক্ট (ভুল TrxID এর জন্য)
  const rejectDeposit = async (id) => {
    if(window.confirm("Reject this deposit?")) {
      await deleteDoc(doc(db, "deposit_requests", id));
      alert("Deposit Rejected!");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 pb-20 font-sans">
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
        <h1 className="text-xl font-black text-red-500 italic tracking-tighter">CV-ADMIN CONTROL</h1>
        <button onClick={onLogout} className="bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-bold uppercase border border-red-500/30">Logout</button>
      </div>

      {/* ১. পেন্ডিং ডিপোজিট (নতুন রিজেক্ট বাটনসহ) */}
      <section className="mb-12">
        <h3 className="text-xs font-bold text-green-500 mb-4 uppercase tracking-[3px]">Pending Deposits ({deposits.length})</h3>
        <div className="grid gap-4">
          {deposits.map(req => (
            <div key={req.id} className="bg-[#161926] p-5 rounded-3xl border border-white/5 flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{req.method} | {req.trxId}</p>
                <p className="text-lg font-black text-green-500">+ ৳{req.amount}</p>
                <p className="text-[10px] text-gray-400 italic">{req.email}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveDeposit(req)} className="bg-green-600 px-4 py-2 rounded-xl text-[10px] font-bold">APPROVE</button>
                <button onClick={() => rejectDeposit(req.id)} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-xl text-[10px] font-bold border border-red-500/30">REJECT</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ২. পেন্ডিং উইথড্র */}
      <section className="mb-12">
        <h3 className="text-xs font-bold text-red-500 mb-4 uppercase tracking-[3px]">Withdraw Requests ({withdraws.length})</h3>
        <div className="grid gap-4">
          {withdraws.map(req => (
            <div key={req.id} className="bg-[#161926] p-5 rounded-3xl border border-white/5 flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] text-gray-500 font-bold">TO: {req.phone}</p>
                <p className="text-lg font-black text-red-500">- ৳{req.amount}</p>
                <p className="text-[10px] text-gray-400 italic">{req.email}</p>
              </div>
              <button onClick={async () => {await deleteDoc(doc(db, "withdraw_requests", req.id)); alert("Paid!");}} className="bg-blue-600 px-6 py-2 rounded-xl text-[10px] font-bold">MARK AS PAID</button>
            </div>
          ))}
        </div>
      </section>

      {/* ৩. ইউজার ম্যানেজমেন্ট (টেবিল স্টাইল) */}
      <section>
        <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[3px]">Registered Players ({users.length})</h3>
        <div className="bg-[#161926] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">Player</th>
                <th className="p-4 text-center">Balance</th>
                <th className="p-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="p-4 truncate max-w-[100px]">{u.email}</td>
                  <td className="p-4 text-center font-black text-yellow-500">৳{u.balance?.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <input 
                        type="number" placeholder="Amt" 
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-12 bg-black/40 border border-white/10 rounded-lg px-1 py-1 text-[10px] outline-none"
                      />
                      <button onClick={() => handleUpdateBalance(u.id, u.balance, 'add')} className="bg-green-600 w-6 h-6 rounded flex items-center justify-center font-bold">+</button>
                      <button onClick={() => handleUpdateBalance(u.id, u.balance, 'sub')} className="bg-red-600 w-6 h-6 rounded flex items-center justify-center font-bold">-</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
