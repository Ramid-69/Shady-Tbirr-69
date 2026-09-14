import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SavedAccount,
  RecentContact,
  TransactionRecord,
  TransferReceiptData,
  SmsMessage,
} from '../types';

interface AppContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  balance: number;
  rewardBalance: number;
  endekiseBalance: number;
  showBalance: boolean;
  showReward: boolean;
  showEndekise: boolean;
  savedAccounts: SavedAccount[];
  recentContacts: RecentContact[];
  transactions: TransactionRecord[];
  activeNotification: string | null;
  currentReceipt: TransferReceiptData | null;
  smsMessages: SmsMessage[];
  smsLanguage: 'en' | 'am';
  setSmsLanguage: (lang: 'en' | 'am') => void;
  addSmsMessage: (msg: Partial<SmsMessage>) => void;
  updateSmsMessage: (id: string, newBody: string) => void;
  deleteSmsMessage: (id: string) => void;
  clearSmsMessages: () => void;
  getReceiptByTxId: (txId: string) => TransferReceiptData | null;
  login: (pin: string) => boolean;
  logout: () => void;
  updateUser: (name: string, phoneNumber: string) => void;
  addBalance: (amount: number, title?: string) => void;
  setExactBalance: (amount: number) => void;
  setExactRewardBalance: (amount: number) => void;
  setExactEndekiseBalance: (amount: number) => void;
  toggleShowBalance: () => void;
  toggleShowReward: () => void;
  toggleShowEndekise: () => void;
  addSavedAccount: (data: { name: string; bankName: string; accountNumber: string; type?: 'bank' | 'wallet' }) => void;
  updateSavedAccount: (id: string, data: { name: string; bankName: string; accountNumber: string; type?: 'bank' | 'wallet' }) => void;
  deleteSavedAccount: (id: string) => void;
  addRecentContact: (data: { name: string; phoneNumber: string }) => void;
  deleteRecentContact: (id: string) => void;
  performTransfer: (params: {
    amount: number;
    recipientName: string;
    recipientAccount?: string;
    recipientBank?: string;
    transactionType?: string;
    notes?: string;
  }) => TransferReceiptData;
  dismissNotification: () => void;
  clearCurrentReceipt: () => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'AHMED HUSSEN SEID',
  phoneNumber: '+251969121369',
  level: 'Level 1',
  pin: '696969',
};

const DEFAULT_SAVED_ACCOUNTS: SavedAccount[] = [
  {
    id: 'sa-2',
    name: 'Mr Eshete Nigus Wase',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000701685877',
    createdAt: '2026-08-21',
    type: 'bank',
  },
  {
    id: 'sa-3',
    name: 'Mr Tamiru Gudina Bira',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000753652284',
    createdAt: '2026-08-22',
    type: 'bank',
  },
  {
    id: 'sa-4',
    name: 'Miss Roza Taha Neguma',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000581818568',
    createdAt: '2026-08-23',
    type: 'bank',
  },
  {
    id: 'sa-5',
    name: 'FIRAOL ENDALE WEKGARI',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000324197234',
    createdAt: '2026-08-24',
    type: 'bank',
  },
  {
    id: 'sa-w1',
    name: 'MOHAMMED YASIN',
    bankName: 'Telebirr',
    accountNumber: '0987654313',
    createdAt: '2026-08-25',
    type: 'wallet',
  },
];

