import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

// কম্পোনেন্ট ইম্পোর্ট
import SpinGame from './components/SpinGame';
import AdminPanel from './components/AdminPanel';
import AdminLoginPage from './components/AdminLoginPage';
import AuthPage from './components/AuthPage';
import Profile from './components/Profile';

// আপনার সঠিক অ্যাডমিন ইমেইল
const ADMIN_EMAIL = "rahmat4060159@gmail.com"; 

const App = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ১. যদি অ্যাডমিন লগইন করে, তবে তাকে /admin এ নিয়ে যাও
        if (currentUser.email === ADMIN_EMAIL) {
          if (location.pathname === '/' || location.pathname === '/dashboard') {
            navigate('/admin', { replace: true });
          }
        }
        
        // ২. ব্যালেন্স লিসেনার
        onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) setBalance(docSnap.data().balance || 0);
        });
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/', { replace: true }));
  };

  if (loading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-yellow-500 font-black animate-pulse">CV666...</div>;

  return (
    <Routes>
      {/* ইউজার লগইন পেজ */}
      <Route path="/" element={!user ? <AuthPage onAuth={() => navigate('/dashboard')} /> : (user.email === ADMIN_EMAIL ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />

      {/* অ্যাডমিন লগইন পেজ */}
      <Route path="/admin-login" element={!user ? <AdminLoginPage onAuth={() => navigate('/admin')} /> : (user.email === ADMIN_EMAIL ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />

      {/* ইউজার ড্যাশবোর্ড */}
      <Route path="/dashboard" element={
        user && user.email !== ADMIN_EMAIL ? (
          <div className="min-h-screen bg-[#09090b] text-white p-4 max-w-md mx-auto">
            <header className="flex justify-between items-center mb-8 pt-4">
              <h1 className="font-black text-2xl italic text-yellow-500">CV666</h1>
              <button onClick={handleLogout} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-[10px] font-black uppercase">Logout</button>
            </header>
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#09090b] p-8 rounded-[2rem] border border-white/5 shadow-2xl mb-8 text-center">
               <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Balance</p>
               <h2 className="text-4xl font-black italic mt-2">৳ {balance.toFixed(2)}</h2>
            </div>
            <SpinGame currentBalance={balance} onGameFinish={() => {}} />
          </div>
        ) : <Navigate to="/admin" />
      } />

      {/* অ্যাডমিন প্যানেল */}
      <Route path="/admin" element={
        user && user.email === ADMIN_EMAIL ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/admin-login" />
      } />
      
      {/* ভুল লিঙ্ক দিলে রিডাইরেক্ট */}
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile user={user} balance={balance} onLogout={handleLogout} /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
