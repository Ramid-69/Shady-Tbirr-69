import React, { useState, useRef } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Globe,
  HelpCircle,
  Phone,
  Info,
  Share2,
  Ticket,
  FileCheck,
  LogOut,
  QrCode,
  ChevronRight,
  Fingerprint,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from '../components/SpecialTriggersModals';
import { SmsMessagesScreen } from './SmsMessagesScreen';
import { OfficialWebReceiptView } from './OfficialWebReceiptView';

interface AccountScreenProps {
  onSignOut?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onSignOut }) => {
  const { user, logout, smsMessages, getReceiptByTxId } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [viewingReceiptTxId, setViewingReceiptTxId] = useState<string | null>(null);

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef<boolean>(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOut = () => {
    logout();
    if (onSignOut) {
      onSignOut();
    }
  };

  const startPressTimer = () => {
    isLongPressTriggered.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setIsSmsOpen(true);
    }, 450);
  };

  const cancelPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleMessageIconClick = () => {
    if (!isLongPressTriggered.current) {
      // User tapped quickly - open directly and give gentle confirmation
      setIsSmsOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] select-none overflow-y-auto relative" id="account-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Profile Header (Screenshot 14) */}
      <div className="bg-[#8cc73f] text-white p-5 pt-6 pb-6 relative overflow-hidden">
        {/* Subtle background curved shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
            <circle cx="350" cy="50" r="100" stroke="white" strokeWidth="2" />
            <circle cx="350" cy="50" r="140" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center justify-between cursor-pointer group z-10 relative"
        >
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-white shadow-inner">
              <User className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white tracking-wide truncate drop-shadow-xs">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0287d0] text-white text-[11px] font-bold shadow-xs">
                  {user.level}
                </span>
                <span className="text-xs font-bold text-white tracking-wider font-mono bg-black/15 px-2 py-0.5 rounded-md">
                  {user.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            {/* Long-pressable SMS Messages Icon */}
            <div
              id="profile-message-icon"
              onMouseDown={startPressTimer}
              onMouseUp={cancelPressTimer}
              onMouseLeave={cancelPressTimer}
              onTouchStart={startPressTimer}
              onTouchEnd={cancelPressTimer}
              onClick={handleMessageIconClick}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-all active:scale-90 relative shadow-xs"
              title="SMS Messages (Press and hold to open)"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              {smsMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-[#8cc73f]">
                  {smsMessages.length > 9 ? '9+' : smsMessages.length}
                </span>
              )}
            </div>

            <QrCode className="w-5 h-5" />
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Verification Upgrade Banner */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0287d0] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Verify / Upgrade with Fayda (NID)</p>
              <p className="text-[10px] text-slate-400">Increase daily limits to ETB 500,000</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('National Digital ID Fayda verification opened')}
            className="px-3 py-1.5 rounded-lg bg-[#0287d0] text-white text-xs font-bold shadow-2xs hover:bg-[#0275b5] cursor-pointer"
          >
            Verify
          </button>
        </div>

        {/* Security & Settings Menu (Screenshot 14) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100 text-xs">
          <button
            type="button"
            onClick={() => showToast('Enter current PIN to change Telebirr PIN')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Change PIN</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Languages: English (Current), Amharic, Oromo, Tigrinya')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Change Language</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[11px] font-medium text-slate-600">English</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Biometrics Toggle */}
          <div className="w-full px-4 py-3.5 flex items-center justify-between bg-white text-left">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Biometric Authentication</span>
            </div>
            <button
              type="button"
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                biometricEnabled ? 'bg-[#8cc73f]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  biometricEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Frequently Asked Questions')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">FAQ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Ethio Telecom Support Hotline: 127')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Contact Us (127)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Telebirr SuperApp Version 1.2.9')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">About</span>
            </div>
            <span className="text-[11px] text-slate-400">1.2.9</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Telebirr link copied to clipboard')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Share Telebirr</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Coupons & Verification */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100 text-xs">
          <button
            type="button"
            onClick={() => showToast('No active coupons currently')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">My Coupon</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Receipt verification tool opened')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Verify Payment Receipt</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Sign Out Button (allows testing Login page anytime) */}
        <div className="pt-1 pb-4">
          <button
            id="btn-account-logout"
            type="button"
            onClick={handleSignOut}
            className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 active:scale-99 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from {user.name}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* SMS Messages Screen */}
      {isSmsOpen && (
        <SmsMessagesScreen
          onBack={() => setIsSmsOpen(false)}
          onOpenReceipt={(txId) => setViewingReceiptTxId(txId)}
        />
      )}

      {/* Official Web Receipt Modal */}
      {viewingReceiptTxId && getReceiptByTxId(viewingReceiptTxId) && (
        <OfficialWebReceiptView
          receipt={getReceiptByTxId(viewingReceiptTxId)!}
          onBack={() => setViewingReceiptTxId(null)}
        />
      )}
    </div>
  );
};
