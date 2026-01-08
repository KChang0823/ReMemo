import { useState } from 'react';
import { CaptureView } from './components/CaptureView';
import { DashboardView } from './components/DashboardView';
import { LayoutGrid, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate, HAPTIC } from './utils';
import './index.css';

type Tab = 'capture' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('capture');

  const handleTabChange = (tab: Tab) => {
    if (activeTab !== tab) {
      vibrate(HAPTIC.TAP);
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'capture' ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <CaptureView />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <DashboardView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-start justify-around pt-3 pb-safe z-30">
        <button
          onClick={() => handleTabChange('capture')}
          className={cn(
            "flex flex-col items-center gap-1 w-16 transition-colors duration-200",
            activeTab === 'capture' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <PlusSquare strokeWidth={activeTab === 'capture' ? 2.5 : 2} className="w-6 h-6" />
          <span className="text-[10px] font-medium">新增</span>
        </button>

        <button
          onClick={() => handleTabChange('dashboard')}
          className={cn(
            "flex flex-col items-center gap-1 w-16 transition-colors duration-200",
            activeTab === 'dashboard' ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <LayoutGrid strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} className="w-6 h-6" />
          <span className="text-[10px] font-medium">列表</span>
        </button>
      </div>
    </div>
  );
}

export default App;
