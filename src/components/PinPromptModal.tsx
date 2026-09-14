import React, { useState, useEffect } from 'react';
import { X, Delete } from 'lucide-react';

interface PinPromptModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  isOpen,
  title = 'Enter Payment PIN',
  subtitle = 'Please enter your 6-digit Telebirr PIN',
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setIsShaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);

      if (nextPin.length === 6) {
        // Validate PIN
        if (nextPin === '696969') {
          setTimeout(() => {
            onSuccess();
          }, 150);
        } else {
          setIsShaking(true);
          setError('Invalid PIN. Please try again.');
          setTimeout(() => {
            setPin('');
            setIsShaking(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none">
      <div
        className={`w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 flex flex-col items-center animate-in slide-in-from-bottom-6 sm:zoom-in-95 ${
          isShaking ? 'animate-shake' : ''
        }`}
        id="pin-prompt-modal"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="w-6" />
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-6 text-center">{subtitle}</p>

        {/* 6-dot PIN indicator */}
        <div className="flex items-center gap-3.5 mb-4">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  isFilled
                    ? 'bg-[#8cc73f] border-[#8cc73f] scale-110'
                    : 'bg-transparent border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <div className="h-6 flex items-center justify-center mb-4">
          {error && (
            <p className="text-xs font-semibold text-rose-500 text-center animate-in fade-in">
              {error}
            </p>
          )}
        </div>

        {/* Custom Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xl font-bold text-slate-800 shadow-2xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <div className="h-14" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xl font-bold text-slate-800 shadow-2xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
};
