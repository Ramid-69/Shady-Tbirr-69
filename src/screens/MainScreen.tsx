import React, { useState } from 'react';
import { Home, CreditCard, LayoutGrid, MessageSquare, User } from 'lucide-react';
import { HomeScreen } from './HomeScreen';
import { PaymentScreen } from './PaymentScreen';
import { AppsScreen } from './AppsScreen';
import { EngageScreen } from './EngageScreen';
import { AccountScreen } from './AccountScreen';
import { LoginScreen } from './LoginScreen';
import { SendMoneyScreen } from './SendMoneyScreen';
import { TransferToBankScreen } from './TransferToBankScreen';
import { ReceiptScreen } from './ReceiptScreen';
import { MainTabType } from '../types';
import { useApp } from '../context/AppContext';

export const MainScreen: React.FC = () => {
  const { isAuthenticated, currentReceipt, clearCurrentReceipt } = useApp();
  const [currentTab, setCurrentTab] = useState<MainTabType>('home');
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'send_money' | 'transfer_bank'
  >('none');

  // If not authenticated, render LoginScreen (User requirement: PIN 696969, 3s loading animation, redirect to Home)
  if (!isAuthenticated) {
    return (
      <div className="h-full w-full bg-[#f8faf9]">
        <LoginScreen onLoginSuccess={() => setCurrentTab('home')} />
      </div>
    );
  }

  // If current receipt is active, show ReceiptScreen (User requirement: exact receipt layout)
  if (currentReceipt) {
    return (
      <div className="h-full w-full bg-white">
        <ReceiptScreen
          receipt={currentReceipt}
          onFinish={() => {
            clearCurrentReceipt();
            setActiveSubView('none');
            setCurrentTab('home');
          }}
        />
      </div>
    );
  }

  // Active sub-views (Send Money to Individual, Transfer to Bank)
  if (activeSubView === 'send_money') {
    return (
      <div className="h-full w-full bg-[#f5f5f5]">
        <SendMoneyScreen
          onBack={() => setActiveSubView('none')}
          onSuccessTransfer={() => {
            setActiveSubView('none');
          }}
        />
      </div>
    );
  }

  if (activeSubView === 'transfer_bank') {
    return (
      <div className="h-full w-full bg-[#f5f5f5]">
        <TransferToBankScreen
          onBack={() => setActiveSubView('none')}
          onSuccessTransfer={() => {
            setActiveSubView('none');
          }}
        />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToSendMoney={() => setActiveSubView('send_money')}
            onNavigateToTransferBank={() => setActiveSubView('transfer_bank')}
            onNavigateToPayment={() => setCurrentTab('payment')}
            onNavigateToApps={() => setCurrentTab('apps')}
          />
        );
      case 'payment':
        return <PaymentScreen />;
      case 'apps':
        return <AppsScreen />;
      case 'engage':
        return <EngageScreen />;
      case 'account':
        return <AccountScreen onSignOut={() => setCurrentTab('home')} />;
      default:
        return (
          <HomeScreen
            onNavigateToSendMoney={() => setActiveSubView('send_money')}
            onNavigateToTransferBank={() => setActiveSubView('transfer_bank')}
            onNavigateToPayment={() => setCurrentTab('payment')}
            onNavigateToApps={() => setCurrentTab('apps')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f5f5f5] select-none" id="main-screen">
      {/* Active Tab Screen Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderActiveScreen()}
      </main>

      {/* 5-Tab Bottom Navigation Bar (Screenshots 4, 11, 12, 13, 14) */}
      <nav
        id="bottom-navigation-bar"
        className="h-14 bg-[#8cc73f] border-t border-emerald-600/20 flex items-center justify-around px-1 z-30 flex-shrink-0 shadow-lg"
      >
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => {
            setActiveSubView('none');
            setCurrentTab('home');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'home'
              ? 'text-white font-bold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Home</span>
        </button>

        <button
          id="nav-tab-payment"
          type="button"
          onClick={() => {
            setActiveSubView('none');
            setCurrentTab('payment');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'payment'
              ? 'text-white font-bold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Payment</span>
        </button>

        <button
          id="nav-tab-apps"
          type="button"
          onClick={() => {
            setActiveSubView('none');
            setCurrentTab('apps');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'apps'
              ? 'text-white font-bold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Apps</span>
        </button>

        <button
          id="nav-tab-engage"
          type="button"
          onClick={() => {
            setActiveSubView('none');
            setCurrentTab('engage');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'engage'
              ? 'text-white font-bold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Engage</span>
        </button>

        <button
          id="nav-tab-account"
          type="button"
          onClick={() => {
            setActiveSubView('none');
            setCurrentTab('account');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'account'
              ? 'text-white font-bold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Account</span>
        </button>
      </nav>
    </div>
  );
};
