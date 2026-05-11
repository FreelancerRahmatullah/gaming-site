import React, { useState } from 'react';

const DepositModal = ({ onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");

  const handlePay = (method) => {
    if (!amount || amount < 200) return alert("সর্বনিম্ন ২০০ টাকা ডিপোজিট করুন!");
    // পেমেন্ট মেথড এবং অ্যামাউন্ট মেইন অ্যাপে পাঠানো
    onConfirm(amount, method);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* ব্যাকগ্রাউন্ড ঘোলা করা */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      {/* মডাল কন্টেন্ট */}
      <div className="relative bg-[#161926] w-full max-w-md rounded-t-[3rem] p-8 border-t border-yellow-500/20 animate-in slide-in-from-bottom duration-500 shadow-2xl">
        <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6"></div>
        <h3 className="text-2xl font-black mb-2 italic">RECHARGE <span className="text-yellow-500">CENTER</span></h3>
        <p className="text-gray-500 text-[10px] uppercase font-bold mb-8">বিকাশ বা নগদের মাধ্যমে দ্রুত ডিপোজিট করুন</p>

        {/* অ্যামাউন্ট ইনপুট */}
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="৳ Amount (Min 200)" 
          className="w-full bg-[#09090b] border border-white/5 p-5 rounded-2xl text-2xl font-black mb-8 focus:border-yellow-500 outline-none text-center text-white" 
        />

        {/* পেমেন্ট বাটনসমূহ */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button 
            onClick={() => handlePay('bKash')}
            className="bg-[#e2136e] p-5 rounded-2xl flex items-center justify-between font-bold hover:scale-[1.02] transition-all"
          >
            <span className="text-white italic uppercase text-sm font-black tracking-tighter">Pay with bKash</span>
            <span className="text-2xl">🚀</span>
          </button>

          <button 
            onClick={() => handlePay('Nagad')}
            className="bg-[#f7941d] p-5 rounded-2xl flex items-center justify-between font-bold hover:scale-[1.02] transition-all"
          >
            <span className="text-white italic uppercase text-sm font-black tracking-tighter">Pay with Nagad</span>
            <span className="text-2xl">⚡</span>
          </button>
        </div>
        
        <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">100% Secure Transaction</p>
      </div>
    </div>
  );
};

export default DepositModal;
