import React, { useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BalanceInfoProps {
  id?: string;
  label: string;
  amount: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onTripleClick?: () => void;
  onManualEdit?: () => void;
  labelFontSize?: 'sm' | 'md' | 'lg';
  balanceFontSize?: 'lg' | 'xl' | '2xl' | '3xl';
  alignment?: 'center' | 'start' | 'end';
}

export const BalanceInfo: React.FC<BalanceInfoProps> = ({
  id,
  label,
  amount,
  isVisible,
  onToggleVisibility,
  onTripleClick,
  labelFontSize = 'md',
  balanceFontSize = '2xl',
  alignment = 'center',
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContainerClick = () => {
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

  const getLabelClass = () => {
    switch (labelFontSize) {
      case 'sm':
        return 'text-[13px]';
      case 'lg':
        return 'text-[16px]';
      case 'md':
      default:
        return 'text-[14px]';
    }
  };

  const getBalanceClass = () => {
    switch (balanceFontSize) {
      case '3xl':
        return 'text-[25px] sm:text-[28px]';
      case 'xl':
        return 'text-[17px] sm:text-[19px]';
      case 'lg':
        return 'text-[15px]';
      case '2xl':
      default:
        return 'text-[20px]';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'start':
        return 'items-start text-left';
      case 'end':
        return 'items-end text-right';
      case 'center':
      default:
        return 'items-center text-center';
    }
  };

  return (
    <div className={`flex flex-col ${getAlignmentClass()} group`} id={id}>
      <div className="flex items-center gap-1.5 cursor-pointer select-none">
        <span
          className={`${getLabelClass()} text-[#f7ffea] font-medium tracking-wide`}
          onClick={onToggleVisibility}
        >
          {label}
        </span>
        <button
          type="button"
          aria-label="Toggle balance visibility"
          className="text-[#f7ffea] hover:opacity-90 transition-opacity p-0.5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
        >
          {isVisible ? (
            <EyeOff className="w-3.5 h-3.5 text-[#f7ffea]" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-[#f7ffea]" />
          )}
        </button>
      </div>

      <div
        onClick={handleContainerClick}
        title={onTripleClick ? 'Click 3 times to add balance' : undefined}
        className={`font-bold text-white font-mono tracking-wider cursor-pointer active:scale-98 transition-transform select-none ${getBalanceClass()}`}
      >
        {isVisible ? amount : '******'}
      </div>
    </div>
  );
};
