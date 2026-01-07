import { SmartInputBar } from './components/SmartInputBar';
import { BedGrid } from './components/BedGrid';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <SmartInputBar />
      <main className="flex-1 overflow-y-auto pb-safe">
        <BedGrid />
      </main>
    </div>
  );
}

export default App;
