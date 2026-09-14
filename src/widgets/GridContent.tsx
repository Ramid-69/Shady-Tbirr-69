import React from 'react';
import {
  Wallet,
  Gift,
  Smartphone,
  HandCoins,
  Store,
  LayoutGrid,
  Calendar,
  Landmark,
  WalletCards,
  CreditCard,
  MapPin,
  PlusCircle,
} from 'lucide-react';
import { GridItem } from '../types';

interface GridContentProps {
  id?: string;
  items: GridItem[];
  onItemClick?: (item: GridItem) => void;
}

export const GridContent: React.FC<GridContentProps> = ({
  id,
  items,
  onItemClick,
}) => {
  const renderIcon = (item: GridItem) => {
    if (item.iconType === 'image' && item.imageSrc) {
      let imgStyle = 'h-7 object-contain max-w-[80%]';
      if (item.id === 'bottom-1') {
        imgStyle = 'h-8 max-w-[90%] object-contain'; // christmas fair logo
      } else if (item.id === 'top-5') {
        imgStyle = 'h-6 max-w-[65%] object-contain'; // dashen
      } else if (item.id === 'top-6') {
        imgStyle = 'h-7 max-w-[85%] object-contain'; // CBE
      } else if (item.id === 'bottom-2') {
        imgStyle = 'h-7 max-w-[70%] object-contain'; // ethio-logo
      }

      return (
        <div className="h-8 flex items-center justify-center">
          <img
            src={item.imageSrc}
            alt={item.label}
            className={imgStyle}
            loading="lazy"
          />
        </div>
      );
    }

    const iconColorClass = 'text-[#8cc544]';
    const iconSize = 26;

    let iconElement: React.ReactNode = null;
    switch (item.iconName) {
      case 'wallet':
        iconElement = <Wallet size={iconSize} className={iconColorClass} />;
        break;
      case 'gift':
        iconElement = <Gift size={iconSize} className={iconColorClass} />;
        break;
      case 'smartphone':
        iconElement = <Smartphone size={iconSize} className={iconColorClass} />;
        break;
      case 'hand-coins':
        iconElement = <HandCoins size={iconSize} className={iconColorClass} />;
        break;
      case 'store':
        iconElement = <Store size={iconSize} className={iconColorClass} />;
        break;
      case 'layout-grid':
        iconElement = <LayoutGrid size={iconSize} className={iconColorClass} />;
        break;
      case 'calendar':
        iconElement = <Calendar size={iconSize} className={iconColorClass} />;
        break;
      case 'landmark':
        iconElement = <Landmark size={iconSize} className={iconColorClass} />;
        break;
      case 'wallet-cards':
        iconElement = <WalletCards size={iconSize} className={iconColorClass} />;
        break;
      case 'fuel':
        iconElement = <CreditCard size={iconSize} className={iconColorClass} />;
        break;
      case 'map-pin':
        iconElement = <MapPin size={iconSize} className={iconColorClass} />;
        break;
      case 'plus-circle':
        iconElement = <PlusCircle size={iconSize} className={iconColorClass} />;
        break;
      default:
        iconElement = <Wallet size={iconSize} className={iconColorClass} />;
    }

    return (
      <div className="relative h-8 flex items-center justify-center">
        {iconElement}
        {item.badge && (
          <span className="absolute -top-1.5 -right-3 bg-amber-500 text-white font-bold text-[9px] px-1 rounded-sm shadow-xs animate-pulse">
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      id={id}
      className="grid grid-cols-4 gap-2.5 w-full"
    >
      {items.map((item) => (
        <button
          key={item.id}
          id={`grid-item-${item.id}`}
          type="button"
          onClick={() => onItemClick?.(item)}
          className="bg-white rounded-xl p-2 h-[84px] sm:h-[90px] flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-slate-200 border border-transparent transition-all active:scale-95 cursor-pointer group"
        >
          <div className="mb-1 flex items-center justify-center">
            {renderIcon(item)}
          </div>
          <span className="text-[11px] font-medium text-slate-800 leading-[1.15] line-clamp-2 px-0.5 tracking-tight group-hover:text-emerald-700">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