const DEFAULT_SMS_MESSAGES: SmsMessage[] = [
  {
    id: 'sms-1',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n397885 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n397885 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:08 am',
    fullDateTime: '06/09/2026 01:08:21',
    type: 'verification',
  },
  {
    id: 'sms-2',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n995030 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n995030 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:09 am',
    fullDateTime: '06/09/2026 01:09:44',
    type: 'verification',
  },
  {
    id: 'sms-3',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n989437 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n989437 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:11 am',
    fullDateTime: '06/09/2026 01:11:15',
    type: 'verification',
  },
  {
    id: 'sms-4',
    sender: '127',
    simSlot: 1,
    bodyEn: `Sorry, your PIN or password is incorrect. please check and try again.\nFor any support and information related to telebirr service\nSend SMS to 126 or Contact us via Telegram: https://t.me/telebirr\nFacebook: https://facebook.com/telebirr or\nVisit our website :https://www.ethiotelecom.et/telebirr/`,
    bodyAm: `ይቅርታ ያስገቡት ፒን ወይም የይለፍ ቃል ትክክል አይደለም። እባክዎ አረጋግጠው በድጋሚ ይሞክሩ።\nስለ ቴሌብር አገልግሎት መረጃ እና ድጋፍ ለማግኘት\nበ 126 አጭር የጽሁፍ መልእክት ይላኩ ወይም በቴሌግራም ያግኙን: https://t.me/telebirr\nፌስቡክ: https://facebook.com/telebirr\nድረ-ገጻችንን ይጎብኙ :https://www.ethiotelecom.et/telebirr/`,
    timestamp: '1:14 am',
    fullDateTime: '06/09/2026 01:14:02',
    type: 'alert',
  },
  {
    id: 'sms-5',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear AHMED\nYou have successfully transferred 400.00 Br. from your Telebirr account 251969121369 to Commercial Bank of Ethiopia account number 1000440979843 on date 08/08/2026 12:41:51. Your telebirr transaction reference number is DH65MCW9BZ and your bank transaction reference number is FT662204KW9C. Service fee is 2.61 Br; Service fee 15% VAT is 0.39 Br. Your remaining balance is 4,098.57 Br. To get your payment information, click the link: https://transactioninfo.ethiotelecom.et/receipt/DH65MCW9BZ\nThank you for using Telebirr`,
    bodyAm: `ክቡር አህመድ\nከቴሌብር ሒሳብዎ 251969121369 ወደ የኢትዮጵያ ንግድ ባንክ ሒሳብ ቁጥር 1000440979843 በ 08/08/2026 12:41:51 400.00 ብር በተሳካ ሁኔታ አስተላልፈዋል። የቴሌብር መለያ ቁጥርዎ DH65MCW9BZ እና የባንክ መለያ ቁጥርዎ FT662204KW9C ነው። የአገልግሎት ክፍያ 2.61 ብር፤ የአገልግሎት ክፍያ 15% ቫት 0.39 ብር። ቀሪ ሒሳብዎ 4,098.57 ብር። የክፍያ መረጃዎን ለማግኘት ሊንኩን ይጫኑ: https://transactioninfo.ethiotelecom.et/receipt/DH65MCW9BZ\nቴሌብርን ስለተጠቀሙ እናመሰግናለን`,
    timestamp: '12:41 pm',
    fullDateTime: '08/08/2026 12:41:51',
    txId: 'DH65MCW9BZ',
    bankRef: 'FT662204KW9C',
    type: 'transfer_bank',
    amount: 400,
    recipientName: 'Commercial Bank of Ethiopia',
    recipientAccount: '1000440979843',
    recipientBank: 'Commercial Bank of Ethiopia',
    receiptUrl: 'https://transactioninfo.ethiotelecom.et/receipt/DH65MCW9BZ',
  },
];

const DEFAULT_RECENT_CONTACTS: RecentContact[] = [
  { id: 'rc-1', name: 'Fozia', phoneNumber: '+251911223344' },
  { id: 'rc-2', name: 'alemitu', phoneNumber: '251942589255' },
  { id: 'rc-3', name: 'Yohanis', phoneNumber: '+251922334455' },
  { id: 'rc-4', name: 'Mamo', phoneNumber: '+251933445566' },
  { id: 'rc-5', name: 'Mehammed', phoneNumber: '+251944556677' },
];

