import React, { useState } from 'react';

// স্পিন গেম কম্পোনেন্ট
const SpinGame = ({ currentBalance, onGameFinish }) => {
  const [spinning, setSpinning] = useState(false); // চাকা ঘুরছে কি না
  const [result, setResult] = useState(null); // ফলাফল
  const betAmount = 20; // প্রতি স্পিনে ২০ টাকা খরচ

  const startSpin = () => {
    if (currentBalance < betAmount) return alert("ব্যালেন্স নেই!");
    
    setSpinning(true);
    setResult(null);

    // ৩ সেকেন্ড পর রেজাল্ট দেখাবে
    setTimeout(() => {
      const isWin = Math.random() > 0.7; // ৩০% জেতার চান্স
      setSpinning(false);
      
      if (isWin) {
        setResult("WIN! 🏆");
        onGameFinish(betAmount); // জেতার লজিক
      } else {
        setResult("Try Again! ❌");
        onGameFinish(-betAmount); // হারার লজিক (মাইনাস হবে)
      }
    }, 2000);
  };

  return (
    <div className="mt-8 bg-[#161926] p-6 rounded-[2.5rem] border border-yellow-500/10 text-center shadow-xl">
      <h3 className="text-yellow-500 font-black text-sm tracking-widest mb-6">LUCKY WHEEL</h3>
      
      {/* চাকা অ্যানিমেশন */}
      <div className={`w-32 h-32 border-4 border-dashed border-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl ${spinning ? 'animate-spin' : ''}`}>
        {spinning ? '🌀' : '🎡'}
      </div>

      {result && (
        <p className={`mb-4 font-black text-lg ${result.includes('WIN') ? 'text-green-500' : 'text-red-500'}`}>
          {result}
        </p>
      )}

      <button 
        onClick={startSpin}
        disabled={spinning}
        className={`w-full py-4 rounded-2xl font-black transition-all ${spinning ? 'bg-gray-800 text-gray-500' : 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'}`}
      >
        {spinning ? "SPINNING..." : `SPIN (৳${betAmount})`}
      </button>
    </div>
  );
};

export default SpinGame;
