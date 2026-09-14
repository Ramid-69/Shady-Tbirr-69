import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  UserSquare2,
  Trash2,
  Edit2,
  Plus,
  X,
  User,
  CheckCircle2,
  ChevronRight,
  Wallet,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PinPromptModal } from '../components/PinPromptModal';
import { TelebirrLoading } from '../components/TelebirrLoading';
import { SavedAccount } from '../types';

interface SendMoneyScreenProps {
  onBack: () => void;
  onSuccessTransfer: () => void;
}

const normalizePhone = (p: string): string => {
  return p.replace(/[\s\-\+]/g, '').replace(/^251/, '').replace(/^0/, '');
};

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({
  onBack,
  onSuccessTransfer,
}) => {
  const {
    balance,
    recentContacts,
    deleteRecentContact,
    performTransfer,
    addRecentContact,
    savedAccounts,
    addSavedAccount,
    updateSavedAccount,
    deleteSavedAccount,
  } = useApp();

  const [step, setStep] = useState<'input' | 'amount'>('input');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [saveThisBeneficiary, setSaveThisBeneficiary] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{
    name: string;
    phoneNumber: string;
  } | null>(null);

  const [amountStr, setAmountStr] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saveAsWallet, setSaveAsWallet] = useState<boolean>(false);
  const [isPinOpen, setIsPinOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Show/Hide (Unshow) toggle state for saved accounts and recents
  const [isSavedVisible, setIsSavedVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('telebirr_saved_wallets_visible');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isRecentVisible, setIsRecentVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('telebirr_recent_wallets_visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSavedVisible = () => {
    setIsSavedVisible((prev) => {
      const next = !prev;
      localStorage.setItem('telebirr_saved_wallets_visible', JSON.stringify(next));
      return next;
    });
  };

  const toggleRecentVisible = () => {
    setIsRecentVisible((prev) => {
      const next = !prev;
      localStorage.setItem('telebirr_recent_wallets_visible', JSON.stringify(next));
      return next;
    });
  };

  // Beneficiary Management Modal state
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState<boolean>(false);
  const [isAddingNewSaved, setIsAddingNewSaved] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<SavedAccount | null>(null);
  const [modalFormName, setModalFormName] = useState<string>('');
  const [modalFormPhone, setModalFormPhone] = useState<string>('');

  // Filter saved accounts that are wallets or Telebirr
  const savedWallets = useMemo(() => {
    return savedAccounts.filter(
      (a) =>
        a.type === 'wallet' ||
        a.bankName.toLowerCase().includes('telebirr') ||
        a.bankName.toLowerCase().includes('wallet')
    );
  }, [savedAccounts]);

  // Live match when typing phone number
  const matchedBeneficiary = useMemo(() => {
    const clean = normalizePhone(phoneNumber);
    if (clean.length < 6) return null;
    return savedWallets.find((w) => {
      const wClean = normalizePhone(w.accountNumber);
      return wClean === clean || wClean.endsWith(clean) || clean.endsWith(wClean);
    }) || null;
  }, [phoneNumber, savedWallets]);

  // Handle phone change
  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    setPhoneNumber(numeric);
    setErrorMessage(null);

    const clean = normalizePhone(numeric);
    if (clean.length >= 6) {
      const match = savedWallets.find((w) => {
        const wClean = normalizePhone(w.accountNumber);
        return wClean === clean || wClean.endsWith(clean) || clean.endsWith(wClean);
      });
      if (match) {
        setRecipientName(match.name);
      }
    }
  };

  const handleSelectSavedWallet = (wallet: SavedAccount) => {
    setSelectedRecipient({
      name: wallet.name,
      phoneNumber: wallet.accountNumber,
    });
    setPhoneNumber(wallet.accountNumber.replace('+251', '').replace(/^0/, ''));
    setRecipientName(wallet.name);
    setStep('amount');
    setAmountStr('');
    setErrorMessage(null);
    setIsBeneficiaryModalOpen(false);
  };

  const handleSelectRecent = (contact: { name: string; phoneNumber: string }) => {
    setSelectedRecipient(contact);
    setPhoneNumber(contact.phoneNumber.replace('+251', '').replace(/^0/, ''));
    setRecipientName(contact.name);
    setStep('amount');
    setAmountStr('');
    setErrorMessage(null);
  };

  const handleNextFromInput = () => {
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }

    const cleanNorm = normalizePhone(cleanPhone);
    const foundSaved = savedWallets.find((w) => {
      const wClean = normalizePhone(w.accountNumber);
      return wClean === cleanNorm || wClean.endsWith(cleanNorm) || cleanNorm.endsWith(wClean);
    });

    const foundRecent = recentContacts.find(
      (c) =>
        normalizePhone(c.phoneNumber) === cleanNorm ||
        cleanPhone.includes(c.phoneNumber.replace('+251', ''))
    );

    const finalName =
      recipientName.trim() ||
      (foundSaved ? foundSaved.name : (foundRecent ? foundRecent.name : `Customer (0${cleanNorm.slice(-4)})`));

    const formattedPhone = cleanPhone.startsWith('0')
      ? cleanPhone
      : cleanPhone.startsWith('251')
      ? `+${cleanPhone}`
      : `0${cleanPhone}`;

    const recipient = {
      name: finalName,
      phoneNumber: formattedPhone,
    };

    if (saveThisBeneficiary) {
      addSavedAccount({
        name: finalName,
        bankName: 'Telebirr',
        accountNumber: formattedPhone,
        type: 'wallet',
      });
    }

    setSelectedRecipient(recipient);
    setStep('amount');
    setAmountStr('');
    setErrorMessage(null);
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
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount');
      return;
    }
    if (parsedAmount > balance) {
      setErrorMessage(`Insufficient balance. Current balance is ETB ${balance.toFixed(2)}`);
      return;
    }

    setIsPinOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinOpen(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRecipient) {
        addRecentContact({
          name: selectedRecipient.name,
          phoneNumber: selectedRecipient.phoneNumber,
        });

        if (saveAsWallet || saveThisBeneficiary) {
          addSavedAccount({
            name: selectedRecipient.name,
            bankName: 'Telebirr',
            accountNumber: selectedRecipient.phoneNumber,
            type: 'wallet',
          });
        }

        performTransfer({
          amount: parseFloat(amountStr),
          recipientName: selectedRecipient.name,
          recipientAccount: selectedRecipient.phoneNumber,
          recipientBank: 'Telebirr',
          transactionType: 'Transfer Money',
          notes: notes.trim() || undefined,
        });

        onSuccessTransfer();
      }
    }, 5000);
  };

  // Modal open handlers
  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setModalFormName('');
    setModalFormPhone('');
    setIsAddingNewSaved(true);
    setIsBeneficiaryModalOpen(true);
  };

  const handleOpenEditModal = (acc: SavedAccount) => {
    setEditingAccount(acc);
    setModalFormName(acc.name);
    setModalFormPhone(acc.accountNumber);
    setIsAddingNewSaved(true);
  };

  const handleSaveModalAccount = () => {
    if (!modalFormName.trim() || !modalFormPhone.trim()) return;

    const formattedPhone = modalFormPhone.startsWith('0')
      ? modalFormPhone
      : modalFormPhone.startsWith('251')
      ? `+${modalFormPhone}`
      : `0${modalFormPhone}`;

    if (editingAccount) {
      updateSavedAccount(editingAccount.id, {
        name: modalFormName.trim(),
        bankName: 'Telebirr',
        accountNumber: formattedPhone.trim(),
        type: 'wallet',
      });
    } else {
      addSavedAccount({
        name: modalFormName.trim(),
        bankName: 'Telebirr',
        accountNumber: formattedPhone.trim(),
        type: 'wallet',
      });
    }

    setIsAddingNewSaved(false);
    setEditingAccount(null);
    setModalFormName('');
    setModalFormPhone('');
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] select-none" id="send-money-screen">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={step === 'amount' ? () => setStep('input') : onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-800">
            {step === 'input' ? 'Send Money to Individual' : 'Send Money'}
          </h1>
        </div>

        {/* Top Right Beneficiaries Button (Like Hide Setting in Transfer to Bank) */}
        {step === 'input' && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNewSaved(false);
              setIsBeneficiaryModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/70 text-xs font-bold transition-all cursor-pointer"
          >
            <UserSquare2 className="w-3.5 h-3.5 text-[#8cc73f]" />
            <span>Beneficiaries</span>
            <span className="bg-[#8cc73f] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {savedWallets.length}
            </span>
          </button>
        )}
      </header>

      {step === 'input' ? (
        /* STEP 1: Enter Mobile Number, Name & Beneficiaries */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Promo banner */}
          <div className="w-full h-24 rounded-xl overflow-hidden shadow-2xs border border-slate-100 bg-emerald-50">
            <img
              src="/images/banner-2.jpg"
              alt="TelePlay Promotion"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700">
                Please Enter Mobile Number
              </h2>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="text-[11px] font-bold text-[#8cc73f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Save New</span>
              </button>
            </div>

            {/* Mobile Number Input with Country Code */}
            <div className="flex items-center border border-[#8cc73f] rounded-xl px-3 py-2.5 bg-white shadow-2xs">
              <span className="text-sm font-bold text-slate-800 mr-2 select-none">
                +251
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full text-sm font-semibold text-slate-800 outline-hidden tracking-wide"
                autoFocus
              />
              <div className="flex items-center gap-2 text-[#8cc73f]">
                <button
                  type="button"
                  onClick={() => setIsBeneficiaryModalOpen(true)}
                  className="p-1 hover:text-emerald-700 cursor-pointer"
                  title="Open Saved Beneficiaries"
                >
                  <UserSquare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Matched Beneficiary Indicator if phone matches */}
            {matchedBeneficiary && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8cc73f] shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[11px]">Saved Beneficiary: </span>
                    <strong className="text-slate-900 font-bold">{matchedBeneficiary.name}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
                  Telebirr
                </span>
              </div>
            )}

            {/* Recipient Name Input (Editable / Auto-filled) */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Recipient Name (NAME)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="NAME (e.g. Abebe Kebede)"
                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 focus:border-[#8cc73f] rounded-xl px-3 py-2.5 outline-hidden bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Save Beneficiary Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={saveThisBeneficiary}
                  onChange={(e) => setSaveThisBeneficiary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8cc73f] accent-[#8cc73f] cursor-pointer"
                />
                <span>Save this account to Telebirr Beneficiaries</span>
              </label>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-500">{errorMessage}</p>
            )}

            <button
              type="button"
              id="btn-send-money-next"
              onClick={handleNextFromInput}
              className="w-full py-3 bg-[#0287d0] hover:bg-[#0275b5] active:scale-99 text-white font-bold rounded-xl shadow-xs transition-all text-sm cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Saved Telebirr Beneficiaries (Full System like Other Bank) */}
          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  <Wallet className="w-3.5 h-3.5 text-[#8cc73f]" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  Saved Telebirr Accounts
                </h3>
                <button
                  type="button"
                  id="btn-toggle-saved-wallets"
                  onClick={toggleSavedVisible}
                  className="p-1 text-slate-500 hover:text-slate-800 transition-colors rounded-md hover:bg-slate-100 cursor-pointer"
                  title={isSavedVisible ? 'Hide saved accounts' : 'Show saved accounts'}
                >
                  {isSavedVisible ? (
                    <Eye className="w-4 h-4 text-[#8cc73f]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                  {savedWallets.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewSaved(false);
                    setIsBeneficiaryModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#7ab034] hover:underline cursor-pointer"
                >
                  Manage
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#8cc73f] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {!isSavedVisible ? (
              <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-300" />
                <span>Saved Telebirr accounts hidden</span>
                <button
                  type="button"
                  onClick={toggleSavedVisible}
                  className="text-[#8cc73f] font-bold hover:underline ml-1 cursor-pointer"
                >
                  Show
                </button>
              </div>
            ) : savedWallets.length === 0 ? (
              <div className="py-5 text-center text-slate-400 text-xs">
                <p>No saved Telebirr accounts yet.</p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="mt-2 text-[#8cc73f] font-bold hover:underline cursor-pointer"
                >
                  + Save your first Telebirr account
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    onClick={() => handleSelectSavedWallet(wallet)}
                    className="py-2.5 flex items-center justify-between hover:bg-emerald-50/50 rounded-xl px-2 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-full bg-[#8cc73f]/15 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200/50">
                        {wallet.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || 'TB'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {wallet.name}
                          </p>
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                            Telebirr
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {wallet.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSavedWallet(wallet);
                        }}
                        className="px-2.5 py-1 bg-[#8cc73f] hover:bg-[#7cb634] text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>Send</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSavedAccount(wallet.id);
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete saved account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Section */}
          {recentContacts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-600">Recent Transfers</h3>
                  <button
                    type="button"
                    id="btn-toggle-recent-contacts"
                    onClick={toggleRecentVisible}
                    className="p-1 text-slate-500 hover:text-slate-800 transition-colors rounded-md hover:bg-slate-100 cursor-pointer"
                    title={isRecentVisible ? 'Hide recent contacts' : 'Show recent contacts'}
                  >
                    {isRecentVisible ? (
                      <Eye className="w-4 h-4 text-[#8cc73f]" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <span className="text-slate-400 text-xs font-mono">
                  {recentContacts.length}
                </span>
              </div>

              {!isRecentVisible ? (
                <div className="py-3 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <EyeOff className="w-4 h-4 text-slate-300" />
                  <span>Recent transfers hidden</span>
                  <button
                    type="button"
                    onClick={toggleRecentVisible}
                    className="text-[#8cc73f] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Show
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleSelectRecent(contact)}
                      className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{contact.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {contact.phoneNumber}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecentContact(contact.id);
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* STEP 2: Amount & Keypad */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#f5f5f5]">
          <div className="p-4 space-y-3 overflow-y-auto">
            {/* Recipient Card (Yellow Avatar) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#fbbb47] flex items-center justify-center text-white shadow-inner">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedRecipient?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRecipient?.phoneNumber}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                telebirr
              </span>
            </div>

            {/* Amount Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Amount</span>
                <span className="text-xs text-slate-400">
                  Balance: <strong className="text-slate-700 font-mono">{balance.toFixed(2)}</strong> (ETB)
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

              {/* Option to save to Other Wallet / Telebirr */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveAsWallet}
                    onChange={(e) => setSaveAsWallet(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8cc73f] accent-[#8cc73f] cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    Save account as <strong className="text-emerald-700">Telebirr Beneficiary</strong>
                  </span>
                </label>
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-500 pt-1">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* Keypad & OK Button */}
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
                className="h-12 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs cursor-pointer flex items-center justify-center font-bold"
              >
                ⌫
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
              <button
                type="button"
                onClick={() => {
                  setAmountStr('');
                  setErrorMessage(null);
                }}
                className="h-12 rounded-xl bg-slate-100 active:bg-slate-200 text-xs font-bold text-slate-600 shadow-2xs cursor-pointer flex items-center justify-center"
              >
                Clear
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
              <button
                type="button"
                onClick={handleProceedTransfer}
                className="row-span-2 h-[104px] rounded-xl bg-[#0287d0] hover:bg-[#0275b5] active:scale-98 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center"
              >
                OK
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

      {/* Beneficiary Management Modal (Full system like Hide Setting in Other Bank) */}
      {isBeneficiaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserSquare2 className="w-4 h-4 text-[#8cc73f]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Telebirr Beneficiaries
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Saved accounts with Name & Phone Number
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBeneficiaryModalOpen(false);
                  setIsAddingNewSaved(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              {isAddingNewSaved ? (
                /* Add / Edit Form */
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {editingAccount ? 'Edit Telebirr Account' : 'Add Telebirr Account'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Telebirr
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={modalFormName}
                      onChange={(e) => setModalFormName(e.target.value)}
                      placeholder="NAME (e.g. Abebe Kebede)"
                      className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      PHONE NUMBER (ACCOUNT)
                    </label>
                    <input
                      type="tel"
                      value={modalFormPhone}
                      onChange={(e) => setModalFormPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="09xxxxxxxx (Telebirr Number)"
                      className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2.5 bg-white outline-hidden focus:border-[#8cc73f]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewSaved(false);
                        setEditingAccount(null);
                      }}
                      className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveModalAccount}
                      className="flex-1 py-2 rounded-lg bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Save Beneficiary
                    </button>
                  </div>
                </div>
              ) : (
                /* List of Saved Accounts */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Saved Accounts ({savedWallets.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAccount(null);
                        setModalFormName('');
                        setModalFormPhone('');
                        setIsAddingNewSaved(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#8cc73f] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Account</span>
                    </button>
                  </div>

                  {savedWallets.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                      <p>No saved Telebirr accounts found.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAccount(null);
                          setModalFormName('');
                          setModalFormPhone('');
                          setIsAddingNewSaved(true);
                        }}
                        className="px-3 py-1.5 bg-[#8cc73f] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + Add First Account
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedWallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between"
                        >
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-slate-900">{wallet.name}</p>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                                Telebirr
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {wallet.accountNumber}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectSavedWallet(wallet)}
                              className="px-2.5 py-1 bg-[#8cc73f] hover:bg-[#7cb634] text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-2xs flex items-center gap-1"
                            >
                              <span>Send</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(wallet)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSavedAccount(wallet.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Saved locally in Telebirr storage</span>
              <button
                type="button"
                onClick={() => {
                  setIsBeneficiaryModalOpen(false);
                  setIsAddingNewSaved(false);
                }}
                className="font-bold text-[#0287d0] hover:underline cursor-pointer"
              >
                Done
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
