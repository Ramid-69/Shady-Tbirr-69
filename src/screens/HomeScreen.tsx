import React, { useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { UserIntroduction } from '../widgets/UserIntroduction';
import { NotificationArea } from '../widgets/NotificationArea';
import { BalanceInfo } from '../widgets/BalanceInfo';
import { GridContent } from '../widgets/GridContent';
import { CarouselSlider } from '../widgets/CarouselSlider';
import { TransactionDetails } from '../widgets/TransactionDetails';
import { ScanQrModal } from '../widgets/ScanQrModal';
import { TransactionModal } from '../widgets/TransactionModal';
import { ServiceDetailModal } from '../widgets/ServiceDetailModal';
import {
  EditProfileModal,
  AddBalanceModal,
  ManualEditBalancesModal,
  SendMoneyPopup,
} from '../components/SpecialTriggersModals';
import { topGridItems, bottomGridItems, carouselBanners } from '../constants';
import { GridItem } from '../types';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onNavigateToSendMoney: () => void;
  onNavigateToTransferBank: () => void;
  onNavigateToPayment: () => void;
  onNavigateToApps: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSendMoney,
  onNavigateToTransferBank,
  onNavigateToPayment,
  onNavigateToApps,
}) => {
  const {
    user,
    balance,
    rewardBalance,
    endekiseBalance,
    showBalance,
    showReward,
    showEndekise,
    toggleShowBalance,
    toggleShowReward,
    toggleShowEndekise,
    transactions,
    activeNotification,
    dismissNotification,
    performTransfer,
  } = useApp();

  // Modals state
  const [isScanQrOpen, setIsScanQrOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<GridItem | null>(null);

  // Easter eggs & special user triggers
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
  const [isManualEditBalancesOpen, setIsManualEditBalancesOpen] = useState(false);
  const [isSendMoneyPopupOpen, setIsSendMoneyPopupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGridItemClick = (item: GridItem) => {
    if (item.actionKey === 'send_money') {
      setIsSendMoneyPopupOpen(true);
    } else if (item.actionKey === 'transfer_bank') {
      onNavigateToTransferBank();
    } else if (item.actionKey === 'apps_more' || item.actionKey === 'more_services') {
      onNavigateToApps();
    } else if (item.actionKey === 'ethio_bill' || item.actionKey === 'schedule_payment') {
      onNavigateToPayment();
    } else {
      setSelectedService(item);
    }
  };

  return (
    <div
      className="relative flex flex-col h-full bg-[#f5f5f5] overflow-x-hidden select-none"
      id="home-screen"
      onScroll={() => {
        if (activeNotification) {
          dismissNotification();
        }
      }}
    >
      {/* 5-Second Push Notification Bar at the very top (User requirement) */}
      {activeNotification && (
        <div
          onClick={dismissNotification}
          className="fixed top-2 left-3 right-3 z-50 bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in slide-in-from-top-4 flex items-start justify-between cursor-pointer"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8cc73f] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              tb
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#8cc73f] uppercase tracking-wider">
                telebirr alert
              </p>
              <p className="text-xs text-slate-100 leading-snug pr-2 mt-0.5">
                {activeNotification}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification();
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Top White AppBar */}
      <header className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-2xs">
        <img
          src="/images/ethio.png"
          alt="Ethio Telecom"
          className="w-[105px] object-contain"
        />
        <img
          src="/images/telebirr.png"
          alt="Telebirr"
          className="w-[65px] object-contain"
        />
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Top Green Banner with User, Balances & Marquee */}
        <div className="relative bg-[#8cc73f] text-white pt-2 pb-6 px-3">
          {/* User Introduction & Notifications Row */}
          <div className="flex items-center justify-between mb-2">
            <UserIntroduction
              userName={user.name}
              onTripleClick={() => setIsEditProfileOpen(true)}
            />
            <NotificationArea
              onSearchClick={() => showToast('Search Telebirr services & merchants')}
              onNotificationClick={() => showToast(`You have ${transactions.length} recent transactions`)}
            />
          </div>

          {/* Main Current Balance */}
          <div className="my-1">
            <BalanceInfo
              id="main-balance-info"
              label="Balance (ETB) "
              amount={balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              isVisible={showBalance}
              onToggleVisibility={toggleShowBalance}
              onTripleClick={() => setIsAddBalanceOpen(true)}
              onManualEdit={() => setIsManualEditBalancesOpen(true)}
              labelFontSize="lg"
              balanceFontSize="3xl"
              alignment="center"
            />
          </div>

          {/* Sub-balances: Endekise & Reward (User requirement: manual editing + show/hide) */}
          <div className="flex items-center justify-between px-2 mt-2">
            <BalanceInfo
              id="endekise-balance-info"
              label="Endekise (ETB) "
              amount={endekiseBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              isVisible={showEndekise}
              onToggleVisibility={toggleShowEndekise}
              onManualEdit={() => setIsManualEditBalancesOpen(true)}
              labelFontSize="sm"
              balanceFontSize="xl"
              alignment="start"
            />
            <BalanceInfo
              id="reward-balance-info"
              label="Reward (ETB) "
              amount={rewardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              isVisible={showReward}
              onToggleVisibility={toggleShowReward}
              onManualEdit={() => setIsManualEditBalancesOpen(true)}
              labelFontSize="sm"
              balanceFontSize="xl"
              alignment="start"
            />
          </div>

          {/* Bottom Curved Yellow Marquee Strip (Screenshot 4 & 10) */}
          <div className="absolute -bottom-0 left-0 right-0 h-5 bg-[#fbbb47] rounded-t-[100px] flex items-center overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden whitespace-nowrap">
              <div className="inline-block text-[11px] font-bold text-white tracking-wide animate-marquee">
                <span>ONE APP FOR ALL YOUR NEEDS! • ONE APP FOR ALL YOUR NEEDS! • ONE APP FOR ALL YOUR NEEDS! • </span>
                <span>ONE APP FOR ALL YOUR NEEDS! • ONE APP FOR ALL YOUR NEEDS! • ONE APP FOR ALL YOUR NEEDS! • </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-2 pt-2 pb-6 space-y-3">
          {/* Top 8 Grid Content (Send Money, Cash In/Out, Airtime, etc.) */}
          <section id="top-grid-section">
            <GridContent
              id="top-grid"
              items={topGridItems}
              onItemClick={handleGridItemClick}
            />
          </section>

          {/* Promotional Carousel Slider */}
          <section id="carousel-banners-section">
            <CarouselSlider banners={carouselBanners} />
          </section>

          {/* Transaction Details Row */}
          <section id="transaction-details-section">
            <TransactionDetails
              onClick={() => setIsTransactionModalOpen(true)}
            />
          </section>

          {/* Bottom 8 Grid Content (Transfer to Bank, Pay Bills, Fuel, etc.) */}
          <section id="bottom-grid-section">
            <GridContent
              id="bottom-grid"
              items={bottomGridItems}
              onItemClick={handleGridItemClick}
            />
          </section>
        </div>
      </div>

      {/* Floating Action Button: Scan QR (Centered button) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center px-6 z-20 pointer-events-none">
        <button
          id="btn-scan-qr"
          type="button"
          onClick={() => setIsScanQrOpen(true)}
          className="pointer-events-auto w-[75%] max-w-xs py-2.5 px-4 bg-[#0287d0] hover:bg-[#0275b5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-5 h-5 text-white" />
          <span className="text-sm sm:text-base tracking-wide">Scan QR</span>
        </button>
      </div>

      {/* Scan QR Modal */}
      <ScanQrModal
        isOpen={isScanQrOpen}
        onClose={() => setIsScanQrOpen(false)}
        onScanned={(data) => {
          performTransfer({
            amount: 150.0,
            recipientName: `Merchant (${data})`,
            transactionType: 'Merchant Payment',
          });
        }}
      />

      {/* Transaction History Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactions={transactions}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        item={selectedService}
        onClose={() => setSelectedService(null)}
        onProcessTransaction={(title, category, amount) => {
          performTransfer({
            amount: Math.abs(amount),
            recipientName: title,
            transactionType: category,
          });
        }}
      />

      {/* Special User Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <AddBalanceModal
        isOpen={isAddBalanceOpen}
        onClose={() => setIsAddBalanceOpen(false)}
      />

      <ManualEditBalancesModal
        isOpen={isManualEditBalancesOpen}
        onClose={() => setIsManualEditBalancesOpen(false)}
      />

      <SendMoneyPopup
        isOpen={isSendMoneyPopupOpen}
        onClose={() => setIsSendMoneyPopupOpen(false)}
        onSelectIndividual={onNavigateToSendMoney}
        onSelectGroup={() => {
          showToast('Group transfer selected');
          onNavigateToSendMoney();
        }}
      />
    </div>
  );
};
