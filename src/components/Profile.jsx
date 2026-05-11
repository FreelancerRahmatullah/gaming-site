import React from 'react';

const Profile = ({ user, balance, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-black italic text-yellow-500 mb-8 uppercase">My Profile</h2>
      
      {/* Profile Card */}
      <div className="bg-[#161926] p-6 rounded-[2rem] border border-white/5 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-3xl">👤</div>
          <div>
            <h4 className="font-bold text-sm truncate w-40">{user.email}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">VIP Member</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Balance</p>
            <p className="text-lg font-black text-yellow-500">৳{balance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Status</p>
            <p className="text-lg font-black text-green-500">Active</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <button className="w-full bg-[#161926] p-4 rounded-2xl flex justify-between items-center text-sm font-bold border border-white/5">
          <span>Transaction History</span>
          <span>➜</span>
        </button>
        <button className="w-full bg-[#161926] p-4 rounded-2xl flex justify-between items-center text-sm font-bold border border-white/5">
          <span>Security & Password</span>
          <span>➜</span>
        </button>
        <button onClick={onLogout} className="w-full bg-red-500/10 text-red-500 p-4 rounded-2xl text-sm font-black mt-6 border border-red-500/20">
          LOGOUT ACCOUNT
        </button>
      </div>
    </div>
  );
};

export default Profile;
