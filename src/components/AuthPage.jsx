import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthPage = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAction = async (type) => {
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), { email, balance: 50 });
      }
      onAuth(); // সফল হলে ড্যাশবোর্ডে পাঠাবে
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-black mb-8 italic text-yellow-500 uppercase tracking-tighter">CV666 ACCESS</h2>
        <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} className="w-full bg-[#18181b] p-5 rounded-2xl mb-4 outline-none border border-white/5 text-white" />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} className="w-full bg-[#18181b] p-5 rounded-2xl mb-8 outline-none border border-white/5 text-white" />
        <div className="flex gap-4">
          <button onClick={()=>handleAction('login')} className="flex-1 bg-yellow-500 text-black font-black py-4 rounded-2xl active:scale-95 transition-all">LOGIN</button>
          <button onClick={()=>handleAction('signup')} className="flex-1 bg-white/10 font-bold py-4 rounded-2xl border border-white/10 active:scale-95 transition-all">JOIN</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
