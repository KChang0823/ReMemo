import { useState } from 'react';
import { BottomNavigation, type Tab } from './components/BottomNavigation';
import { CaptureView } from './components/CaptureView';
import { Dashboard } from './components/Dashboard';
import { BedGrid } from './components/BedGrid';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  return (
    <div className="fixed inset-0 flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-white overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'add' && <CaptureView />}
        {activeTab === 'tasks' && <Dashboard />}
        {activeTab === 'patients' && <BedGrid />}
      </main>

      {/* Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
