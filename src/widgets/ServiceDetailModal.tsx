import React, { useState } from 'react';
import { X, CheckCircle2, Send, Smartphone, Landmark, Fuel, Store, AlertCircle } from 'lucide-react';
import { GridItem } from '../types';

interface ServiceDetailModalProps {
  item: GridItem | null;
  onClose: () => void;
  onProcessTransaction: (title: string, category: string, amount: number) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  item,
  onClose,
  onProcessTransaction,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!recipient.trim() && item.actionKey !== 'more_services') {
      setError('Please enter a recipient or account number');
      return;
    }

    setError('');
    setIsSuccess(true);
    onProcessTransaction(
      `${item.label} to ${recipient || 'Account'}`,
      item.label,
      -numAmount
    );

    setTimeout(() => {
      setIsSuccess(false);
      setRecipient('');
      setAmount('');
      setNote('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" id="service-action-modal">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#8cc73f] text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.iconType === 'image' && item.imageSrc ? (
              <img src={item.imageSrc} alt="" className="h-6 max-w-[30px] object-contain bg-white/20 rounded-sm p-0.5" />
            ) : item.actionKey === 'airtime' ? (
              <Smartphone className="w-5 h-5 text-white" />
            ) : item.actionKey === 'transfer_bank' ? (
              <Landmark className="w-5 h-5 text-white" />
            ) : item.actionKey === 'fuel_payment' ? (
              <Fuel className="w-5 h-5 text-white" />
            ) : item.actionKey === 'pay_merchants' ? (
              <Store className="w-5 h-5 text-white" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
            <h3 className="font-bold text-sm truncate max-w-[240px]">{item.label}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h4 className="font-bold text-slate-800 text-base">Transaction Successful!</h4>
            <p className="text-xs text-slate-500">
              Your {item.label} request of ETB {parseFloat(amount).toFixed(2)} was processed successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {item.actionKey.includes('bank') || item.actionKey.includes('cbe') || item.actionKey.includes('dashen')
                  ? 'Bank Account Number'
                  : item.actionKey.includes('fuel')
                  ? 'Station Code / Pump Number'
                  : item.actionKey.includes('merchant')
                  ? 'Merchant Code / Till Number'
                  : 'Recipient Phone Number'}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  item.actionKey.includes('bank')
                    ? 'e.g. 1000123456789'
                    : 'e.g. 0911223344'
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#8cc73f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (ETB)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">ETB</span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs pl-12 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#8cc73f]"
                />
              </div>
            </div>

            {item.actionKey === 'airtime' && (
              <div className="flex gap-2">
                {[25, 50, 100, 200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md font-medium text-slate-700 transition-colors"
                  >
                    {preset} ETB
                  </button>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remark / Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. For dinner, school fees..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#8cc73f]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#8cc73f] hover:bg-[#7bb334] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm & Proceed
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
