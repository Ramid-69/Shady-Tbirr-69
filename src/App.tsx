import React from 'react';
import { AppProvider } from './context/AppContext';
import { MainScreen } from './screens/MainScreen';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen w-full bg-[#1b2533] flex items-center justify-center p-0 sm:p-4 font-sans">
        {/* Mobile viewport simulator container */}
        <div className="w-full sm:max-w-[430px] h-screen sm:h-[900px] sm:max-h-[95vh] bg-[#f5f5f5] sm:rounded-[36px] overflow-hidden shadow-2xl sm:ring-8 sm:ring-slate-800/80 flex flex-col relative">
          {/* Core Main Screen */}
          <div className="flex-1 overflow-hidden relative">
            <MainScreen />
          </div>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
