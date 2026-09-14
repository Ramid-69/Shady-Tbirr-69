import React, { useState } from 'react';
import { ArrowLeft, Share2, Download, Check, QrCode, Copy, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TransferReceiptData } from '../types';

interface OfficialWebReceiptViewProps {
  receipt: TransferReceiptData;
  onBack?: () => void;
}

export const OfficialWebReceiptView: React.FC<OfficialWebReceiptViewProps> = ({
  receipt,
  onBack,
}) => {
  const [toast, setToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const receiptUrl = `https://transactioninfo.ethiotelecom.et/receipt/${receipt.transactionNumber}`;
  const shareableAppUrl = `${window.location.origin}${window.location.pathname}?receipt=${receipt.transactionNumber}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Telebirr Payment Receipt',
          text: `Telebirr Receipt (${receipt.transactionNumber}): ETB ${receipt.amount.toFixed(2)} transferred to ${receipt.transactionTo} on ${receipt.transactionTime}.`,
          url: shareableAppUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareableAppUrl);
    setCopiedLink(true);
    showToast('Receipt share link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTxNumber = () => {
    navigator.clipboard.writeText(receipt.transactionNumber);
    showToast(`Transaction ID ${receipt.transactionNumber} copied`);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 select-none font-sans" id="official-web-receipt">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#8cc73f]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Container Phone / Card Frame */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:rounded-3xl shadow-xl flex flex-col overflow-hidden border border-slate-200/80">
        {/* Top Header Bar */}
        <header className="px-4 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 -ml-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = window.location.origin;
                  }
                }}
                className="p-2 -ml-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Payment Receipt</h1>
              <p className="text-[10px] text-slate-400 font-mono">transactioninfo.ethiotelecom.et</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Print / Save Receipt"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-[#8cc73f] hover:text-[#7cb634] hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
              title="Share Receipt Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Receipt Content Body */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Telebirr Top Watermark / Brand */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/60">
                <ShieldCheck className="w-4 h-4 text-[#8cc73f]" />
                <span className="text-xs font-bold text-emerald-800">Telebirr Verified Transaction</span>
              </div>
            </div>

            {/* Success Checkmark & Status */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#8cc73f] flex items-center justify-center text-white shadow-md mb-2.5">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <h2 className="text-[#8cc73f] font-extrabold text-xl tracking-wide mb-1">
                Successful
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Your transaction has been executed successfully
              </p>

              {/* Large Amount */}
              <div className="flex items-baseline justify-center gap-1.5 mb-6 py-2 px-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  -{receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-base font-bold text-slate-700">(ETB)</span>
              </div>
            </div>

            {/* Receipt Key-Value Rows */}
            <div className="border-t border-b border-slate-100 py-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transaction Time:</span>
                <span className="font-bold text-slate-800 font-mono text-right">
                  {receipt.transactionTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transaction Type:</span>
                <span className="font-bold text-slate-800 text-right">
                  {receipt.transactionType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transaction To:</span>
                <span className="font-extrabold text-slate-900 text-right">
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
                  <span className="font-mono font-bold text-slate-800 text-right">
                    {receipt.recipientAccount}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payer Name:</span>
                <span className="font-bold text-slate-800 text-right">
                  {receipt.payerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payer Phone:</span>
                <span className="font-mono font-bold text-slate-800 text-right">
                  {receipt.payerPhone}
                </span>
              </div>

              {receipt.serviceFee !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Service Fee:</span>
                  <span className="font-bold text-slate-800 text-right">
                    {receipt.serviceFee.toFixed(2)} Br
                  </span>
                </div>
              )}

              {receipt.vatFee !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Service Fee 15% VAT:</span>
                  <span className="font-bold text-slate-800 text-right">
                    {receipt.vatFee.toFixed(2)} Br
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Remaining Balance:</span>
                <span className="font-bold text-slate-800 text-right">
                  {receipt.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Br
                </span>
              </div>

              {receipt.bankRefNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Bank Reference No:</span>
                  <span className="font-mono font-bold text-slate-800 text-right">
                    {receipt.bankRefNumber}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Transaction Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-slate-900">
                    {receipt.transactionNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTxNumber}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Copy Transaction Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 text-[#8cc73f] ml-1">
                    <QrCode className="w-4 h-4" />
                    <span className="text-[10px] font-bold">QR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Link Badge */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Receipt Verification Link</p>
                <p className="text-xs font-mono font-bold text-[#0287d0] truncate">{receiptUrl}</p>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-[#8cc73f] text-white text-xs font-bold shrink-0 hover:bg-[#7cb634] cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Footer Official Badge */}
          <div className="pt-6 pb-2 text-center text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-600">Ethio telecom • Telebirr Electronic Money</p>
            <p>One App for All Your Needs • Verified Digital Transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};
