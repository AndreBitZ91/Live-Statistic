import React, { useState } from 'react';
import { ShotResult, TeamSide, CourtZone, Player } from '../types';
import { X, Activity } from 'lucide-react';

interface ShotInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: ShotResult, playerId: string, zone: CourtZone, team: TeamSide) => void;
  activePlayers: Player[]; // ONLY active players passed here
}

const ShotInputModal: React.FC<ShotInputModalProps> = ({ isOpen, onClose, onSave, activePlayers }) => {
  const [result, setResult] = useState<ShotResult | null>(null);
  
  if (!isOpen) return null;

  const handlePlayerClick = (player: Player) => {
    if (!result) {
        alert("Please select the result first (Goal, Save, etc)");
        return;
    }
    // Hardcoded zone or passed zone? For now, we simplify.
    // The court click established the "where", now we establish "who" and "what".
    onSave(result, player.id, CourtZone.UNKNOWN, TeamSide.HOME);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-400" />
            Record Action
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* Step 1: Result */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">1. Result</h3>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setResult(ShotResult.GOAL)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.GOAL ? 'bg-green-600 text-white shadow-lg shadow-green-900/50 scale-105' : 'bg-slate-700 text-slate-300'}`}>GOAL</button>
              <button onClick={() => setResult(ShotResult.SAVE)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.SAVE ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 scale-105' : 'bg-slate-700 text-slate-300'}`}>SAVED</button>
              <button onClick={() => setResult(ShotResult.MISS)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.MISS ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/50 scale-105' : 'bg-slate-700 text-slate-300'}`}>MISS</button>
              <button onClick={() => setResult(ShotResult.BLOCK)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.BLOCK ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-105' : 'bg-slate-700 text-slate-300'}`}>BLOCK</button>
              <button onClick={() => setResult(ShotResult.TECHNICAL_FAULT)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.TECHNICAL_FAULT ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50 scale-105' : 'bg-slate-700 text-slate-300'}`}>FAULT</button>
              <button onClick={() => setResult(ShotResult.TWO_MIN)} className={`p-4 rounded-xl font-bold text-lg transition ${result === ShotResult.TWO_MIN ? 'bg-slate-500 text-white shadow-lg scale-105' : 'bg-slate-700 text-slate-300'}`}>2 MIN</button>
            </div>
          </div>

          {/* Step 2: Player Selection */}
          <div className={`transition-opacity duration-300 ${result ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">2. Player</h3>
            <div className="grid grid-cols-2 gap-3">
                {activePlayers.map(player => (
                    <button
                        key={player.id}
                        onClick={() => handlePlayerClick(player)}
                        className="flex items-center gap-3 bg-slate-700 hover:bg-blue-600 p-3 rounded-xl transition group text-left border border-slate-600 hover:border-blue-500"
                    >
                        <span className="text-xl font-mono font-bold text-white w-8">{player.number}</span>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-semibold text-slate-200 group-hover:text-white">{player.name}</span>
                            <span className="text-[10px] uppercase text-slate-400 group-hover:text-blue-200">{player.position}</span>
                        </div>
                    </button>
                ))}
                {activePlayers.length === 0 && (
                    <div className="col-span-2 text-center py-4 text-red-400 bg-red-900/20 rounded border border-red-900/50">
                        No players on court! Check Roster.
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShotInputModal;