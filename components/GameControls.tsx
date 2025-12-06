import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface GameControlsProps {
  gameTime: number;
  isTimerRunning: boolean;
  setGameTime: (t: number) => void;
  setIsTimerRunning: (r: boolean) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gameTime, isTimerRunning,
  setGameTime, setIsTimerRunning
}) => {
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime(gameTime - 1);
      }, 1000);
    } else if (gameTime === 0) {
        setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameTime, setGameTime, setIsTimerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount: number) => {
    setGameTime(Math.max(0, gameTime + amount));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-4 shadow-lg w-full">
      
      {/* Timer Display */}
      <div className="relative group">
        <div className="text-6xl font-mono font-bold text-white tracking-widest tabular-nums">
            {formatTime(gameTime)}
        </div>
        {/* Quick Adjust Overlay */}
        <div className="absolute -right-8 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => adjustTime(60)} className="p-1 bg-slate-700 rounded hover:bg-slate-600"><Plus size={12}/></button>
            <button onClick={() => adjustTime(-60)} className="p-1 bg-slate-700 rounded hover:bg-slate-600"><Minus size={12}/></button>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-6 w-full justify-center">
        <button 
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className={`flex-1 py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2
            ${isTimerRunning 
                ? 'bg-yellow-600 hover:bg-yellow-500 shadow-lg shadow-yellow-900/20' 
                : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20'}`}
        >
          {isTimerRunning ? <><Pause fill="white" size={20}/> PAUSE</> : <><Play fill="white" size={20}/> START</>}
        </button>

        <button 
          onClick={() => { setIsTimerRunning(false); setGameTime(1800); }} // Reset to 30:00
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-slate-300 border border-slate-600"
          title="Reset to 30:00"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default GameControls;