import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { SleepButton } from './components/SleepButton';
import { SleepList } from './components/SleepList';
import { SleepChart } from './components/SleepChart';
import { AiInsights } from './components/AiInsights';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SleepRecord } from './types';
import { formatDate, formatDay, formatTime24h, getGreeting } from './utils/dateUtils';

const App: React.FC = () => {
  const [records, setRecords] = useLocalStorage<SleepRecord[]>('sleepRecords', []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRecordSleep = () => {
    const now = new Date();
    
    const newRecord: SleepRecord = {
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      day: formatDay(now),
      date: formatDate(now),
      time: formatTime24h(now),
    };

    // Add to top of list
    setRecords([newRecord, ...records]);
    
    // Optional: Visual feedback could be added here (toast)
  };

  const handleClearAll = () => {
    setRecords([]);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Day,Date,Time\n"
      + records.map(r => `${r.day},${r.date},${r.time}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sleep_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">SleepLog</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-20 space-y-8">
        
        {/* Greeting Section */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{getGreeting()}</p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Ready to sleep?</h2>
        </div>

        {/* Primary Action */}
        <SleepButton onRecord={handleRecordSleep} />

        {/* Stats & Charts */}
        {records.length > 0 && (
          <div className="animate-fade-in-up">
            <SleepChart records={records} />
          </div>
        )}

        {/* AI Section (Optional) */}
        {records.length > 0 && <AiInsights records={records} />}

        {/* History List */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <SleepList 
            records={records} 
            onClear={handleClearAll} 
            onExport={handleExport}
          />
        </div>
      </main>

      {/* Stats Footer */}
      {records.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-3 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Total Records: <span className="font-semibold text-gray-900 dark:text-white">{records.length}</span></p>
        </div>
      )}
    </div>
  );
};

export default App;