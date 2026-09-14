import React, { useState } from 'react';
import {
  Search,
  Plane,
  CreditCard,
  Tv,
  Globe,
  Award,
  Car,
  Bus,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Shield,
  Layers,
} from 'lucide-react';

export const AppsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (name: string) => {
    setToast(`Opening ${name} Mini App...`);
    setTimeout(() => setToast(null), 2500);
  };

  const miniApps = [
    { id: '1', title: 'My Ethiotel', icon: Smartphone, color: 'text-emerald-600 bg-emerald-50' },
    { id: '2', title: 'telebirrRemit', icon: Globe, color: 'text-blue-600 bg-blue-50' },
    { id: '3', title: 'tele-Online Fixed', icon: Globe, color: 'text-cyan-600 bg-cyan-50' },
    { id: '4', title: 'Ethiopian Airlines', icon: Plane, color: 'text-amber-600 bg-amber-50' },
    { id: '5', title: 'Fayda (NID) ID', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    { id: '6', title: 'Teninete Health', icon: Sparkles, color: 'text-rose-600 bg-rose-50' },
    { id: '7', title: 'NID Printing', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
    { id: '8', title: 'MyDStv Service', icon: Tv, color: 'text-sky-600 bg-sky-50' },
    { id: '9', title: 'HOWLOW Music', icon: Sparkles, color: 'text-teal-600 bg-teal-50' },
    { id: '10', title: 'SITOTA Gift Cards', icon: Award, color: 'text-pink-600 bg-pink-50' },
    { id: '11', title: 'Gov E-Services', icon: Shield, color: 'text-emerald-700 bg-emerald-100' },
    { id: '12', title: 'Great Ethiopian Run', icon: Award, color: 'text-orange-600 bg-orange-50' },
    { id: '13', title: 'RIDE Passenger', icon: Car, color: 'text-yellow-700 bg-yellow-100' },
    { id: '14', title: 'Public Transport', icon: Bus, color: 'text-blue-700 bg-blue-100' },
    { id: '15', title: 'Hulu Beje', icon: ShoppingBag, color: 'text-violet-600 bg-violet-50' },
    { id: '16', title: 'WebSprix Internet', icon: Globe, color: 'text-slate-600 bg-slate-100' },
    { id: '17', title: 'Zmall Fast Delivery', icon: ShoppingBag, color: 'text-red-600 bg-red-50' },
    { id: '18', title: 'Digital Equb', icon: CreditCard, color: 'text-amber-700 bg-amber-100' },
  ];

  const filteredApps = miniApps.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] select-none overflow-y-auto relative" id="apps-screen">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-2xs">
        <h1 className="text-base font-bold text-slate-800">Apps</h1>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#8cc73f]/15 text-[#7ab034]">
          SuperApp Hub
        </span>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs shadow-2xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full outline-hidden text-slate-800 font-medium"
          />
        </div>
      </div>

      <div className="p-4 pt-1 space-y-4">
        {/* Mini Apps Grid (Screenshot 12) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Popular Mini Apps
          </h2>
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => showToast(app.title)}
                  className="flex flex-col items-center justify-start text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 shadow-2xs transition-transform active:scale-95 ${app.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-2 px-0.5">
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Developer Promotion Banner */}
        <div className="bg-gradient-to-r from-[#8cc73f]/10 to-[#0287d0]/10 border border-[#8cc73f]/30 rounded-2xl p-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 mb-1">
            Build on Telebirr Platform
          </h3>
          <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
            Deploy your mini app on Telebirr SuperApp and reach millions of Ethiopian users.
          </p>
          <span className="inline-block text-[11px] font-bold text-[#0287d0]">
            Telebirr Developer Portal →
          </span>
        </div>
      </div>
    </div>
  );
};
