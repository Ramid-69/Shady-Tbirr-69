import React, { useState, useEffect } from 'react';
import { X, User, DollarSign, Wallet, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

// 1. Edit Profile Modal (Triggered by clicking name 3 times)
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phoneNumber);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setPhone(user.phoneNumber);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUser(name, phone);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8cc73f]/20 text-[#7ab034] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Edit Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Update your Telebirr account name and mobile account number.
        </p>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Account Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl p-3 bg-white outline-hidden focus:border-[#8cc73f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Account Number / Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl p-3 bg-white outline-hidden focus:border-[#8cc73f]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Add Balance Modal (Triggered by clicking balance 3 times)
interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBalanceModal: React.FC<AddBalanceModalProps> = ({ isOpen, onClose }) => {
  const { addBalance, balance } = useApp();
  const [amountStr, setAmountStr] = useState('');
  const [source, setSource] = useState('Deposit / Cash In');

  useEffect(() => {
    if (isOpen) {
      setAmountStr('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (!isNaN(val) && val > 0) {
      addBalance(val, source);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Add Balance</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Specify amount to deposit into your Telebirr current balance. It will be added to your total and recorded in Transaction History.
        </p>

        <div className="bg-slate-50 rounded-xl p-2.5 mb-4 text-xs text-slate-600 flex justify-between">
          <span>Current Balance:</span>
          <span className="font-bold text-slate-800 font-mono">ETB {balance.toFixed(2)}</span>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Amount to Add (ETB)</label>
            <input
              type="number"
              step="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="e.g. 500.00"
              className="w-full text-base font-bold border border-slate-300 rounded-xl p-3 bg-white outline-hidden focus:border-[#8cc73f]"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Transaction Title / Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
            >
              <option value="Cash In / Deposit">Cash In / Agent Deposit</option>
              <option value="Bank Transfer Deposit (CBE)">Bank Transfer Deposit (CBE)</option>
              <option value="Salary Deposit">Salary Deposit</option>
              <option value="Remittance Received">telebirrRemit Inward</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Manual Edit Balances Modal (Allow manual editing of Reward Balance and Current Balance)
interface ManualEditBalancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualEditBalancesModal: React.FC<ManualEditBalancesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    balance,
    rewardBalance,
    endekiseBalance,
    setExactBalance,
    setExactRewardBalance,
    setExactEndekiseBalance,
  } = useApp();

  const [mainBal, setMainBal] = useState(balance.toString());
  const [rewBal, setRewBal] = useState(rewardBalance.toString());
  const [endBal, setEndBal] = useState(endekiseBalance.toString());

  useEffect(() => {
    if (isOpen) {
      setMainBal(balance.toFixed(2));
      setRewBal(rewardBalance.toFixed(2));
      setEndBal(endekiseBalance.toFixed(2));
    }
  }, [isOpen, balance, rewardBalance, endekiseBalance]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(mainBal);
    const r = parseFloat(rewBal);
    const end = parseFloat(endBal);

    if (!isNaN(m)) setExactBalance(m);
    if (!isNaN(r)) setExactRewardBalance(r);
    if (!isNaN(end)) setExactEndekiseBalance(end);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Edit Balances Manually</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Directly modify your Current Balance and Reward Balance amounts.
        </p>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Current Balance (ETB)</label>
            <input
              type="number"
              step="0.01"
              value={mainBal}
              onChange={(e) => setMainBal(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Reward Balance (ETB)</label>
            <input
              type="number"
              step="0.01"
              value={rewBal}
              onChange={(e) => setRewBal(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Endekise Balance (ETB)</label>
            <input
              type="number"
              step="0.01"
              value={endBal}
              onChange={(e) => setEndBal(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Balances
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Send Money Popup Choice (Screenshot 10: "To Individual" / "To Group")
interface SendMoneyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndividual: () => void;
  onSelectGroup: () => void;
}

export const SendMoneyPopup: React.FC<SendMoneyPopupProps> = ({
  isOpen,
  onClose,
  onSelectIndividual,
  onSelectGroup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full sm:max-w-xs bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-bold text-slate-800">Send Money</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectIndividual();
            }}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#8cc73f] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">To Individual</p>
              <p className="text-[10px] text-slate-400">Send money directly to a phone number</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectGroup();
            }}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#8cc73f] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">To Group</p>
              <p className="text-[10px] text-slate-400">Send or split money among group members</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
