import React, { useState } from 'react';

const WithdrawModal = ({ balance, onClose, onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (Number(amount) > balance || Number(amount) < 500) return alert("সঠিক অ্যামাউন্ট দিন (Min 500)");
    if (phone.length < 11) return alert("সঠিক নম্বর দিন");
    onSubmit(phone, amount);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0d0d0f] w-full max-w-md rounded-t-[3rem] p-10 border-t border-white/10 animate-in slide-in-from-bottom duration-500">
        <h3 className="text-2xl font-black mb-8 italic text-yellow-500">WITHDRAW</h3>
        <input type="number" placeholder="Phone Number" onChange={(e)=>setPhone(e.target.value)} className="w-full bg-[#18181b] p-5 rounded-2xl mb-4 outline-none text-white border border-white/5" />
        <input type="number" placeholder="Amount (Min ৳500)" onChange={(e)=>setAmount(e.target.value)} className="w-full bg-[#18181b] p-5 rounded-2xl mb-8 outline-none text-2xl font-black text-center text-white border border-white/5" />
        <button onClick={handleSubmit} className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl active:scale-95 transition-all">CONFIRM</button>
      </div>
    </div>
  );
};
export default WithdrawModal;
