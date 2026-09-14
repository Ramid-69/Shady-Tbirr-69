import { GridItem, CarouselBanner, TransactionRecord } from './types';

export const topGridItems: GridItem[] = [
  {
    id: 'top-1',
    label: 'Send Money',
    iconType: 'icon',
    iconName: 'wallet',
    actionKey: 'send_money',
  },
  {
    id: 'top-2',
    label: 'Cash In/Out',
    iconType: 'icon',
    iconName: 'gift',
    actionKey: 'cash_in_out',
  },
  {
    id: 'top-3',
    label: 'Airtime/Packages',
    iconType: 'icon',
    iconName: 'smartphone',
    badge: '+10%',
    actionKey: 'airtime',
  },
  {
    id: 'top-4',
    label: 'Request Money',
    iconType: 'icon',
    iconName: 'hand-coins',
    actionKey: 'request_money',
  },
  {
    id: 'top-5',
    label: 'Financial Service With Dashen',
    iconType: 'image',
    imageSrc: '/images/dashen.png',
    actionKey: 'dashen_bank',
  },
  {
    id: 'top-6',
    label: 'Financial Service With CBE',
    iconType: 'image',
    imageSrc: '/images/cbe.png',
    actionKey: 'cbe_bank',
  },
  {
    id: 'top-7',
    label: 'Pay for Merchants',
    iconType: 'icon',
    iconName: 'store',
    actionKey: 'pay_merchants',
  },
  {
    id: 'top-8',
    label: 'App',
    iconType: 'icon',
    iconName: 'layout-grid',
    actionKey: 'apps_more',
  },
];

export const bottomGridItems: GridItem[] = [
  {
    id: 'bottom-1',
    label: '33rd Chrismass traid fair',
    iconType: 'image',
    imageSrc: '/images/christmas.png',
    actionKey: 'christmas_fair',
  },
  {
    id: 'bottom-2',
    label: 'Pay Ethio telecome Bill',
    iconType: 'image',
    imageSrc: '/images/ethio-logo.png',
    actionKey: 'ethio_bill',
  },
  {
    id: 'bottom-3',
    label: 'Schedule Payment',
    iconType: 'icon',
    iconName: 'calendar',
    actionKey: 'schedule_payment',
  },
  {
    id: 'bottom-4',
    label: 'Transfer to Bank',
    iconType: 'icon',
    iconName: 'landmark',
    actionKey: 'transfer_bank',
  },
  {
    id: 'bottom-5',
    label: 'Transfer to Wallet',
    iconType: 'icon',
    iconName: 'wallet-cards',
    actionKey: 'transfer_wallet',
  },
  {
    id: 'bottom-6',
    label: 'Fuel payment',
    iconType: 'icon',
    iconName: 'fuel',
    actionKey: 'fuel_payment',
  },
  {
    id: 'bottom-7',
    label: 'Nearby Fuel Station',
    iconType: 'icon',
    iconName: 'map-pin',
    actionKey: 'fuel_station',
  },
  {
    id: 'bottom-8',
    label: 'More',
    iconType: 'icon',
    iconName: 'plus-circle',
    actionKey: 'more_services',
  },
];

export const carouselBanners: CarouselBanner[] = [
  {
    id: 'banner-1',
    imageSrc: '/images/banner-1.jpg',
    alt: 'Telebirr Promotion 1',
  },
  {
    id: 'banner-2',
    imageSrc: '/images/banner-2.jpg',
    alt: 'Telebirr Promotion 2',
  },
  {
    id: 'banner-3',
    imageSrc: '/images/banner-3.jpg',
    alt: 'Telebirr Promotion 3',
  },
];

export const mockTransactions: TransactionRecord[] = [
  {
    id: 'tx-101',
    title: 'Ethio Telecom Airtime',
    category: 'Airtime Recharge',
    amount: -150.00,
    date: 'Today, 11:24 AM',
    type: 'debit',
    status: 'Completed',
  },
  {
    id: 'tx-102',
    title: 'Salary Deposit',
    category: 'Bank Transfer (CBE)',
    amount: 14500.00,
    date: 'Yesterday, 04:30 PM',
    type: 'credit',
    status: 'Completed',
  },
  {
    id: 'tx-103',
    title: 'Grocery Store Payment',
    category: 'Merchant Payment',
    amount: -420.50,
    date: 'Sep 10, 2026',
    type: 'debit',
    status: 'Completed',
  },
  {
    id: 'tx-104',
    title: 'Total Fuel Station',
    category: 'Fuel Payment',
    amount: -850.00,
    date: 'Sep 08, 2026',
    type: 'debit',
    status: 'Completed',
  },
  {
    id: 'tx-105',
    title: 'Friend Transfer (Abebe K.)',
    category: 'Send Money',
    amount: -300.00,
    date: 'Sep 05, 2026',
    type: 'debit',
    status: 'Completed',
  },
];
