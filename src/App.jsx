import React, { useState, useEffect } from 'react';
// ফায়ারবেস ইম্পোর্ট
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, onSnapshot, collection, addDoc } from "firebase/firestore";

// আলাদা করা সব কম্পোনেন্ট ইম্পোর্ট
import SpinGame from './components/SpinGame';
import AdminPanel from './components/AdminPanel';
import WithdrawModal from './components/WithdrawModal';
import DepositModal from './components/DepositModal';
import AuthPage from './components/AuthPage';

// আপনার অ্যাডমিন ইমেইলটি এখানে সেট করুন
const ADMIN_EMAIL = "admin@example.com"; 

// --- ১. লাইভ উইনার কম্পোনেন্ট (নতুন যোগ করা হয়েছে) ---
const LiveWinners = () => {
  const [winner, setWinner] = useState({ name: "user***82", amount: "500" });

  useEffect(() => {
    const names = ["akash***", "shuvo***", "mim***", "rakib***", "user***", "top***", "win***", "luck***"];
    const interval = setInterval(() => {
      setWinner({
        name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
        amount: [200, 500, 1000, 2000, 5000][Math.floor(Math.random() * 5)]
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-28 left-4 right-4 z-40">
      <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 p-2 px-4 rounded-full flex items-center gap-3 w-fit mx-auto shadow-lg animate-pulse">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-[10px]">🎉</div>
        <p className="text-[10px] font-bold text-white">
          <span className="text-yellow-500">{winner.name}</span> won 
          <span className="text-green-400"> ৳{winner.amount}</span>
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let unsubSnapshot = () => {};
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(currentUser.email === ADMIN_EMAIL);
        const userRef = doc(db, "users", currentUser.uid);
        unsubSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) setBalance(docSnap.data().balance || 0);
        });
        if (currentUser.email === ADMIN_EMAIL) {
          onSnapshot(collection(db, "withdraw_requests"), (sn) => {
            setWithdrawRequests(sn.docs.map(d => ({ id: d.id, ...d.data() })));
          });
        }
      }
      setLoading(false);
    });
    return () => { unsubAuth(); unsubSnapshot(); };
  }, []);

  const handleAuth = async (type) => {
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), { email, balance: 50 });
      }
    } catch (e) { alert("Error: " + e.message); }
  };

  const confirmDeposit = async (amt) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { balance: balance + Number(amt) });
      setShowDeposit(false);
      alert("৳" + amt + " জমা হয়েছে!");
    } catch (e) { alert(e.message); }
  };

  const submitWithdraw = async (phone, amt) => {
    try {
      await addDoc(collection(db, "withdraw_requests"), {
        uid: user.uid, email: user.email, phone, amount: Number(amt), time: new Date().toLocaleString()
      });
      await updateDoc(doc(db, "users", user.uid), { balance: balance - Number(amt) });
      setShowWithdraw(false);
      alert("উইথড্র রিকোয়েস্ট পাঠানো হয়েছে!");
    } catch (e) { alert(e.message); }
  };

  const updateGameBalance = async (amt) => {
    const userRef = doc(db, "users", user.uid);
    let newBal = amt > 0 ? balance + (amt * 2) : balance + amt;
    await updateDoc(userRef, { balance: newBal });
  };

  if (loading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-yellow-500 font-black animate-pulse">CV666 LOADING...</div>;
  if (!user) return <AuthPage setEmail={setEmail} setPassword={setPassword} onAuth={handleAuth} />;
  if (isAdmin) return <AdminPanel requests={withdrawRequests} onLogout={() => signOut(auth)} />;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 pb-32 max-w-md mx-auto relative overflow-hidden">
      
      {/* ২. টপ হেডার (ব্র্যান্ডিং) */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-black font-black italic shadow-[0_0_10px_rgba(234,179,8,0.5)]">CV</div>
           <h1 className="font-black text-xl italic text-white tracking-tighter uppercase">666</h1>
        </div>
        <button onClick={() => signOut(auth)} className="text-[9px] bg-red-500/10 text-red-400 px-4 py-2 rounded-full font-black border border-red-500/30 uppercase tracking-widest">Logout</button>
      </header>

      {/* ব্যালেন্স কার্ড */}
      <div className="bg-gradient-to-br from-[#1e1b4b] to-[#09090b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl italic font-black text-white">VIP 1</div>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[3px] mb-2 text-center">Current Credits</p>
        <h2 className="text-5xl font-black italic tracking-tighter text-center mb-8">৳ {balance.toFixed(2)}</h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setShowDeposit(true)} className="bg-yellow-500 text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-500/20 uppercase text-[10px] tracking-widest">Deposit</button>
          <button onClick={() => setShowWithdraw(true)} className="bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl uppercase text-[10px] tracking-widest">Withdraw</button>
        </div>
      </div>

      {/* গেম সেকশন */}
      <div className="mb-6 flex items-center justify-between px-2">
         <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Popular Game</h3>
         <span className="text-[10px] text-yellow-500 font-bold underline">All Games</span>
      </div>
      
      <SpinGame currentBalance={balance} onGameFinish={updateGameBalance} />

      {/* মডালসমূহ */}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} onConfirm={confirmDeposit} />}
      {showWithdraw && <WithdrawModal balance={balance} onClose={() => setShowWithdraw(false)} onSubmit={submitWithdraw} />}

      {/* ৩. লাইভ নোটিফিকেশন */}
      <LiveWinners />

      {/* বটম নেভিগেশন */}
      <nav className="fixed bottom-6 left-6 right-6 h-18 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] flex justify-around items-center z-50 shadow-2xl">
        <div className="text-yellow-500 flex flex-col items-center gap-1 transition-all scale-110">
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </div>
        <div className="text-gray-500 flex flex-col items-center gap-1">
          <span className="text-xl opacity-60">🎰</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Games</span>
        </div>
        <div className="text-gray-500 flex flex-col items-center gap-1">
          <span className="text-xl opacity-60">👤</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Account</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
