export interface GridItem {
  id: string;
  label: string;
  iconType: 'icon' | 'image';
  iconName?: string;
  imageSrc?: string;
  badge?: string;
  actionKey: string;
}

export interface CarouselBanner {
  id: string;
  imageSrc: string;
  alt: string;
  title?: string;
}

export type MainTabType = 'home' | 'payment' | 'apps' | 'engage' | 'account';

export interface UserProfile {
  name: string;
  phoneNumber: string;
  level: string;
  pin: string;
}

export interface SavedAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  createdAt: string;
  type?: 'bank' | 'wallet'; // 'bank' = Other Bank, 'wallet' = Other Wallet / Telebirr
}

export interface RecentContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface BankInfo {
  id: string;
  name: string;
  amharicName?: string;
  code?: string;
  color?: string;
  iconType?: string;
}

export interface TransactionRecord {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
  status: 'Completed' | 'Pending';
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  txNumber?: string;
  notes?: string;
}

export interface TransferReceiptData {
  amount: number;
  currency: string;
  transactionTime: string;
  transactionType: string;
  transactionTo: string;
  recipientAccount?: string;
  recipientBank?: string;
  transactionNumber: string;
  bankRefNumber?: string;
  serviceFee?: number;
  vatFee?: number;
  payerName: string;
  payerPhone: string;
  remainingBalance: number;
}

export interface SmsMessage {
  id: string;
  sender: string; // '127'
  simSlot: number; // 1
  bodyEn: string;
  bodyAm?: string;
  timestamp: string; // e.g. "1:14 am"
  fullDateTime: string; // e.g. "08/08/2026 12:41:51"
  txId?: string;
  bankRef?: string;
  type: 'transfer_bank' | 'transfer_telebirr' | 'received' | 'deposit' | 'verification' | 'alert';
  amount?: number;
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  receiptUrl?: string;
}
