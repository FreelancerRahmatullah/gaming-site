import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const ADMIN_EMAIL = "rahmat4060159@gmail.com"; // এখানে আপনার অ্যাডমিন ইমেইলটি নিশ্চিত করুন

const AdminLoginPage = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    // ১. প্রথমেই চেক করা হবে ইমেইলটি অ্যাডমিন ইমেইল কি না
    if (email !== ADMIN_EMAIL) {
      alert("সতর্কতা: আপনি অ্যাডমিন নন! এখান থেকে লগইন করার অনুমতি নেই।");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("অ্যাডমিন লগইন সফল!");
      onAuth(); 
    } catch (e) {
      alert("ভুল পাসওয়ার্ড বা ইমেইল: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-red-950/10 p-10 rounded-[3rem] border border-red-500/20 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.1)]">
        <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
           <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-2xl font-black mb-2 italic text-red-500 uppercase tracking-tighter">Admin Secure Access</h2>
        <p className="text-gray-500 text-[10px] uppercase font-bold mb-8">Authorized Personnel Only</p>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input 
            type="email" placeholder="Admin Email" 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-500 transition-all"
            required
          />
          <input 
            type="password" placeholder="Secret Key" 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-500 transition-all"
            required
          />
          <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-red-600/20">
            UNSEAL DASHBOARD
          </button>
        </form>
        
        <button onClick={() => window.location.href = "/"} className="mt-6 text-gray-600 text-xs hover:text-white transition-all underline">Back to Main Site</button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
