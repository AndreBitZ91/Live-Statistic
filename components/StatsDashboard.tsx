import React from 'react';
import { Shot, ShotResult, CourtZone } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface StatsDashboardProps {
  shots: Shot[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ shots }) => {
  const COLORS = {
    GOAL: '#22c55e',
    SAVE: '#ef4444',
    MISS: '#eab308',
    BLOCK: '#a855f7'
  };

  // 1. Efficiency Stats
  const resultStats = [
    { name: 'Goals', value: shots.filter(s => s.result === ShotResult.GOAL).length, color: COLORS.GOAL },
    { name: 'Saves', value: shots.filter(s => s.result === ShotResult.SAVE).length, color: COLORS.SAVE },
    { name: 'Miss/Block', value: shots.filter(s => s.result === ShotResult.MISS || s.result === ShotResult.BLOCK).length, color: COLORS.MISS },
  ];

  // 2. Zone Efficiency
  const zones = Object.values(CourtZone);
  const zoneStats = zones.map(zone => {
    const zoneShots = shots.filter(s => s.zone === zone);
    const total = zoneShots.length;
    if (total === 0) return null;
    
    const goals = zoneShots.filter(s => s.result === ShotResult.GOAL).length;
    const efficiency = total > 0 ? Math.round((goals / total) * 100) : 0;
    
    return { name: zone, efficiency, total, goals };
  }).filter(Boolean); // Remove empty zones

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Overview Card */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Match Overview</h3>
        <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resultStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="text-3xl font-bold text-white">{shots.length}</span>
                    <span className="block text-xs text-slate-400 uppercase tracking-wider">Shots</span>
                </div>
            </div>
        </div>
      </div>

      {/* Zone Efficiency Card */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Efficiency by Zone (%)</h3>
        <div className="h-64 w-full">
            {zoneStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneStats} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                        cursor={{fill: '#334155'}}
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="efficiency" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Eff %">
                      {zoneStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.efficiency > 70 ? '#22c55e' : entry.efficiency < 40 ? '#ef4444' : '#3b82f6'} />
                      ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">
                    No data available yet
                </div>
            )}
        </div>
      </div>

      {/* Recent Log */}
      <div className="col-span-1 lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg max-h-60 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Shot Log</h3>
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Team</th>
                    <th className="px-4 py-2">Player</th>
                    <th className="px-4 py-2">Zone</th>
                    <th className="px-4 py-2">Result</th>
                </tr>
            </thead>
            <tbody>
                {[...shots].reverse().map(shot => (
                    <tr key={shot.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-4 py-2 text-slate-500">{new Date(shot.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</td>
                        <td className="px-4 py-2 font-semibold">{shot.team}</td>
                        <td className="px-4 py-2">#{shot.playerId}</td>
                        <td className="px-4 py-2">{shot.zone}</td>
                        <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${shot.result === ShotResult.GOAL ? 'bg-green-500/20 text-green-400' : 
                                  shot.result === ShotResult.SAVE ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {shot.result}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

    </div>
  );
};

export default StatsDashboard;