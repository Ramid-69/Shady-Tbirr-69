import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface NotificationAreaProps {
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

export const NotificationArea: React.FC<NotificationAreaProps> = ({
  onSearchClick,
  onNotificationClick,
}) => {
  const [currentLang, setCurrentLang] = useState('Eng..');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = ['Eng..', 'አማርኛ (Amh)', 'Afaan Oromoo', 'ትግርኛ (Tig)', 'Somali'];

  return (
    <div className="flex items-center gap-3 relative" id="notification-area">
      <button
        id="btn-search-header"
        type="button"
        onClick={onSearchClick}
        aria-label="Search"
        className="text-white hover:opacity-80 transition-opacity p-1 cursor-pointer"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        id="btn-notification-header"
        type="button"
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="relative text-white hover:opacity-80 transition-opacity p-1 cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs">
          23
        </span>
      </button>

      <div className="relative">
        <button
          id="btn-lang-selector"
          type="button"
          onClick={() => setLangMenuOpen(!langMenuOpen)}
          className="flex items-center text-white text-[13px] hover:opacity-80 transition-opacity py-1 px-1 cursor-pointer font-medium"
        >
          <span>{currentLang}</span>
          <ChevronDown className="w-4 h-4 ml-0.5" />
        </button>

        {langMenuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white text-slate-800 rounded-lg shadow-lg py-1 w-36 z-50 text-xs border border-slate-100">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between"
                onClick={() => {
                  setCurrentLang(lang.slice(0, 5) + (lang.length > 5 ? '..' : ''));
                  setLangMenuOpen(false);
                }}
              >
                <span>{lang}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
