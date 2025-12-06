import React, { useRef } from 'react';
import { Shot, ShotResult, TeamSide } from '../types';

interface CourtSVGProps {
  shots: Shot[];
  onCourtClick: (x: number, y: number) => void;
  selectedTeam: TeamSide;
}

const CourtSVG: React.FC<CourtSVGProps> = ({ shots, onCourtClick, selectedTeam }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onCourtClick(x, y);
  };

  const getShotColor = (result: ShotResult) => {
    switch (result) {
      case ShotResult.GOAL: return '#22c55e'; // green-500
      case ShotResult.SAVE: return '#ef4444'; // red-500
      case ShotResult.MISS: return '#eab308'; // yellow-500
      case ShotResult.BLOCK: return '#a855f7'; // purple-500
      default: return '#fff';
    }
  };

  return (
    <div className="relative w-full aspect-[2/1] bg-blue-500 rounded-lg overflow-hidden shadow-xl border-4 border-slate-800">
      <svg
        ref={svgRef}
        viewBox="0 0 100 50" // 40m x 20m aspect ratio
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      >
        {/* Floor */}
        <rect x="0" y="0" width="100" height="50" fill="#3b82f6" />
        
        {/* Court Markings - White Lines */}
        <g stroke="white" strokeWidth="0.5" fill="none">
          {/* Outer Boundary */}
          <rect x="0" y="0" width="100" height="50" />
          
          {/* Center Line */}
          <line x1="50" y1="0" x2="50" y2="50" />
          
          {/* Left Goal Area (6m) */}
          {/* In normalized 100x50 units, 6m is 15 units, 9m is 22.5 units */}
          <path d="M 0 50 L 5 50 A 1 1 0 0 0 15 25 A 1 1 0 0 0 5 0 L 0 0" fill="#60a5fa" stroke="white" />
          
          {/* Left Free Throw Line (9m) - Dashed */}
          <path d="M 0 50 L 5 50 A 1 1 0 0 0 22.5 25 A 1 1 0 0 0 5 0 L 0 0" strokeDasharray="1,1" />

          {/* Left 7m Line */}
          <line x1="17.5" y1="24" x2="17.5" y2="26" strokeWidth="0.5" />
          
          {/* Right Goal Area (6m) */}
          <path d="M 100 50 L 95 50 A 1 1 0 0 1 85 25 A 1 1 0 0 1 95 0 L 100 0" fill="#60a5fa" stroke="white" />
          
          {/* Right Free Throw Line (9m) */}
          <path d="M 100 50 L 95 50 A 1 1 0 0 1 77.5 25 A 1 1 0 0 1 95 0 L 100 0" strokeDasharray="1,1" />

          {/* Right 7m Line */}
          <line x1="82.5" y1="24" x2="82.5" y2="26" strokeWidth="0.5" />
        </g>

        {/* Goals */}
        <rect x="-1" y="22" width="1" height="6" fill="white" stroke="black" strokeWidth="0.2" />
        <rect x="100" y="22" width="1" height="6" fill="white" stroke="black" strokeWidth="0.2" />

        {/* Render Shots */}
        {shots.map((shot) => (
           <circle
             key={shot.id}
             cx={shot.x}
             cy={shot.y}
             r="1"
             fill={getShotColor(shot.result)}
             stroke="black"
             strokeWidth="0.2"
             className="transition-all hover:r-2"
           >
             <title>{`${shot.playerId} - ${shot.result} (${shot.zone})`}</title>
           </circle>
        ))}
      </svg>
    </div>
  );
};

export default CourtSVG;