import React from 'react';
import { Player, Shot, ShotResult } from '../types';
import { X, Target, Shield, Activity, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PlayerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  shots: Shot[];
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({ isOpen, onClose, player, shots }) => {
  if (!isOpen || !player) return null;

  // Filter shots relevant to this player (where they are the shooter)
  const playerShots = shots.filter(s => s.playerId === player.id);
  
  // Calculate Stats
  const totalShots = playerShots.length;
  const goals = playerShots.filter(s => s.result === ShotResult.GOAL).length;
  // Misses include actual misses, blocked shots, and turnovers
  const misses = playerShots.filter(s => 
    s.result === ShotResult.MISS || 
    s.result === ShotResult.BLOCK || 
    s.result === ShotResult.TURNOVER
  ).length;
  // Saves mean the opponent GK saved it
  const saves = playerShots.filter(s => s.result === ShotResult.SAVE).length;
  
  const efficiency = totalShots > 0 ? Math.round((goals / totalShots) * 100) : 0;

  const data = [
    { name: 'Goals', value: goals, color: '#22c55e' },
    { name: 'Saved', value: saves, color: '#ef4444' },
    { name: 'Miss/Block', value: misses, color: '#eab308' },
  ].filter(d => d.value > 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900/50 rounded-t-xl">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                <span className="text-2xl font-mono font-bold text-white">{player.number}</span>
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-800 uppercase font-bold tracking-wider">{player.position}</span>
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded uppercase tracking-wider">{player.isGoalkeeper ? 'Goalkeeper' : 'Field Player'}</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-semibold uppercase tracking-wider">
                        <Activity size={14} /> Total Shots
                    </div>
                    <div className="text-3xl font-bold text-white">{totalShots}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                    <div className="flex items-center gap-2 text-green-400 mb-1 text-sm font-semibold uppercase tracking-wider">
                        <Target size={14} /> Goals
                    </div>
                    <div className="text-3xl font-bold text-green-400">{goals}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                    <div className="flex items-center gap-2 text-blue-400 mb-1 text-sm font-semibold uppercase tracking-wider">
                        <Percent size={14} /> Efficiency
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{efficiency}%</div>
                </div>
                 <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                    <div className="flex items-center gap-2 text-red-400 mb-1 text-sm font-semibold uppercase tracking-wider">
                        <Shield size={14} /> No Goal
                    </div>
                    <div className="text-3xl font-bold text-red-400">{saves + misses}</div>
                </div>
            </div>

            {/* Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chart */}
                <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50 h-64 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider border-b border-slate-700 pb-2">Shot Distribution</h3>
                    {totalShots > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex-1 flex items-center justify-center text-slate-500 italic">No shots recorded</div>
                    )}
                </div>

                {/* Shot Log */}
                <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50 h-64 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider border-b border-slate-700 pb-2">Recent Attempts</h3>
                    <div className="overflow-y-auto flex-1 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-600">
                        {playerShots.slice().reverse().map(shot => (
                            <div key={shot.id} className="flex justify-between items-center text-sm p-2 bg-slate-800 rounded border border-slate-700/50 hover:bg-slate-700 transition">
                                <div className="flex gap-2 items-center">
                                    <span className="text-slate-400 font-mono text-xs">{new Date(shot.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                    <span className="font-mono text-xs text-slate-500 bg-slate-900 px-1 rounded">{shot.zone}</span>
                                </div>
                                <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide
                                    ${shot.result === ShotResult.GOAL ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                      shot.result === ShotResult.SAVE ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}
                                `}>
                                    {shot.result}
                                </span>
                            </div>
                        ))}
                        {playerShots.length === 0 && <div className="text-center text-slate-500 mt-10">No activity yet.</div>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal;