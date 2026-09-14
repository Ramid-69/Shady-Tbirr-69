import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Search,
  CreditCard,
  Trash2,
  Plus,
  Edit2,
  X,
  Lock,
  Delete,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PinPromptModal } from '../components/PinPromptModal';
import { TelebirrLoading } from '../components/TelebirrLoading';
import { SavedAccount } from '../types';

interface TransferToBankScreenProps {
  onBack: () => void;
  onSuccessTransfer: () => void;
}

const ETHIOPIAN_BANKS = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', amharic: 'የኢትዮጵያ ንግድ ባንክ', code: 'CBE', color: 'bg-purple-700' },
  { id: 'dashen', name: 'Dashen Bank', amharic: 'ዳሽን ባንክ', code: 'DASHEN', color: 'bg-blue-800' },
  { id: 'awash', name: 'Awash Bank', amharic: 'አዋሽ ባንክ', code: 'AWASH', color: 'bg-blue-600' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', amharic: 'አቢሲኒያ ባንክ', code: 'BOA', color: 'bg-amber-600' },
  { id: 'amhara', name: 'Amhara Bank', amharic: 'አማራ ባንክ', code: 'AMHARA', color: 'bg-yellow-600' },
  { id: 'oromia_coop', name: 'Cooperative Bank of Oromia', amharic: 'ኅብረት ባንክ', code: 'COOP', color: 'bg-orange-600' },
  { id: 'hibret', name: 'Hibret Bank', amharic: 'ሕብረት ባንክ', code: 'HIBRET', color: 'bg-emerald-700' },
  { id: 'nib', name: 'Nib International Bank', amharic: 'ንብ ኢንተርናሽናል ባንክ', code: 'NIB', color: 'bg-amber-700' },
  { id: 'bunna', name: 'Bunna Bank', amharic: 'ቡና ባንክ', code: 'BUNNA', color: 'bg-amber-900' },
  { id: 'berhan', name: 'Berhan Bank', amharic: 'ብርሃን ባንክ', code: 'BERHAN', color: 'bg-yellow-700' },
  { id: 'abay', name: 'Abay Bank', amharic: 'አባይ ባንክ', code: 'ABAY', color: 'bg-teal-700' },
  { id: 'addis', name: 'Addis Bank S.C.', amharic: 'አዲስ ባንክ', code: 'ADDIS', color: 'bg-indigo-700' },
  { id: 'ahadu', name: 'Ahadu Bank', amharic: 'አሃዱ ባንክ', code: 'AHADU', color: 'bg-blue-900' },
  { id: 'global', name: 'Global Bank Ethiopia', amharic: 'ግሎባል ባንክ', code: 'GLOBAL', color: 'bg-cyan-800' },
  { id: 'siinqee', name: 'Siinqee Bank', amharic: 'ሲንቄ ባንክ', code: 'SIINQEE', color: 'bg-rose-700' },
  { id: 'wegagen', name: 'Wegagen Bank', amharic: 'ወጋገን ባንክ', code: 'WEGAGEN', color: 'bg-amber-800' },
  { id: 'lion', name: 'Lion International Bank', amharic: 'አንበሳ ኢንተርናሽናል ባንክ', code: 'LION', color: 'bg-red-800' },
  { id: 'zemen', name: 'Zemen Bank', amharic: 'ዘመን ባንክ', code: 'ZEMEN', color: 'bg-slate-800' },
  { id: 'oromia', name: 'Oromia Bank', amharic: 'ኦሮሚያ ባንክ', code: 'OROMIA', color: 'bg-red-700' },
  { id: 'hijra', name: 'Hijra Bank', amharic: 'ሂጅራ ባንክ', code: 'HIJRA', color: 'bg-emerald-800' },
  { id: 'zamzam', name: 'ZamZam Bank', amharic: 'ዘምዘም ባንክ', code: 'ZAMZAM', color: 'bg-teal-800' },
];

const POPULAR_WALLETS = [
  { id: 'telebirr', name: 'Telebirr', color: 'bg-[#8cc73f]' },
  { id: 'cbebirr', name: 'CBE Birr', color: 'bg-purple-700' },
  { id: 'mpesa', name: 'M-Pesa (Safaricom)', color: 'bg-red-600' },
  { id: 'ebirr', name: 'E-Birr', color: 'bg-blue-600' },
  { id: 'amole', name: 'Amole Wallet', color: 'bg-emerald-600' },
];

export const TransferToBankScreen: React.FC<TransferToBankScreenProps> = ({
  onBack,
  onSuccessTransfer,
}) => {
  const {
    balance,
    savedAccounts,
    addSavedAccount,
    updateSavedAccount,
    deleteSavedAccount,
    performTransfer,
  } = useApp();

  const [step, setStep] = useState<'bank_select' | 'amount'>('bank_select');
  const [selectedBank, setSelectedBank] = useState<string>('Commercial Bank of Ethiopia');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');

  const [amountStr, setAmountStr] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isChooseBankOpen, setIsChooseBankOpen] = useState<boolean>(false);
  const [bankSearchQuery, setBankSearchQuery] = useState<string>('');
  const [isHideSettingOpen, setIsHideSettingOpen] = useState<boolean>(false);
  const [isPinOpen, setIsPinOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecentVisible, setIsRecentVisible] = useState<boolean>(true);

  // Edit / Add in Hide Setting state
  const [editingAccount, setEditingAccount] = useState<SavedAccount | null>(null);
  const [isAddingNewSaved, setIsAddingNewSaved] = useState<boolean>(false);
  const [manageFormType, setManageFormType] = useState<'bank' | 'wallet'>('bank');
  const [manageFormName, setManageFormName] = useState<string>('');
  const [manageFormBank, setManageFormBank] = useState<string>('Commercial Bank of Ethiopia');
  const [manageFormAccountNo, setManageFormAccountNo] = useState<string>('');
  const [savedFilterType, setSavedFilterType] = useState<'all' | 'bank' | 'wallet'>('all');

  const filteredBanks = ETHIOPIAN_BANKS.filter(
    (b) =>
      b.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      (b.amharic && b.amharic.includes(bankSearchQuery)) ||
      (b.code && b.code.toLowerCase().includes(bankSearchQuery.toLowerCase()))
  );

  const handleSelectSavedAccount = (acc: SavedAccount) => {
    setSelectedBank(acc.bankName);
    setAccountNumber(acc.accountNumber);
    setRecipientName(acc.name);
    setErrorMessage(null);
    setStep('amount');
  };

  const handleNextFromBankSelect = () => {
    if (!accountNumber.trim() || accountNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid account number');
      return;
    }

    // Auto populate recipient name from saved accounts if matching
    const match = savedAccounts.find(
      (a) => a.accountNumber.trim() === accountNumber.trim()
    );

    if (match) {
      setRecipientName(match.name);
      setSelectedBank(match.bankName);
    } else {
      // Default placeholder name if not pre-saved
      setRecipientName(`Customer (${accountNumber.slice(-4)})`);
    }

    setErrorMessage(null);
    setStep('amount');
  };

  const handleKeypadPress = (digit: string) => {
    setErrorMessage(null);
    if (digit === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => (prev === '' ? '0.' : prev + '.'));
      }
      return;
    }

    if (amountStr.includes('.')) {
      const parts = amountStr.split('.');
      if (parts[1] && parts[1].length >= 2) return;
    }

    setAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleKeypadBackspace = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleProceedTransfer = () => {
    const parsed = parseFloat(amountStr);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMessage('Please enter a valid transfer amount');
      return;
    }
    if (parsed > balance) {
      setErrorMessage(`Insufficient balance. Current balance is ETB ${balance.toFixed(2)}`);
      return;
    }

    // Open PIN prompt modal
    setIsPinOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinOpen(false);
    // User requirement: "Before the receipt is displayed, it should prompt for a PIN, show a 'loading' screen for 5 seconds, and then display the receipt."
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      performTransfer({
        amount: parseFloat(amountStr),
        recipientName,
        recipientAccount: accountNumber,
        recipientBank: selectedBank,
        transactionType: (selectedBank.toLowerCase().includes('telebirr') || selectedBank.toLowerCase().includes('wallet')) ? 'Transfer to Wallet' : 'Transfer to Bank',
        notes: notes.trim() || undefined,
      });

      onSuccessTransfer();
    }, 5000);
  };

  // Manage Saved Accounts in "Hide Setting"
  const handleOpenAddSaved = (preferredType: 'bank' | 'wallet' = 'bank') => {
    setEditingAccount(null);
    setManageFormType(preferredType);
    setManageFormName('');
    setManageFormBank(preferredType === 'wallet' ? 'Telebirr' : (selectedBank || 'Commercial Bank of Ethiopia'));
    setManageFormAccountNo('');
    setIsAddingNewSaved(true);
  };

  const handleOpenEditSaved = (acc: SavedAccount) => {
    setEditingAccount(acc);
    setManageFormType(acc.type || (acc.bankName.toLowerCase().includes('telebirr') || acc.bankName.toLowerCase().includes('wallet') ? 'wallet' : 'bank'));
    setManageFormName(acc.name);
    setManageFormBank(acc.bankName);
    setManageFormAccountNo(acc.accountNumber);
    setIsAddingNewSaved(true);
  };

  const handleSaveAccountRecord = () => {
    if (!manageFormName.trim() || !manageFormAccountNo.trim()) return;

    if (editingAccount) {
      updateSavedAccount(editingAccount.id, {
        name: manageFormName,
        bankName: manageFormBank,
        accountNumber: manageFormAccountNo,
        type: manageFormType,
      });
    } else {
      addSavedAccount({
        name: manageFormName,
        bankName: manageFormBank,
        accountNumber: manageFormAccountNo,
        type: manageFormType,
      });
    }

    setIsAddingNewSaved(false);
    setEditingAccount(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] select-none" id="transfer-to-bank-screen">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={step === 'amount' ? () => setStep('bank_select') : onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-800">Transfer to Bank</h1>
        </div>

        {/* Hide Setting / Beneficiary Management Trigger */}
        <button
          type="button"
          id="btn-hide-setting"
          onClick={() => setIsHideSettingOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8cc73f]/15 hover:bg-[#8cc73f]/25 text-[#7ab034] text-xs font-bold transition-all cursor-pointer"
          title="Beneficiary Management / Hide Setting"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Hide Setting</span>
        </button>
      </header>

      {step === 'bank_select' ? (
        /* STEP 1: Choose Bank, Account No & Recents (Screenshot 9) */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top Promo Banner */}
          <div className="w-full h-24 rounded-xl overflow-hidden shadow-2xs border border-slate-100 bg-emerald-50">
            <img
              src="/images/banner-1.jpg"
              alt="TelePlay Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-4">
            {/* Select Bank Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Select Bank</label>
              <button
                type="button"
                id="btn-select-bank-dropdown"
                onClick={() => setIsChooseBankOpen(true)}
                className="w-full flex items-center justify-between border border-slate-200 hover:border-[#8cc73f] rounded-xl px-3 py-3 bg-white text-left transition-all cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 truncate mr-2">
                  {selectedBank || 'Please Choose'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Account No Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Account No</label>
              <div className="flex items-center border border-[#8cc73f] focus-within:ring-1 focus-within:ring-[#8cc73f] rounded-xl px-3 py-2.5 bg-white shadow-2xs">
                <input
                  type="text"
                  id="input-bank-account-no"
                  value={accountNumber}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setAccountNumber(e.target.value.replace(/[^0-9]/g, ''));
                  }}
                  placeholder="Enter recipient bank account number"
                  className="w-full text-xs font-bold text-slate-800 outline-hidden font-mono tracking-wider"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-500">{errorMessage}</p>
            )}

            {/* Next Button */}
            <button
              type="button"
              id="btn-transfer-bank-next"
              onClick={handleNextFromBankSelect}
              className="w-full py-3 bg-[#8cc73f] hover:bg-[#7cb634] active:scale-99 text-white font-bold rounded-xl shadow-xs transition-all text-sm cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Recent Accounts (Screenshot 9) */}
          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-700">Recent</h3>
                <button
                  type="button"
                  id="btn-toggle-saved-accounts"
                  onClick={() => setIsRecentVisible(!isRecentVisible)}
                  className="p-1 text-slate-500 hover:text-slate-800 transition-colors rounded-md hover:bg-slate-100 cursor-pointer"
                  title={isRecentVisible ? 'Hide saved accounts' : 'Show saved accounts'}
                >
                  {isRecentVisible ? (
                    <Eye className="w-4 h-4 text-[#8cc73f]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsHideSettingOpen(true)}
                  className="text-[11px] font-bold text-[#7ab034] hover:underline"
                >
                  Manage
                </button>
                <Trash2 className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {isRecentVisible ? (
              <div className="divide-y divide-slate-100">
                {savedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectSavedAccount(acc)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#8cc73f]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{acc.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {acc.bankName} <span className="font-mono">({acc.accountNumber})</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm font-bold">›</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center text-xs text-slate-400 font-medium">
                Saved accounts are hidden. Tap the eye icon above to show.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 2: Amount & Keypad with Purple Top Card (Screenshot 5) */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#f5f5f5]">
          <div className="p-4 space-y-3 overflow-y-auto">
            {/* Purple Beneficiary Card (Screenshot 5) */}
            <div className="bg-[#6b528e] text-white rounded-2xl p-4 shadow-md flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#8cc73f] shadow-inner shrink-0">
                <CreditCard className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-extrabold uppercase tracking-wide truncate">
                  {recipientName}
                </h3>
                <p className="text-xs text-white/80 truncate font-mono">
                  {selectedBank} ({accountNumber})
                </p>
              </div>
            </div>

            {/* Amount Card (Screenshot 5) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Amount</span>
                <span className="text-xs text-slate-400">
                  Balance: <strong className="text-slate-700 font-mono">{balance.toFixed(2)}</strong>(ETB)
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b-2 border-[#8cc73f] pb-2 pt-1">
                <div className="flex items-center text-2xl font-extrabold text-slate-900 min-h-[36px]">
                  {amountStr || <span className="text-slate-300">0.00</span>}
                  <span className="w-0.5 h-6 bg-[#8cc73f] ml-1 animate-pulse" />
                </div>
                <span className="text-sm font-bold text-slate-800">(ETB)</span>
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes(optional)"
                  className="w-full text-xs text-slate-700 placeholder-slate-400 outline-hidden"
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-500 pt-1">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* Numeric Keypad with Transfer Button (Screenshot 5) */}
          <div className="bg-white border-t border-slate-200 p-3 shadow-lg">
            <div className="grid grid-cols-4 gap-2 max-w-[380px] mx-auto">
              {/* Row 1 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('1')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('2')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('3')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                3
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="h-12 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>

              {/* Row 2 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('4')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('5')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('6')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                6
              </button>

              {/* Transfer button spanning 3 rows on the right */}
              <button
                type="button"
                id="btn-keypad-transfer"
                onClick={handleProceedTransfer}
                className="row-span-3 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] active:scale-98 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center transition-all p-1 text-center"
              >
                Transfer
              </button>

              {/* Row 3 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('7')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('8')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('9')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                9
              </button>

              {/* Row 4 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="col-span-2 h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-lg font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('.')}
                className="h-12 rounded-xl bg-slate-50 active:bg-slate-200 text-xl font-bold text-slate-800 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                .
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHOOSE BANK MODAL (Screenshot 6) */}
      {isChooseBankOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none">
          <div className="w-full sm:max-w-md h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Choose Bank</h3>
              <button
                type="button"
                onClick={() => setIsChooseBankOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 pb-2">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 text-xs">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  placeholder="Search Bank"
                  className="w-full bg-transparent outline-hidden text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Bank Grid */}
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredBanks.map((bank) => {
                  const isSelected = selectedBank === bank.name;
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBank(bank.name);
                        setIsChooseBankOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#8cc73f] bg-emerald-50/50 ring-1 ring-[#8cc73f]'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${bank.color} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                        {bank.code.slice(0, 3)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {bank.name}
                        </p>
                        {bank.amharic && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {bank.amharic}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HIDE SETTING FOR SAVED ACCOUNTS MODAL */}
      {isHideSettingOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs select-none">
          <div className="w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#8cc73f] flex items-center justify-center text-white">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Hide Setting - Saved Accounts</h3>
                  <p className="text-[11px] text-slate-300">
                    Beneficiary auto-populate configuration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsHideSettingOpen(false);
                  setIsAddingNewSaved(false);
                }}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isAddingNewSaved ? (
                /* Add / Edit Form */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      {editingAccount ? 'Edit Saved Beneficiary' : 'Add New Beneficiary'}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#8cc73f]/15 text-[#7ab034]">
                      {manageFormType === 'wallet' ? 'Other Wallet' : 'Other Bank'}
                    </span>
                  </div>

                  {/* Type Selector: Other Bank vs Other Wallet */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setManageFormType('bank');
                          if (manageFormBank === 'Telebirr') {
                            setManageFormBank('Commercial Bank of Ethiopia');
                          }
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          manageFormType === 'bank'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Other Bank
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setManageFormType('wallet');
                          setManageFormBank('Telebirr');
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          manageFormType === 'wallet'
                            ? 'bg-[#8cc73f] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Other Wallet
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={manageFormName}
                      onChange={(e) => setManageFormName(e.target.value)}
                      placeholder="NAME"
                      className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      {manageFormType === 'wallet' ? 'Wallet Provider' : 'Bank Name'}
                    </label>
                    {manageFormType === 'wallet' ? (
                      <select
                        value={manageFormBank}
                        onChange={(e) => setManageFormBank(e.target.value)}
                        className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                      >
                        {POPULAR_WALLETS.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={manageFormBank}
                        onChange={(e) => setManageFormBank(e.target.value)}
                        className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                      >
                        {ETHIOPIAN_BANKS.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      {manageFormType === 'wallet' ? 'PHONE NUMBER / ACCOUNT' : 'ACCOUNT'}
                    </label>
                    <input
                      type="text"
                      value={manageFormAccountNo}
                      onChange={(e) => setManageFormAccountNo(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={manageFormType === 'wallet' ? '09xxxxxxxx (Telebirr Number)' : 'ACCOUNT'}
                      className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewSaved(false)}
                      className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAccountRecord}
                      className="flex-1 py-2 rounded-lg bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Save Account
                    </button>
                  </div>
                </div>
              ) : (
                /* List of saved accounts */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Saved Beneficiaries ({savedAccounts.length})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAddSaved('bank')}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#8cc73f] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bank</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSaved('wallet')}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Wallet</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter tabs: All / Other Bank / Other Wallet */}
                  <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSavedFilterType('all')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        savedFilterType === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      All ({savedAccounts.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavedFilterType('bank')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        savedFilterType === 'bank'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Other Bank ({savedAccounts.filter((a) => a.type !== 'wallet').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavedFilterType('wallet')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        savedFilterType === 'wallet'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Other Wallet ({savedAccounts.filter((a) => a.type === 'wallet').length})
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    Accounts saved here persist in your local storage. When selected on the transfer page, the recipient's name and details are automatically populated.
                  </p>

                  <div className="space-y-2">
                    {savedAccounts
                      .filter((acc) => {
                        if (savedFilterType === 'bank') return acc.type !== 'wallet';
                        if (savedFilterType === 'wallet') return acc.type === 'wallet';
                        return true;
                      })
                      .map((acc) => (
                      <div
                        key={acc.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between"
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900">{acc.name}</p>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                acc.type === 'wallet'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {acc.type === 'wallet' ? 'Other Wallet' : 'Other Bank'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{acc.bankName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{acc.accountNumber}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectSavedAccount(acc);
                              setIsHideSettingOpen(false);
                            }}
                            className="px-2.5 py-1 bg-[#8cc73f] hover:bg-[#7cb634] text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-2xs"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditSaved(acc)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSavedAccount(acc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setIsHideSettingOpen(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Prompt Modal */}
      <PinPromptModal
        isOpen={isPinOpen}
        onClose={() => setIsPinOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* 5-Second Loading Animation Overlay */}
      <TelebirrLoading isLoading={isLoading} variant="fullscreen" />
    </div>
  );
};
