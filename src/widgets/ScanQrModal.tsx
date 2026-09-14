import React, { useState } from 'react';
import { X, QrCode, Flashlight, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ScanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanned?: (data: string) => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  isOpen,
  onClose,
  onScanned,
}) => {
  const [flashOn, setFlashOn] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScannedSuccess(true);
    setTimeout(() => {
      onScanned?.('ETHIO-TELEBIRR-PAY-0911223344');
      setScannedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4" id="scan-qr-modal">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#8cc73f]" />
            <h2 className="font-semibold text-sm">Scan Telebirr QR Code</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative h-72 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Animated scan beam */}
          <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-[#8cc73f] rounded-xl flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#8cc73f] to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
            <div className="text-center p-4">
              {scannedSuccess ? (
                <div className="flex flex-col items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 animate-bounce" />
                  <span className="text-xs font-semibold">QR Code Recognized!</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Align Telebirr merchant or personal QR code within frame
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="absolute bottom-4 px-3 py-1 bg-white/10 hover:bg-white/20 text-[11px] rounded-full text-slate-300 transition-colors cursor-pointer border border-white/10"
          >
            Tap here to simulate QR scan
          </button>
        </div>

        {/* Controls footer */}
        <div className="flex items-center justify-around py-3 px-4 bg-slate-800 border-t border-slate-700">
          <button
            type="button"
            onClick={() => setFlashOn(!flashOn)}
            className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
              flashOn ? 'text-amber-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flashlight className="w-5 h-5" />
            <span>{flashOn ? 'Flash On' : 'Flash Off'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Album Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
