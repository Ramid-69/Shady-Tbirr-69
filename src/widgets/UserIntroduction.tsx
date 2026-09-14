import React, { useRef } from 'react';
import { User } from 'lucide-react';

interface UserIntroductionProps {
  userName: string;
  onTripleClick?: () => void;
}

export const UserIntroduction: React.FC<UserIntroductionProps> = ({
  userName = 'AHMED HUSSEN SEID',
  onTripleClick,
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;
      if (onTripleClick) {
        onTripleClick();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer select-none group"
      id="user-introduction"
      onClick={handleClick}
      title="Click 3 times to edit name and account number"
    >
      <div className="w-8 h-8 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-white shadow-xs">
        <User className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white text-sm font-semibold tracking-wide truncate max-w-[170px]">
          Selam, {userName}
        </span>
      </div>
    </div>
  );
};
