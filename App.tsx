import React, { useState } from 'react';
import HandballCourt from './components/HandballCourt';
import ShotInputModal from './components/ShotInputModal';
import RosterManager from './components/RosterManager';
import GameControls from './components/GameControls';
import StatsDashboard from './components/StatsDashboard';
import PlayerStatsModal from './components/PlayerStatsModal';
import { Shot, ShotResult, CourtZone, TeamSide, MatchMeta, TeamState, Player } from './types';
import { generateId } from './utils/courtUtils';
import { Download } from 'lucide-react';

const App: React.FC = () => {
  // --- Game State ---
  const [matchMeta, setMatchMeta] = useState<MatchMeta>({
    homeTeamName: 'Home Team',
    awayTeamName: 'Opponent',
    date: new Date().toISOString().split('T')[0],
    isLive: true,
    gameTime: 1800, // 30 minutes in seconds
    isTimerRunning: false,
    period: 1,
    homeScore: 0,
    awayScore: 0
  });

  // Only tracking HOME TEAM roster detailed stats for this version
  // Away team is just for score tracking in this simplified prompt version
  const [homeState, setHomeState] = useState<TeamState>({ roster: [], onCourt: [], suspensions: [] });
  const [shots, setShots] = useState<Shot[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState<{x: number, y: number} | null>(null);

  // Player Stats Modal State
  const [statsPlayer, setStatsPlayer] = useState<Player | null>(null);

  // --- Handlers ---

  const handleCourtClick = (x: number, y: number) => {
    setTempCoords({ x, y });
    setIsModalOpen(true);
  };

  const handleShotClick = (playerId: string) => {
    const player = homeState.roster.find(p => p.id === playerId);
    if (player) {
      setStatsPlayer(player);
    }
  };

  const handleSaveShot = (result: ShotResult, playerId: string, zone: CourtZone, team: TeamSide) => {
    if (!tempCoords) return;

    const newShot: Shot = {
      id: generateId(),
      x: tempCoords.x,
      y: tempCoords.y,
      result,
      playerId,
      zone, // Zone calculation logic can be re-added if needed, currently passing UNKNOWN or manual
      team,
      timestamp: Date.now(),
      gameTime: matchMeta.gameTime
    };

    setShots(prev => [...prev, newShot]);

    // Update Score
    if (result === ShotResult.GOAL) {
        setMatchMeta(prev => ({ ...prev, homeScore: prev.homeScore + 1 }));
    }

    setIsModalOpen(false);
  };

  // Simple Opponent Score Handler
  const handleOpponentGoal = () => {
      setMatchMeta(prev => ({ ...prev, awayScore: prev.awayScore + 1 }));
      // Optional: Add a "Save" or "Goal Conceded" logic here for GK stats later
  };

  const activePlayers = homeState.roster.filter(p => homeState.onCourt.includes(p.id));

  // --- Export ---
  const handleExport = () => {
    const exportData = { matchMeta, homeState, shots };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `handball_match_${matchMeta.date}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-2 lg:p-6 flex flex-col gap-4 overflow-hidden h-screen">
      
      {/* Top Bar: Scoreboard & Timer */}
      <header className="flex-none grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Scoreboard */}
        <div className="md:col-span-8 grid grid-cols-3 bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-900/20">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">HOME</span>
                <span className="text-5xl font-black text-white">{matchMeta.homeScore}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-slate-700 bg-slate-900/50">
                <span className="text-xl font-mono text-slate-500">VS</span>
                <span className="text-xs text-slate-600 mt-1">Period {matchMeta.period}</span>
            </div>
             <div className="flex flex-col items-center justify-center p-4 bg-red-900/20 relative group cursor-pointer" onClick={handleOpponentGoal}>
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">AWAY</span>
                <span className="text-5xl font-black text-white">{matchMeta.awayScore}</span>
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-xs font-bold bg-red-600 px-2 py-1 rounded text-white">+1 Goal</span>
                </div>
            </div>
        </div>

        {/* Timer */}
        <div className="md:col-span-4">
            <GameControls 
                gameTime={matchMeta.gameTime}
                isTimerRunning={matchMeta.isTimerRunning}
                setGameTime={(t) => setMatchMeta(prev => ({...prev, gameTime: t}))}
                setIsTimerRunning={(r) => setMatchMeta(prev => ({...prev, isTimerRunning: r}))}
            />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT: Roster Management */}
        <div className="lg:col-span-3 min-h-0 overflow-hidden">
          <RosterManager 
            teamName={matchMeta.homeTeamName}
            side={TeamSide.HOME}
            state={homeState}
            onUpdateState={setHomeState}
            onShowPlayerStats={(player) => setStatsPlayer(player)}
          />
        </div>

        {/* CENTER: Action Map */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto">
          <div className="bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center justify-center h-full">
             {/* Container to maintain aspect ratio */}
             <div className="w-full max-w-md">
                <HandballCourt 
                    shots={shots}
                    onCourtClick={handleCourtClick}
                    onShotClick={handleShotClick}
                />
                <div className="text-center text-slate-500 text-xs mt-2">
                  Tap court to record action • Tap dot to view stats
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: Stats & Log */}
        <div className="lg:col-span-4 min-h-0 overflow-y-auto bg-slate-800 rounded-xl border border-slate-700">
             <StatsDashboard shots={shots} />
        </div>

      </div>

      <div className="flex justify-end p-2">
            <button onClick={handleExport} className="flex items-center gap-2 text-slate-500 hover:text-white text-xs">
                <Download size={14} /> Download Match Data
            </button>
      </div>

      {/* New Shot Modal */}
      <ShotInputModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShot}
        activePlayers={activePlayers}
      />

      {/* Player Stats Modal */}
      <PlayerStatsModal 
        isOpen={!!statsPlayer}
        onClose={() => setStatsPlayer(null)}
        player={statsPlayer}
        shots={shots}
      />

    </div>
  );
};

export default App;