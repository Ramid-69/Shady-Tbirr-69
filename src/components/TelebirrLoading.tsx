import React from 'react';

interface TelebirrLoadingProps {
  isLoading: boolean;
  message?: string;
  variant?: 'modal' | 'fullscreen';
}

export const TelebirrLoading: React.FC<TelebirrLoadingProps> = ({
  isLoading,
  variant = 'modal',
}) => {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none"
      id="telebirr-loading-overlay"
    >
      {variant === 'fullscreen' ? (
        <div className="relative w-full h-full bg-[#8cc73f] flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle concentric circular lines in background */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="400" r="140" stroke="white" strokeWidth="1.5" />
              <circle cx="200" cy="400" r="220" stroke="white" strokeWidth="1.5" />
              <circle cx="200" cy="400" r="300" stroke="white" strokeWidth="1.5" />
              <circle cx="200" cy="400" r="380" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Top Logo */}
          <div className="flex flex-col items-center mb-8 z-10">
            <div className="flex items-center gap-1.5">
              <img src="/images/telebirr.png" alt="Telebirr" className="h-10 object-contain drop-shadow-sm" />
            </div>
            <span className="text-white text-xs font-semibold tracking-wider mt-1 opacity-90">SuperApp</span>
          </div>

          {/* White Card with circular green spinner */}
          <div className="bg-white rounded-2xl p-7 shadow-2xl flex flex-col items-center justify-center w-28 h-28 z-10">
            <div className="telebirr-spinner relative w-12 h-12">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div
                  key={deg}
                  className="spinner-dot absolute w-2.5 h-2.5 rounded-full bg-[#8cc73f]"
                  style={{
                    top: `${50 - 40 * Math.cos((deg * Math.PI) / 180)}%`,
                    left: `${50 + 40 * Math.sin((deg * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `telebirrPulse 1.2s linear infinite ${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* White centered modal spinner */
        <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center w-28 h-28">
          <div className="telebirr-spinner relative w-12 h-12">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={deg}
                className="spinner-dot absolute w-2.5 h-2.5 rounded-full bg-[#8cc73f]"
                style={{
                  top: `${50 - 40 * Math.cos((deg * Math.PI) / 180)}%`,
                  left: `${50 + 40 * Math.sin((deg * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `telebirrPulse 1.2s linear infinite ${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes telebirrPulse {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.7);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
      `}</style>
    </div>
  );
};
