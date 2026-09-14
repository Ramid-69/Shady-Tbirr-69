import React, { useState } from 'react';
import { MessageSquare, Users, Sparkles, Gift, Split } from 'lucide-react';

export const EngageScreen: React.FC = () => {
  const [activeView, setActiveView] = useState<'welcome' | 'chats'>('welcome');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] select-none overflow-y-auto relative" id="engage-screen">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-base font-bold text-slate-800">telebirr Engage</h1>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8cc73f]/15 text-[#7ab034] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Hub</span>
        </div>
      </header>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {activeView === 'welcome' ? (
        /* Welcome to telebirr Engage (Screenshot 13) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {/* Colorful chat bubbles illustration */}
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <div className="absolute -top-2 -left-2 w-20 h-20 rounded-full bg-[#0287d0]/20 flex items-center justify-center animate-pulse">
              <MessageSquare className="w-9 h-9 text-[#0287d0]" />
            </div>
            <div className="absolute top-4 right-0 w-24 h-24 rounded-full bg-[#8cc73f]/25 flex items-center justify-center">
              <Users className="w-12 h-12 text-[#7ab034]" />
            </div>
            <div className="absolute -bottom-2 left-6 w-16 h-16 rounded-full bg-[#fbbb47]/25 flex items-center justify-center">
              <Gift className="w-8 h-8 text-[#d69316]" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Welcome to telebirr Engage
          </h2>

          <p className="text-xs text-slate-600 max-w-[280px] leading-relaxed mb-8">
            Engage with your friends and family and experience the power of telebirr!!
          </p>

          <button
            type="button"
            id="btn-start-engaging"
            onClick={() => setActiveView('chats')}
            className="w-full max-w-xs py-3.5 px-6 bg-[#8cc73f] hover:bg-[#7cb634] active:scale-98 text-white font-bold rounded-xl shadow-md text-sm transition-all cursor-pointer"
          >
            Start Engaging
          </button>
        </div>
      ) : (
        /* Active Engage View */
        <div className="p-4 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => showToast('Chat opened with contacts')}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-[#8cc73f] transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8cc73f]/15 text-[#7ab034] flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Peer Chat</h4>
              <p className="text-[10px] text-slate-400">Send money in conversation</p>
            </button>

            <button
              type="button"
              onClick={() => showToast('Split Bill calculator opened')}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-[#8cc73f] transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0287d0]/15 text-[#0287d0] flex items-center justify-center mb-2">
                <Split className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Split Bill</h4>
              <p className="text-[10px] text-slate-400">Divide group dinner or fees</p>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700">Recent Chats</h3>
              <button
                type="button"
                onClick={() => setActiveView('welcome')}
                className="text-xs text-[#0287d0] font-semibold"
              >
                Back to intro
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { name: 'FOZIA MOSSA MOHAMMED', msg: 'Thank you for the transfer!', time: '18:14', unread: 0 },
                { name: 'Ethio Telecom Support', msg: 'Your data package recharge was successful.', time: 'Yesterday', unread: 1 },
                { name: 'Ahmed & Friends Group', msg: 'Abebe paid 400 ETB for lunch.', time: 'Sep 10', unread: 2 },
              ].map((c, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`Opening chat with ${c.name}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{c.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{c.msg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                    {c.unread > 0 && (
                      <span className="block w-4 h-4 rounded-full bg-[#8cc73f] text-white text-[9px] font-bold text-center leading-4 ml-auto mt-0.5">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
