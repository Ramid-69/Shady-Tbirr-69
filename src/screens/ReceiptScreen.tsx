import React, { useState } from 'react';
import { Download, Share2, Check, QrCode } from 'lucide-react';
import { TransferReceiptData } from '../types';
import { CarouselSlider } from '../widgets/CarouselSlider';
import { carouselBanners } from '../constants';

interface ReceiptScreenProps {
  receipt: TransferReceiptData;
  onFinish: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({ receipt, onFinish }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handleDownload = () => {
    setToast('Receipt downloaded to device storage');
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Telebirr Transfer Receipt',
          text: `Telebirr Transfer Successful: ETB ${receipt.amount.toFixed(2)} transferred to ${receipt.transactionTo}. Tx: ${receipt.transactionNumber}`,
        })
        .catch(() => {});
    } else {
      setToast('Receipt details copied to clipboard');
      navigator.clipboard.writeText(
        `Telebirr Transfer: ETB ${receipt.amount.toFixed(2)} to ${receipt.transactionTo}. Tx ID: ${receipt.transactionNumber}`
      );
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto relative" id="receipt-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-3">
          {toast}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-[#8cc73f] hover:text-[#7ab034] text-xs font-bold cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-[#8cc73f] hover:text-[#7ab034] text-xs font-bold cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-6 flex flex-col justify-between">
        <div className="flex flex-col items-center">
          {/* Success Checkmark Circle */}
          <div className="w-18 h-18 rounded-full bg-[#8cc73f] flex items-center justify-center text-white shadow-md mb-2">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <h2 className="text-[#8cc73f] font-bold text-lg mb-2">Successful</h2>

          {/* Amount Display */}
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              -{receipt.amount.toFixed(2)}
            </span>
            <span className="text-base font-bold text-slate-900">(ETB)</span>
          </div>

          {/* Gray Divider */}
          <div className="w-full h-px bg-slate-200 mb-5" />

          {/* Transaction Key-Values */}
          <div className="w-full space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Time:</span>
              <span className="font-bold text-slate-800 font-mono">
                {receipt.transactionTime}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Type:</span>
              <span className="font-bold text-slate-800">
                {receipt.transactionType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction To:</span>
              <span className="font-bold text-slate-800 text-right">
                {receipt.transactionTo}
              </span>
            </div>

            {receipt.recipientBank && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Recipient Bank:</span>
                <span className="font-bold text-slate-800 text-right">
                  {receipt.recipientBank}
                </span>
              </div>
            )}

            {receipt.recipientAccount && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Recipient Account:</span>
                <span className="font-bold text-slate-800 font-mono text-right">
                  {receipt.recipientAccount}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Transaction Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 font-mono">
                  {receipt.transactionNumber}
                </span>
                <div className="flex items-center gap-1 text-[#8cc73f] hover:underline cursor-pointer">
                  <QrCode className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner (horizontal rotating carousel from home page) and Finished Button */}
        <div className="pt-6 space-y-4">
          {/* Promotional Carousel Slider */}
          <div className="w-full">
            <CarouselSlider banners={carouselBanners} />
          </div>

          {/* Finished Button */}
          <button
            id="btn-receipt-finished"
            type="button"
            onClick={onFinish}
            className="w-full py-3.5 px-4 bg-[#8cc73f] hover:bg-[#7cb634] active:scale-99 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
};
