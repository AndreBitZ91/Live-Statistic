import React from 'react';
import { Player, TeamState, TeamSide, Shot } from '../types';
import { parseRosterFile } from '../utils/xlsxUtils';
import { Upload, ArrowUp, ArrowDown, Info } from 'lucide-react';

interface RosterManagerProps {
  teamName: string;
  side: TeamSide;
  state: TeamState;
  onUpdateState: (newState: TeamState) => void;
  onShowPlayerStats?: (player: Player) => void;
}

const RosterManager: React.FC<RosterManagerProps> = ({ teamName, side, state, onUpdateState, onShowPlayerStats }) => {
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const players = await parseRosterFile(file);
        // Reset lineup when new roster loads
        onUpdateState({
          ...state,
          roster: players,
          onCourt: [] 
        });
      } catch (err) {
        alert('Failed to parse file. Ensure headers: Numero, Nome, Posicao.');
      }
    }
  };

  const moveToCourt = (playerId: string) => {
    if (state.onCourt.length >= 7) {
      alert("Maximum 7 players allowed on court!");
      return;
    }
    onUpdateState({
      ...state,
      onCourt: [...state.onCourt, playerId]
    });
  };

  const moveToBench = (playerId: string) => {
    onUpdateState({
      ...state,
      onCourt: state.onCourt.filter(id => id !== playerId)
    });
  };

  const activePlayers = state.roster.filter(p => state.onCourt.includes(p.id));
  const benchPlayers = state.roster.filter(p => !state.onCourt.includes(p.id));

  // Sort by number
  activePlayers.sort((a,b) => parseInt(a.number) - parseInt(b.number));
  benchPlayers.sort((a,b) => parseInt(a.number) - parseInt(b.number));

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col h-full shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
        <h3 className="font-bold text-lg text-white">{teamName} Roster</h3>
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/20">
          <Upload size={14} /> Import XLSX
          <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
        </label>
      </div>

      {/* ACTIVE COURT (Limit 7) */}
      <div className="mb-4 flex-1">
        <h4 className="text-xs uppercase text-green-400 font-bold mb-2 flex justify-between items-center">
            <span>On Court</span>
            <span className="bg-green-900/30 px-2 py-0.5 rounded text-green-300">{state.onCourt.length} / 7</span>
        </h4>
        <div className="space-y-1">
          {activePlayers.map(player => (
            <div key={player.id} className="flex justify-between items-center bg-green-900/10 border border-green-900/30 p-2 rounded hover:bg-green-900/20 transition group">
              <div className="flex items-center gap-2">
                 <span className="font-mono font-bold text-lg w-8 text-white">{player.number}</span>
                 <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-200 leading-tight">{player.name}</span>
                    <span className="text-[10px] text-slate-500">{player.position}</span>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                 {onShowPlayerStats && (
                    <button onClick={() => onShowPlayerStats(player)} className="p-2 text-slate-400 hover:text-blue-400 transition">
                        <Info size={16} />
                    </button>
                 )}
                 <button onClick={() => moveToBench(player.id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition">
                   <ArrowDown size={14} />
                 </button>
              </div>
            </div>
          ))}
          {activePlayers.length === 0 && <div className="text-center text-xs text-slate-600 py-4 italic">No players on court</div>}
        </div>
      </div>

      {/* BENCH */}
      <div className="flex-1 overflow-y-auto border-t border-slate-700 pt-4">
        <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Bench ({benchPlayers.length})</h4>
        <div className="space-y-1">
          {benchPlayers.map(player => (
            <div key={player.id} className="flex justify-between items-center hover:bg-slate-700/50 p-2 rounded transition group">
              <div className="flex items-center gap-2">
                 <span className="font-mono font-bold text-sm w-6 text-slate-500 group-hover:text-slate-300">{player.number}</span>
                 <span className="text-sm text-slate-400 group-hover:text-slate-200">{player.name}</span>
              </div>
              <div className="flex items-center gap-1">
                  {onShowPlayerStats && (
                    <button onClick={() => onShowPlayerStats(player)} className="p-1.5 text-slate-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition">
                        <Info size={14} />
                    </button>
                  )}
                  <button onClick={() => moveToCourt(player.id)} className="p-1.5 bg-slate-700 hover:bg-green-600 rounded text-slate-400 hover:text-white transition">
                    <ArrowUp size={14} />
                  </button>
              </div>
            </div>
          ))}
          {benchPlayers.length === 0 && <div className="text-center text-xs text-slate-600 py-4 italic">Roster empty. Import Excel.</div>}
        </div>
      </div>

    </div>
  );
};

export default RosterManager;