import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TransactionDetailsProps {
  onClick?: () => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-end items-center my-1.5" id="transaction-details-link">
      <button
        id="btn-transaction-details"
        type="button"
        onClick={onClick}
        className="flex items-center gap-0.5 text-[#1384b9] font-bold text-[13px] hover:underline cursor-pointer group"
      >
        <span>Transaction Details</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};
