import React, { useState } from 'react';

const DepositModal = ({ onClose, onSubmitRequest }) => {
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#161926] w-full max-w-md rounded-t-[3rem] p-8 border-t border-yellow-500/20 animate-in slide-in-from-bottom duration-500">
        <h3 className="text-xl font-black mb-8 italic text-yellow-500 text-center uppercase tracking-tighter">Deposit Request</h3>
        <input type="number" placeholder="৳ Amount (Min 200)" onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#09090b] p-5 rounded-2xl mb-4 text-center font-bold text-white outline-none border border-white/5" />
        <input type="text" placeholder="Transaction ID (TrxID)" onChange={(e) => setTrxId(e.target.value)} className="w-full bg-[#09090b] p-5 rounded-2xl mb-8 text-center font-bold text-white outline-none border border-white/5" />
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onSubmitRequest(amount, 'bKash', trxId)} className="bg-[#e2136e] py-4 rounded-2xl font-bold uppercase text-xs">bKash</button>
          <button onClick={() => onSubmitRequest(amount, 'Nagad', trxId)} className="bg-[#f7941d] py-4 rounded-2xl font-bold uppercase text-xs">Nagad</button>
        </div>
      </div>
    </div>
  );
};
export default DepositModal;
