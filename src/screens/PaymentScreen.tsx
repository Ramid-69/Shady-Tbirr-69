import React, { useState } from 'react';
import {
  Receipt,
  Search,
  ChevronRight,
  Zap,
  Landmark,
  Bus,
  Tv,
  ShoppingBag,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceDetailModal } from '../widgets/ServiceDetailModal';
import { GridItem } from '../types';

export const PaymentScreen: React.FC = () => {
  const { performTransfer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<GridItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const categories = [
    {
      title: 'Utility',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
      items: [
        { id: 'u-1', label: 'Pay Ethio telecom Bill', iconType: 'image' as const, imageSrc: '/images/ethio-logo.png', actionKey: 'ethio_bill' },
        { id: 'u-2', label: 'Electric Utility (EEU)', iconType: 'icon' as const, iconName: 'zap', actionKey: 'electric_bill' },
        { id: 'u-3', label: 'Addis Ababa Water', iconType: 'icon' as const, iconName: 'droplet', actionKey: 'water_bill' },
        { id: 'u-4', label: 'Oromia Water Authority', iconType: 'icon' as const, iconName: 'droplet', actionKey: 'oromia_water' },
      ],
    },
    {
      title: 'Tax and Government Service',
      icon: Landmark,
      color: 'text-blue-600 bg-blue-50',
      items: [
        { id: 't-1', label: 'Ministry of Revenues (MOR)', iconType: 'icon' as const, iconName: 'landmark', actionKey: 'tax_mor' },
        { id: 't-2', label: 'Addis Ababa City Admin', iconType: 'icon' as const, iconName: 'building', actionKey: 'aa_city' },
        { id: 't-3', label: 'Traffic Penalty Payment', iconType: 'icon' as const, iconName: 'car', actionKey: 'traffic_penalty' },
      ],
    },
    {
      title: 'Mesob One Center',
      icon: Building,
      color: 'text-emerald-600 bg-emerald-50',
      items: [
        { id: 'm-1', label: 'Mesob One Stop Service', iconType: 'icon' as const, iconName: 'building', actionKey: 'mesob_one' },
      ],
    },
    {
      title: 'Transport Service',
      icon: Bus,
      color: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'tr-1', label: 'City Bus Ticket', iconType: 'icon' as const, iconName: 'bus', actionKey: 'city_bus' },
        { id: 'tr-2', label: 'RIDE Transport Service', iconType: 'icon' as const, iconName: 'car', actionKey: 'ride_pay' },
        { id: 'tr-3', label: 'Sheger Bus Payment', iconType: 'icon' as const, iconName: 'bus', actionKey: 'sheger_bus' },
      ],
    },
    {
      title: 'Entertainment Service',
      icon: Tv,
      color: 'text-rose-600 bg-rose-50',
      items: [
        { id: 'e-1', label: 'DSTV Ethiopian Bills', iconType: 'icon' as const, iconName: 'tv', actionKey: 'dstv_pay' },
        { id: 'e-2', label: 'Canal+ Ethiopia', iconType: 'icon' as const, iconName: 'tv', actionKey: 'canal_pay' },
        { id: 'e-3', label: 'Habesha Cinema Tickets', iconType: 'icon' as const, iconName: 'film', actionKey: 'cinema_pay' },
      ],
    },
    {
      title: 'E-commerce',
      icon: ShoppingBag,
      color: 'text-teal-600 bg-teal-50',
      items: [
        { id: 'ec-1', label: 'Deliver Addis', iconType: 'icon' as const, iconName: 'shopping-bag', actionKey: 'deliver_addis' },
        { id: 'ec-2', label: 'Zmall Delivery', iconType: 'icon' as const, iconName: 'shopping-bag', actionKey: 'zmall_pay' },
        { id: 'ec-3', label: 'Hulu Beje Market', iconType: 'icon' as const, iconName: 'store', actionKey: 'hulubeje_pay' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] select-none overflow-y-auto relative" id="payment-screen">
      {/* Top Header (Screenshot 11) */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-2xs">
        <h1 className="text-base font-bold text-slate-800">Payment</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#8cc73f]/15 text-[#7ab034]">
            Telebirr Pay
          </span>
        </div>
      </header>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 pb-1">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs shadow-2xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search billers, utilities & tax..."
            className="w-full outline-hidden text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Payment Categories & Accordions */}
      <div className="p-4 pt-2 space-y-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const matchingItems = category.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && matchingItems.length === 0) return null;

          return (
            <div
              key={category.title}
              className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden"
            >
              {/* Category Header */}
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${category.color}`}>
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                    {category.title}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {matchingItems.length} services
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {matchingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelectedService({
                        id: item.id,
                        label: item.label,
                        iconType: item.iconType,
                        imageSrc: item.imageSrc,
                        actionKey: item.actionKey,
                      })
                    }
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageSrc ? (
                        <img
                          src={item.imageSrc}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Receipt className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Modal */}
      <ServiceDetailModal
        item={selectedService}
        onClose={() => setSelectedService(null)}
        onProcessTransaction={(title, category, amount) => {
          performTransfer({
            amount: Math.abs(amount),
            recipientName: title,
            transactionType: category,
          });
          showToast(`Paid ETB ${Math.abs(amount).toFixed(2)} to ${title}`);
        }}
      />
    </div>
  );
};
