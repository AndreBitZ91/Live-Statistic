import React, { useRef } from 'react';
import { Shot, ShotResult } from '../types';

interface HandballCourtProps {
  shots: Shot[];
  onCourtClick: (x: number, y: number) => void;
  onShotClick?: (playerId: string) => void;
}

// Vertical Half Court
// ViewBox: 0 0 20 15 (Width 20m, Depth 15m - slightly more than half to show 9m line clearly)
// Goal is at Top Center (10, 0)
const HandballCourt: React.FC<HandballCourtProps> = ({ shots, onCourtClick, onShotClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Normalize to 0-100 percentage for storage
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onCourtClick(x, y);
  };

  const handleShotClick = (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation(); // Prevent court click
    if (onShotClick) {
      onShotClick(playerId);
    }
  };

  const getShotColor = (result: ShotResult) => {
    switch (result) {
      case ShotResult.GOAL: return '#22c55e'; // Green
      case ShotResult.SAVE: return '#ef4444'; // Red
      case ShotResult.MISS: return '#eab308'; // Yellow
      case ShotResult.BLOCK: return '#a855f7'; // Purple
      case ShotResult.TURNOVER: return '#94a3b8'; // Slate
      case ShotResult.TECHNICAL_FAULT: return '#f97316'; // Orange
      default: return '#fff';
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-blue-600 rounded-lg overflow-hidden shadow-xl border-4 border-slate-800">
      <svg
        ref={svgRef}
        viewBox="0 0 20 14" // 20m wide, 14m deep (Attacking Half)
        className="w-full h-full cursor-crosshair touch-manipulation"
        onClick={handleClick}
      >
        {/* Floor */}
        <rect x="0" y="0" width="20" height="15" fill="#3b82f6" />
        
        {/* Markings Group */}
        <g stroke="white" strokeWidth="0.1" fill="none">
          
          {/* Goal Line (Top) */}
          <line x1="0" y1="0" x2="20" y2="0" strokeWidth="0.2" />
          
          {/* Goal (3m wide) at center (10,0) */}
          <rect x="8.5" y="-1" width="3" height="1" fill="repeating-linear-gradient(45deg, white, white 0.2px, red 0.2px, red 0.4px)" stroke="black" strokeWidth="0.1" />

          {/* 4m Line (GK Limit) - Small dash at center */}
          <line x1="9.8" y1="4" x2="10.2" y2="4" strokeWidth="0.2" />

          {/* 6m Line (Goal Area) 
             Center (10,0), Radius 6.
             Start Angle: 0 (Right), End Angle: 180 (Left)
             SVG Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
          */}
          {/* Main Arc */}
          <path d="M 4 0 A 6 6 0 0 0 16 0" fill="#60a5fa" stroke="white" strokeWidth="0.15" />
          
          {/* 7m Line (Penalty) */}
          <line x1="9.5" y1="7" x2="10.5" y2="7" strokeWidth="0.2" />

          {/* 9m Line (Free Throw) - Dashed Arc */}
          <path d="M 1 0 A 9 9 0 0 0 19 0" strokeDasharray="0.5, 0.5" strokeWidth="0.15" />

          {/* Substitution Lines (Side) at 4.5m mark? Just visual boundaries */}
          <line x1="0" y1="0" x2="0" y2="15" stroke="white" strokeWidth="0.2" />
          <line x1="20" y1="0" x2="20" y2="15" stroke="white" strokeWidth="0.2" />

        </g>

        {/* Render Shots - Scaled from 0-100% back to coordinate system 20x14 */}
        {shots.map((shot) => (
           <circle
             key={shot.id}
             cx={(shot.x / 100) * 20}
             cy={(shot.y / 100) * 14}
             r="0.5"
             fill={getShotColor(shot.result)}
             stroke="black"
             strokeWidth="0.05"
             className="transition-all hover:r-0.8 cursor-pointer hover:stroke-white hover:stroke-width-0.1"
             onClick={(e) => handleShotClick(e, shot.playerId)}
           />
        ))}
      </svg>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded text-[10px] text-white pointer-events-none">
        Goal Side (Attack)
      </div>
    </div>
  );
};

export default HandballCourt;