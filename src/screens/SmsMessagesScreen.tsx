import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  User,
  MoreVertical,
  Search,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Camera,
  Plus,
  Smile,
  Mic,
  Send,
  X,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SmsMessage } from '../types';

interface SmsMessagesScreenProps {
  onBack: () => void;
  onOpenReceipt: (txId: string) => void;
}

export const SmsMessagesScreen: React.FC<SmsMessagesScreenProps> = ({
  onBack,
  onOpenReceipt,
}) => {
  const {
    smsMessages,
    smsLanguage,
    setSmsLanguage,
    deleteSmsMessage,
    updateSmsMessage,
    addSmsMessage,
    clearSmsMessages,
    user,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SmsMessage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on mount and when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [smsMessages.length]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopyMessage = (msg: SmsMessage) => {
    const textToCopy = smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn;
    navigator.clipboard.writeText(textToCopy);
    showToast('Message copied to clipboard');
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    deleteSmsMessage(id);
    showToast('Message deleted');
    setSelectedMessage(null);
  };

  const handleOpenEdit = (msg: SmsMessage) => {
    setSelectedMessage(msg);
    setEditingText(smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedMessage && editingText.trim()) {
      updateSmsMessage(selectedMessage.id, editingText);
      showToast('Message updated');
      setIsEditModalOpen(false);
      setSelectedMessage(null);
    }
  };

  const handleSendCustomMessage = () => {
    if (!customInputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    addSmsMessage({
      bodyEn: customInputText.trim(),
      bodyAm: customInputText.trim(),
      timestamp: timeStr,
      fullDateTime: `${dd}/${mm}/${yyyy} ${now.toTimeString().split(' ')[0]}`,
      type: 'alert',
    });
    setCustomInputText('');
  };

  // Filter messages by search query
  const filteredMessages = smsMessages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.bodyEn.toLowerCase().includes(q) ||
      (msg.bodyAm && msg.bodyAm.toLowerCase().includes(q)) ||
      (msg.txId && msg.txId.toLowerCase().includes(q)) ||
      msg.timestamp.toLowerCase().includes(q)
    );
  });

  // Render clickable links in message text
  const renderMessageContent = (text: string, msg: SmsMessage) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <div className="text-[13px] leading-relaxed text-slate-900 whitespace-pre-wrap font-sans break-words">
        {parts.map((part, idx) => {
          if (part.match(urlRegex)) {
            // Check if it's a Telebirr receipt link
            const isReceiptLink = part.includes('transactioninfo.ethiotelecom.et/receipt') || part.includes('receipt');
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isReceiptLink && msg.txId) {
                    onOpenReceipt(msg.txId);
                  } else {
                    window.open(part, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-800 cursor-pointer inline-flex items-center gap-0.5 break-all"
              >
                <span>{part}</span>
                {isReceiptLink && <ExternalLink className="w-3 h-3 inline ml-0.5 shrink-0" />}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa] select-none relative overflow-hidden" id="sms-messages-screen">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#8cc73f]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header - Exact Samsung SMS 127 style from screenshot */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-700 hover:text-slate-950 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-[#7ea8e6] flex items-center justify-center text-white shadow-2xs">
            <User className="w-5 h-5 fill-white text-white" />
          </div>

          {/* Contact Title & Badge */}
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-base font-extrabold text-slate-900 tracking-tight">127</span>
            {/* Blue SIM Badge 1 */}
            <span className="w-4 h-4 rounded bg-[#0287d0] text-white text-[10px] font-black flex items-center justify-center shadow-2xs">
              1
            </span>
            <span className="text-slate-400 text-xs font-bold -ml-0.5">∨</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={() => {
              const next = smsLanguage === 'en' ? 'am' : 'en';
              setSmsLanguage(next);
              showToast(`Language switched to ${next === 'en' ? 'English' : 'Amharic (አማርኛ)'}`);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200/60"
            title="Toggle Language: English / Amharic"
          >
            <Languages className="w-3.5 h-3.5 text-[#0287d0]" />
            <span>{smsLanguage === 'en' ? 'EN' : 'አማ'}</span>
          </button>

          {/* Search Toggle */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSearchOpen ? 'bg-blue-50 text-[#0287d0]' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Search messages"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Three dots menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    const now = new Date();
                    const dd = String(now.getDate()).padStart(2, '0');
                    const mm = String(now.getMonth() + 1).padStart(2, '0');
                    const yyyy = now.getFullYear();
                    const tx = 'DH' + Math.random().toString(36).substring(2, 9).toUpperCase();
                    addSmsMessage({
                      bodyEn: `Dear ${user.name.split(' ')[0]}\nYou have successfully transferred 250.00 Br. to MOHAMMED YASIN on date ${dd}/${mm}/${yyyy}. Tx ID: ${tx}.\nTo get your payment info: https://transactioninfo.ethiotelecom.et/receipt/${tx}\nThank you for using Telebirr`,
                      bodyAm: `ክቡር ${user.name.split(' ')[0]}\nበ ${dd}/${mm}/${yyyy} 250.00 ብር በተሳካ ሁኔታ አስተላልፈዋል። መለያ ቁጥር: ${tx}።\nየክፍያ መረጃ ለማግኘት: https://transactioninfo.ethiotelecom.et/receipt/${tx}\nቴሌብርን ስለተጠቀሙ እናመሰግናለን`,
                      txId: tx,
                      type: 'transfer_telebirr',
                    });
                    showToast('Sample transfer message added');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8cc73f]" />
                  <span>Add Sample SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    clearSmsMessages();
                    showToast('All messages cleared');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Messages</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2 animate-in slide-in-from-top-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transfer messages, accounts, or amounts..."
            className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Messages Stream Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-4"
        onClick={() => {
          setSelectedMessage(null);
          setIsMenuOpen(false);
        }}
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600">No messages found</p>
            <p className="text-[11px] text-slate-400">
              {searchQuery ? 'Try a different search term' : 'Transfer or deposit messages will appear here.'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const bodyText = smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn;
            const isSelected = selectedMessage?.id === msg.id;

            return (
              <div key={msg.id} className="flex flex-col items-start max-w-[92%] relative group animate-in fade-in">
                {/* SMS Bubble matching Samsung SMS blue bubble */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMessage(isSelected ? null : msg);
                  }}
                  className={`relative p-3.5 rounded-2xl rounded-tl-sm transition-all cursor-pointer shadow-2xs border ${
                    isSelected
                      ? 'bg-[#cbe2fc] border-blue-400 ring-2 ring-blue-300'
                      : 'bg-[#dceafc] hover:bg-[#d4e4f9] border-[#c8ddf6]'
                  }`}
                >
                  {/* Message Text Content */}
                  {renderMessageContent(bodyText, msg)}

                  {/* If message has "View all >" style link or verification code button */}
                  {msg.type === 'alert' && (
                    <div className="mt-2.5 pt-2 border-t border-[#c2dbf7] flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>View all</span>
                      <span className="text-slate-500">›</span>
                    </div>
                  )}

                  {msg.txId && (
                    <div className="mt-2 pt-2 border-t border-[#c2dbf7] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (msg.txId) onOpenReceipt(msg.txId);
                        }}
                        className="text-[11px] font-bold text-[#0287d0] hover:text-[#026fa8] flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Official Receipt</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[11px] font-medium text-slate-500 font-sans">
                    {msg.timestamp}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>

                {/* Action Toolbar on Message selection */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1.5 flex items-center gap-1 bg-white rounded-xl shadow-md border border-slate-200 p-1 text-xs animate-in zoom-in-95"
                  >
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Copy full text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(msg)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Edit message"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {msg.txId && (
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(msg.txId!)}
                        className="px-2.5 py-1 text-[#0287d0] hover:bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                        title="View receipt"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Bar - Exact Samsung SMS Bottom Navigation & Input Bar */}
      <footer className="bg-white border-t border-slate-200 px-3 py-2 flex items-center gap-2 sticky bottom-0 z-20">
        {/* Left Icons: Image, Camera, Plus */}
        <div className="flex items-center gap-1 text-slate-500">
          <button
            type="button"
            onClick={() => showToast('Image attachment')}
            className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Attach image"
          >
            <ImageIcon className="w-5 h-5 stroke-[1.7]" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Camera opened')}
            className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Camera"
          >
            <Camera className="w-5 h-5 stroke-[1.7]" />
          </button>
          <button
            type="button"
            onClick={() => showToast('More attachment options')}
            className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="More"
          >
            <Plus className="w-5 h-5 stroke-[1.7]" />
          </button>
        </div>

        {/* Input Pill */}
        <div className="flex-1 bg-slate-100 rounded-full px-3.5 py-1.5 flex items-center gap-2 border border-slate-200/80">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendCustomMessage();
            }}
            placeholder="Text message"
            className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => showToast('Emojis')}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        {/* Right Icon: Mic or Send */}
        {customInputText.trim() ? (
          <button
            type="button"
            onClick={handleSendCustomMessage}
            className="p-2 bg-[#0287d0] text-white rounded-full hover:bg-[#0276b5] transition-colors cursor-pointer shadow-xs"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => showToast('Voice note')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Voice note"
          >
            <Mic className="w-5 h-5 stroke-[1.7]" />
          </button>
        )}
      </footer>

      {/* Edit Message Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Edit SMS Message</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              rows={8}
              className="w-full text-xs font-sans text-slate-900 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0287d0] focus:ring-1 focus:ring-[#0287d0] resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0287d0] hover:bg-[#0276b5] cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