const DEFAULT_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-201',
    title: 'Transfer to Fozia',
    category: 'Transfer Money',
    amount: -2.0,
    date: '2026/08/26 18:13:57',
    type: 'debit',
    status: 'Completed',
    recipientName: 'Fozia',
    recipientAccount: '251911223344',
    txNumber: 'DHQ66R1WU0',
  },
  {
    id: 'tx-202',
    title: 'Bank Transfer (CBE)',
    category: 'Transfer to Bank',
    amount: -500.0,
    date: '2026/08/25 14:20:11',
    type: 'debit',
    status: 'Completed',
    recipientName: 'FOZIA MOSSA MOHAMMED',
    recipientAccount: '1000278947339',
    recipientBank: 'Commercial Bank of Ethiopia',
    txNumber: 'DHQ41N9ZP3',
  },
  {
    id: 'tx-203',
    title: 'Cash In / Deposit',
    category: 'Cash In',
    amount: 3000.0,
    date: '2026/08/24 09:45:00',
    type: 'credit',
    status: 'Completed',
    txNumber: 'DHQ18K5QL2',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('telebirr_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('telebirr_auth') === 'true';
  });

  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('telebirr_balance');
    return saved !== null ? parseFloat(saved) : 2485.5;
  });

  const [rewardBalance, setRewardBalance] = useState<number>(() => {
    const saved = localStorage.getItem('telebirr_reward');
    return saved !== null ? parseFloat(saved) : 45.5;
  });

  const [endekiseBalance, setEndekiseBalance] = useState<number>(() => {
    const saved = localStorage.getItem('telebirr_endekise');
    return saved !== null ? parseFloat(saved) : 120.0;
  });

  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showReward, setShowReward] = useState<boolean>(true);
  const [showEndekise, setShowEndekise] = useState<boolean>(true);

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    const saved = localStorage.getItem('telebirr_saved_accounts');
    if (saved) {
      try {
        const parsed: SavedAccount[] = JSON.parse(saved);
        return parsed.filter(
          (acc) =>
            !acc.name.toUpperCase().includes('FOZIA') &&
            !acc.accountNumber.includes('1000278947339')
        );
      } catch {
        return DEFAULT_SAVED_ACCOUNTS;
      }
    }
    return DEFAULT_SAVED_ACCOUNTS;
  });

  const [recentContacts, setRecentContacts] = useState<RecentContact[]>(() => {
    const saved = localStorage.getItem('telebirr_recent_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_RECENT_CONTACTS;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('telebirr_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<TransferReceiptData | null>(null);

  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(() => {
    const saved = localStorage.getItem('telebirr_sms_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SMS_MESSAGES;
      }
    }
    // Also preload receipt for default sample
    const sampleReceipt: TransferReceiptData = {
      amount: 400,
      currency: 'ETB',
      transactionTime: '08/08/2026 12:41:51',
      transactionType: 'Transfer to Bank',
      transactionTo: 'Commercial Bank of Ethiopia',
      recipientAccount: '1000440979843',
      recipientBank: 'Commercial Bank of Ethiopia',
      transactionNumber: 'DH65MCW9BZ',
      bankRefNumber: 'FT662204KW9C',
      serviceFee: 2.61,
      vatFee: 0.39,
      payerName: 'AHMED HUSSEN SEID',
      payerPhone: '251969121369',
      remainingBalance: 4098.57,
    };
    try {
      localStorage.setItem('telebirr_receipt_DH65MCW9BZ', JSON.stringify(sampleReceipt));
    } catch {
      // ignore
    }
    return DEFAULT_SMS_MESSAGES;
  });

  const [smsLanguage, setSmsLanguage] = useState<'en' | 'am'>(() => {
    const saved = localStorage.getItem('telebirr_sms_lang');
    return saved === 'am' ? 'am' : 'en';
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('telebirr_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('telebirr_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('telebirr_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('telebirr_reward', rewardBalance.toString());
  }, [rewardBalance]);

  useEffect(() => {
    localStorage.setItem('telebirr_endekise', endekiseBalance.toString());
  }, [endekiseBalance]);

  useEffect(() => {
    localStorage.setItem('telebirr_saved_accounts', JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  useEffect(() => {
    localStorage.setItem('telebirr_recent_contacts', JSON.stringify(recentContacts));
  }, [recentContacts]);

  useEffect(() => {
    localStorage.setItem('telebirr_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('telebirr_sms_messages', JSON.stringify(smsMessages));
  }, [smsMessages]);

  useEffect(() => {
    localStorage.setItem('telebirr_sms_lang', smsLanguage);
  }, [smsLanguage]);

  const login = (pin: string): boolean => {
    if (pin === '696969') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = (name: string, phoneNumber: string) => {
    setUser((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      phoneNumber: phoneNumber.trim() || prev.phoneNumber,
    }));
  };

  const addSmsMessage = (msg: Partial<SmsMessage>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const newMsg: SmsMessage = {
      id: `sms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: msg.sender || '127',
      simSlot: msg.simSlot || 1,
      bodyEn: msg.bodyEn || '',
      bodyAm: msg.bodyAm || msg.bodyEn || '',
      timestamp: msg.timestamp || timeStr,
      fullDateTime: msg.fullDateTime || `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`,
      txId: msg.txId,
      bankRef: msg.bankRef,
      type: msg.type || 'alert',
      amount: msg.amount,
      recipientName: msg.recipientName,
      recipientAccount: msg.recipientAccount,
      recipientBank: msg.recipientBank,
      receiptUrl: msg.receiptUrl || (msg.txId ? `https://transactioninfo.ethiotelecom.et/receipt/${msg.txId}` : undefined),
    };

    setSmsMessages((prev) => [...prev, newMsg]);
  };

  const updateSmsMessage = (id: string, newBody: string) => {
    setSmsMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              bodyEn: newBody,
              bodyAm: newBody,
            }
          : m
      )
    );
  };

  const deleteSmsMessage = (id: string) => {
    setSmsMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const clearSmsMessages = () => {
    setSmsMessages([]);
  };

  const getReceiptByTxId = (txId: string): TransferReceiptData | null => {
    const cached = localStorage.getItem(`telebirr_receipt_${txId}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    // Search in current receipt or transactions
    if (currentReceipt && currentReceipt.transactionNumber === txId) {
      return currentReceipt;
    }
    const foundTx = transactions.find((t) => t.txNumber === txId);
    if (foundTx) {
      return {
        amount: Math.abs(foundTx.amount),
        currency: 'ETB',
        transactionTime: foundTx.date,
        transactionType: foundTx.category,
        transactionTo: foundTx.recipientName || foundTx.title,
        recipientAccount: foundTx.recipientAccount,
        recipientBank: foundTx.recipientBank,
        transactionNumber: txId,
        payerName: user.name,
        payerPhone: user.phoneNumber,
        remainingBalance: balance,
      };
    }
    return null;
  };

  const addBalance = (amount: number, title: string = 'Cash In / Deposit') => {
    if (isNaN(amount) || amount <= 0) return;
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const formattedDate = `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
    const formattedFullDate = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const txId = 'DFT' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      title,
      category: 'Cash In',
      amount,
      date: formattedDate,
      type: 'credit',
      status: 'Completed',
      txNumber: txId,
    };

    const newBalance = balance + amount;
    setBalance(newBalance);
    setTransactions((prev) => [newTx, ...prev]);

    const firstName = user.name.split(' ')[0] || user.name;
    const bodyEn = `Dear ${firstName}\nYou have received ${amount.toFixed(2)} Br. from Ethio telecom / Deposit (${user.phoneNumber.replace('+', '')}) on ${formattedFullDate}. Your transaction reference number is ${txId}. Your current balance is ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Br.\nThank you for using Telebirr\nEthio telecom`;
    const bodyAm = `ክቡር ${firstName}\nበ ${formattedFullDate} ${amount.toFixed(2)} ብር ከ ኢትዮ ቴሌኮም ገቢ ተደርጓል። የመለያ ቁጥርዎ ${txId} ነው። አሁን ያለዎት ሒሳብ ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ብር ነው።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን\nኢትዮ ቴሌኮም`;

    // Add SMS message for deposit
    addSmsMessage({
      bodyEn,
      bodyAm,
      timestamp: timeStr,
      fullDateTime: formattedFullDate,
      txId,
      type: 'deposit',
      amount,
    });

    // Save receipt for this deposit
    const depositReceipt: TransferReceiptData = {
      amount,
      currency: 'ETB',
      transactionTime: formattedFullDate,
      transactionType: 'Cash In / Deposit',
      transactionTo: user.name,
      recipientAccount: user.phoneNumber,
      transactionNumber: txId,
      payerName: 'Ethio telecom',
      payerPhone: '127',
      remainingBalance: newBalance,
    };
    try {
      localStorage.setItem(`telebirr_receipt_${txId}`, JSON.stringify(depositReceipt));
    } catch {
      // ignore
    }

    // Show notification for 5 seconds
    setActiveNotification(
      `Dear ${user.name}, you have received ETB ${amount.toFixed(2)}. Current balance: ETB ${newBalance.toFixed(2)}.`
    );
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  };

  const setExactBalance = (amount: number) => {
    if (!isNaN(amount) && amount >= 0) {
      setBalance(amount);
    }
  };

  const setExactRewardBalance = (amount: number) => {
    if (!isNaN(amount) && amount >= 0) {
      setRewardBalance(amount);
    }
  };

  const setExactEndekiseBalance = (amount: number) => {
    if (!isNaN(amount) && amount >= 0) {
      setEndekiseBalance(amount);
    }
  };

  const toggleShowBalance = () => setShowBalance((prev) => !prev);
  const toggleShowReward = () => setShowReward((prev) => !prev);
  const toggleShowEndekise = () => setShowEndekise((prev) => !prev);

  const addSavedAccount = (data: {
    name: string;
    bankName: string;
    accountNumber: string;
    type?: 'bank' | 'wallet';
  }) => {
    const accType = data.type || (data.bankName.toLowerCase().includes('telebirr') || data.bankName.toLowerCase().includes('wallet') ? 'wallet' : 'bank');
    const newAccount: SavedAccount = {
      id: `sa-${Date.now()}`,
      name: data.name.trim(),
      bankName: data.bankName.trim(),
      accountNumber: data.accountNumber.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      type: accType,
    };
    setSavedAccounts((prev) => {
      const matchIdx = prev.findIndex(
        (a) => a.accountNumber.trim() === data.accountNumber.trim()
      );
      if (matchIdx !== -1) {
        const updated = [...prev];
        updated[matchIdx] = {
          ...updated[matchIdx],
          name: data.name.trim(),
          bankName: data.bankName.trim(),
          type: accType,
        };
        return updated;
      }
      return [newAccount, ...prev];
    });
  };

  const updateSavedAccount = (
    id: string,
    data: { name: string; bankName: string; accountNumber: string; type?: 'bank' | 'wallet' }
  ) => {
    setSavedAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              name: data.name.trim() || acc.name,
              bankName: data.bankName.trim() || acc.bankName,
              accountNumber: data.accountNumber.trim() || acc.accountNumber,
              type: data.type || acc.type || 'bank',
            }
          : acc
      )
    );
  };

  const deleteSavedAccount = (id: string) => {
    setSavedAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const addRecentContact = (data: { name: string; phoneNumber: string }) => {
    const existingIndex = recentContacts.findIndex(
      (c) => c.phoneNumber === data.phoneNumber.trim()
    );
    if (existingIndex >= 0) {
      // Move to top
      const updated = [...recentContacts];
      const [item] = updated.splice(existingIndex, 1);
      setRecentContacts([item, ...updated]);
    } else {
      const newContact: RecentContact = {
        id: `rc-${Date.now()}`,
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
      };
      setRecentContacts((prev) => [newContact, ...prev]);
    }
  };

  const deleteRecentContact = (id: string) => {
    setRecentContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const performTransfer = ({
    amount,
    recipientName,
    recipientAccount,
    recipientBank,
    transactionType = 'Transfer Money',
    notes,
  }: {
    amount: number;
    recipientName: string;
    recipientAccount?: string;
    recipientBank?: string;
    transactionType?: string;
    notes?: string;
  }): TransferReceiptData => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const formattedDate = `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
    const formattedFullDate = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const txId = 'DH' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const bankRef = recipientBank
      ? 'FT' + Math.random().toString(36).substring(2, 12).toUpperCase()
      : undefined;

    const isBank = Boolean(recipientBank);
    const serviceFee = isBank ? 2.61 : (amount > 100 ? 1.74 : 0);
    const vatFee = isBank ? 0.39 : (amount > 100 ? 0.26 : 0);

    const newBalance = Math.max(0, balance - amount);
    setBalance(newBalance);

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      title: recipientBank
        ? `Bank Transfer (${recipientBank})`
        : `Transfer to ${recipientName}`,
      category: recipientBank ? 'Transfer to Bank' : 'Transfer Money',
      amount: -Math.abs(amount),
      date: formattedDate,
      type: 'debit',
      status: 'Completed',
      recipientName,
      recipientAccount,
      recipientBank,
      txNumber: txId,
      notes,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const receipt: TransferReceiptData = {
      amount,
      currency: 'ETB',
      transactionTime: formattedFullDate,
      transactionType,
      transactionTo: recipientName,
      recipientAccount,
      recipientBank,
      transactionNumber: txId,
      bankRefNumber: bankRef,
      serviceFee,
      vatFee,
      payerName: user.name,
      payerPhone: user.phoneNumber,
      remainingBalance: newBalance,
    };

    setCurrentReceipt(receipt);

    // Save official receipt to localStorage
    try {
      localStorage.setItem(`telebirr_receipt_${txId}`, JSON.stringify(receipt));
    } catch {
      // ignore
    }

    const firstName = user.name.split(' ')[0] || user.name;
    const cleanUserPhone = user.phoneNumber.replace('+', '');
    const receiptUrl = `https://transactioninfo.ethiotelecom.et/receipt/${txId}`;

    let bodyEn = '';
    let bodyAm = '';

    if (isBank) {
      // Transfer to Bank message template
      bodyEn = `Dear ${firstName}\nYou have successfully transferred ${amount.toFixed(2)} Br. from your Telebirr account ${cleanUserPhone} to ${recipientBank} account number ${recipientAccount || ''} on date ${formattedFullDate}. Your telebirr transaction reference number is ${txId} and your bank transaction reference number is ${bankRef}. Service fee is ${serviceFee.toFixed(2)} Br; Service fee 15% VAT is ${vatFee.toFixed(2)} Br. Your remaining balance is ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Br. To get your payment information, click the link: ${receiptUrl}\nThank you for using Telebirr`;

      bodyAm = `ክቡር ${firstName}\nከቴሌብር ሒሳብዎ ${cleanUserPhone} ወደ ${recipientBank} ሒሳብ ቁጥር ${recipientAccount || ''} በ ${formattedFullDate} ${amount.toFixed(2)} ብር በተሳካ ሁኔታ አስተላልፈዋል። የቴሌብር መለያ ቁጥርዎ ${txId} እና የባንክ መለያ ቁጥርዎ ${bankRef} ነው። የአገልግሎት ክፍያ ${serviceFee.toFixed(2)} ብር፤ የአገልግሎት ክፍያ 15% ቫት ${vatFee.toFixed(2)} ብር። ቀሪ ሒሳብዎ ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ብር። የክፍያ መረጃዎን ለማግኘት ሊንኩን ይጫኑ: ${receiptUrl}\nቴሌብርን ስለተጠቀሙ እናመሰግናለን`;
    } else {
      // Transfer to Telebirr message template
      bodyEn = `Dear ${firstName}\nYou have sent ${amount.toFixed(2)} Br. to ${recipientName} (${recipientAccount || ''}) on ${formattedFullDate}. Your transaction reference number is ${txId}. Service fee is ${serviceFee.toFixed(2)} Br; Service fee 15% VAT is ${vatFee.toFixed(2)} Br. Your current balance is ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Br. To get your payment information, click the link: ${receiptUrl}\nThank you for using Telebirr\nEthio telecom`;

      bodyAm = `ክቡር ${firstName}\nበ ${formattedFullDate} ወደ ${recipientName} (${recipientAccount || ''}) ${amount.toFixed(2)} ብር ልከዋል። የመለያ ቁጥርዎ ${txId} ነው። የአገልግሎት ክፍያ ${serviceFee.toFixed(2)} ብር፤ የአገልግሎት ክፍያ 15% ቫት ${vatFee.toFixed(2)} ብር። አሁን ያለዎት ሒሳብ ${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ብር ነው። የክፍያ መረጃዎን ለማግኘት ሊንኩን ይጫኑ: ${receiptUrl}\nቴሌብርን ስለተጠቀሙ እናመሰግናለን\nኢትዮ ቴሌኮም`;
    }

    addSmsMessage({
      bodyEn,
      bodyAm,
      timestamp: timeStr,
      fullDateTime: formattedFullDate,
      txId,
      bankRef,
      type: isBank ? 'transfer_bank' : 'transfer_telebirr',
      amount,
      recipientName,
      recipientAccount,
      recipientBank,
      receiptUrl,
    });

    // Notification appears at the top for 5 seconds
    const notificationText = `Dear ${user.name}, you have transferred ETB ${amount.toFixed(
      2
    )} to ${recipientName} on ${formattedDate}. Transaction number: ${txId}. Your current balance is ETB ${newBalance.toFixed(
      2
    )}. Thank you for using telebirr!`;

    setActiveNotification(notificationText);
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);

    return receipt;
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const clearCurrentReceipt = () => {
    setCurrentReceipt(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        balance,
        rewardBalance,
        endekiseBalance,
        showBalance,
        showReward,
        showEndekise,
        savedAccounts,
        recentContacts,
        transactions,
        activeNotification,
        currentReceipt,
        smsMessages,
        smsLanguage,
        setSmsLanguage,
        addSmsMessage,
        updateSmsMessage,
        deleteSmsMessage,
        clearSmsMessages,
        getReceiptByTxId,
        login,
        logout,
        updateUser,
        addBalance,
        setExactBalance,
        setExactRewardBalance,
        setExactEndekiseBalance,
        toggleShowBalance,
        toggleShowReward,
        toggleShowEndekise,
        addSavedAccount,
        updateSavedAccount,
        deleteSavedAccount,
        addRecentContact,
        deleteRecentContact,
        performTransfer,
        dismissNotification,
        clearCurrentReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
