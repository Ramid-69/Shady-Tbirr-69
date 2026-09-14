import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Search, Calendar, ChevronRight } from 'lucide-react';
import { TransactionRecord } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionRecord[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  if (!isOpen) return null;

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'all' ? true : t.type === filter;
    const matchesSearch = searchTerm.trim() === '' ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.recipientName && t.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f6f8] select-none animate-in fade-in duration-200" id="transaction-history-fullscreen">
      {/* Full-Screen Header */}
      <header className="bg-[#8cc73f] text-white px-4 py-3 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-full text-white hover:bg-white/15 active:bg-white/25 transition-colors cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="font-extrabold text-base tracking-wide">Transaction History</h1>
            <p className="text-[11px] text-white/85">Official Telebirr Statement</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 text-white font-bold px-2.5 py-1 rounded-full">
            {filtered.length} Records
          </span>
        </div>
      </header>

      {/* Search & Filter Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 space-y-2.5 shadow-2xs shrink-0">
        {/* Search Input */}
        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-[#8cc73f] focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by recipient, type or title..."
            className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-[#8cc73f] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Transactions
          </button>
          <button
            type="button"
            onClick={() => setFilter('credit')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all shrink-0 ${
              filter === 'credit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Money In (+)
          </button>
          <button
            type="button"
            onClick={() => setFilter('debit')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all shrink-0 ${
              filter === 'debit'
                ? 'bg-[#0287d0] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Money Out (-)
          </button>
        </div>
      </div>

      {/* Scrollable Transaction List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Calendar className="w-12 h-12 text-slate-300 stroke-1" />
            <p className="text-sm font-semibold text-slate-500">No transactions found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((tx) => {
            const isCredit = tx.type === 'credit';
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-[#8cc73f]/40 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-blue-50 text-[#0287d0] border border-blue-100'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">
                      {tx.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {tx.recipientName ? `${tx.recipientName} • ` : ''}{tx.category}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right pl-3 shrink-0 flex items-center gap-2">
                  <div>
                    <span
                      className={`text-sm font-black font-mono block ${
                        isCredit ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'} ETB {Math.abs(tx.amount).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
                      {tx.status}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800">Transaction Details</h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
              >
                Close
              </button>
            </div>

            <div className="text-center py-2">
              <div
                className={`text-2xl font-black font-mono ${
                  selectedTx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {selectedTx.type === 'credit' ? '+' : '-'} ETB {Math.abs(selectedTx.amount).toFixed(2)}
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">{selectedTx.title}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-bold text-slate-800">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-800">{selectedTx.date}</span>
              </div>
              {selectedTx.recipientName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient / Party</span>
                  <span className="font-bold text-slate-800">{selectedTx.recipientName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel</span>
                <span className="font-mono text-slate-700">Telebirr SuperApp</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-3 bg-[#8cc73f] hover:bg-[#7cb634] text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer Action */}
      <footer className="bg-white border-t border-slate-200 p-3 shrink-0 flex items-center justify-between text-xs text-slate-500">
        <span>Verified by Ethio Telecom</span>
        <button
          type="button"
          onClick={onClose}
          className="font-bold text-[#0287d0] hover:underline"
        >
          Close History
        </button>
      </footer>
    </div>
  );
};
