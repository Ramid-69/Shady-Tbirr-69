import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TelebirrLoading } from '../components/TelebirrLoading';
import { ChevronDown, Delete } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { login } = useApp();
  const [phoneNumber, setPhoneNumber] = useState<string>('969121369');
  const [step, setStep] = useState<'phone' | 'pin'>('phone');
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNext = () => {
    if (phoneNumber.trim().length < 6) return;
    setStep('pin');
    setPin('');
    setPinError(null);
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError(null);

      if (nextPin.length === 6) {
        if (nextPin === '696969') {
          // Strict validation passed! Show 3s loading animation
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            login('696969');
            if (onLoginSuccess) {
              onLoginSuccess();
            }
          }, 3000);
        } else {
          // Invalid PIN
          setIsShaking(true);
          setPinError('Invalid PIN');
          setTimeout(() => {
            setPin('');
            setIsShaking(false);
          }, 600);
        }
      }
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8faf9] relative select-none overflow-y-auto" id="login-screen">
      {/* Top Header */}
      <header className="bg-white px-5 py-3 flex items-center justify-between border-b border-slate-100 shadow-2xs sticky top-0 z-10">
        <img
          src="/images/ethio.png"
          alt="Ethio Telecom"
          className="h-7 object-contain"
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold cursor-pointer">
            <span>English</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <img
            src="/images/telebirr.png"
            alt="telebirr"
            className="h-6 object-contain"
          />
        </div>
      </header>

      {/* Decorative subtle background curves */}
      <div className="absolute top-12 left-0 right-0 h-64 pointer-events-none opacity-30 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
          <path d="M-50 120 C100 80, 250 200, 450 100" stroke="#8cc73f" strokeWidth="1.5" />
          <path d="M-30 160 C120 120, 270 240, 470 140" stroke="#0287d0" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex-1 px-6 pt-7 pb-4 flex flex-col justify-between z-10">
        <div>
          {/* Welcome Text - Continuous smooth scroller (Top position restored per user request) */}
          <div className="mb-6 overflow-hidden whitespace-nowrap py-1">
            <div className="inline-flex text-2xl font-bold text-[#0287d0] tracking-tight animate-marquee-slow">
              <span className="mr-8">Welcome to telebirr SuperApp • All-in-One •</span>
              <span className="mr-8">Welcome to telebirr SuperApp • All-in-One •</span>
            </div>
          </div>

          {step === 'phone' ? (
            /* Step 1: Mobile Number Input */
            <div className="space-y-6">
              {/* Login Tab Bar */}
              <div className="border-b border-slate-200">
                <div className="inline-block pb-2 border-b-2 border-[#8cc73f]">
                  <span className="text-base font-bold text-slate-800">Login</span>
                </div>
              </div>

              {/* Input Container */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Mobile Number
                </label>
                <div className="flex items-center border border-slate-300 focus-within:border-[#8cc73f] focus-within:ring-1 focus-within:ring-[#8cc73f] rounded-xl px-4 py-3.5 bg-white transition-all">
                  <span className="text-sm font-semibold text-slate-700 mr-2">
                    +251
                  </span>
                  <input
                    type="tel"
                    id="input-login-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full outline-hidden text-sm font-semibold text-slate-800 tracking-wide"
                    placeholder="969121369"
                  />
                </div>
                {/* Centered number only, no user name, no 'default' label */}
                <div className="flex items-center justify-center text-xs font-semibold text-slate-500 pt-1">
                  <span>969121369</span>
                </div>
              </div>

              {/* Next Button */}
              <button
                id="btn-login-next"
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 px-4 bg-[#0287d0] hover:bg-[#0275b5] active:scale-99 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                Next
              </button>

              {/* Links */}
              <div className="space-y-3 pt-2 text-center text-xs">
                <p className="text-slate-600">
                  Don't have an account?{' '}
                  <span className="text-[#8cc73f] font-bold cursor-pointer hover:underline">
                    Create New Account
                  </span>
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#8cc73f]">
                  <button type="button" className="hover:underline cursor-pointer">teleHub</button>
                  <span className="text-slate-300">|</span>
                  <button type="button" className="hover:underline cursor-pointer">Help</button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: PIN Validation */
            <div className={`space-y-5 ${isShaking ? 'animate-shake' : ''}`}>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col items-center">
                <p className="text-xs text-slate-500 mb-4 text-center font-medium">
                  Enter your 6-digit Telebirr security PIN
                </p>

                {/* 6-dot indicator */}
                <div className="flex items-center gap-3.5 mb-2">
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

                {/* PIN Error */}
                <div className="h-6 flex items-center justify-center">
                  {pinError && (
                    <span className="text-xs font-bold text-rose-500 animate-in fade-in">
                      {pinError}
                    </span>
                  )}
                </div>
              </div>

              {/* PIN Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto w-full pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handlePinDigit(d)}
                    className="h-13 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-100 text-lg font-bold text-slate-800 shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {d}
                  </button>
                ))}
                <div className="h-13" />
                <button
                  type="button"
                  onClick={() => handlePinDigit('0')}
                  className="h-13 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-100 text-lg font-bold text-slate-800 shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinBackspace}
                  className="h-13 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-100 text-slate-700 shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between px-6 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Change number
                </button>
                <button
                  type="button"
                  className="font-semibold text-slate-500 hover:text-[#0287d0] cursor-pointer"
                >
                  Forgot PIN?
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 pb-2 text-center text-[11px] text-slate-400 space-y-1">
          <p className="text-[#8cc73f] font-semibold cursor-pointer hover:underline">
            Terms and Conditions
          </p>
          <p>©2026 Ethio telecom.All rights reserved</p>
          <p>1.2.9 version</p>
        </div>
      </div>

      {/* 3-Second Loading Animation Overlay */}
      <TelebirrLoading isLoading={isLoading} variant="fullscreen" />

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
