import React, { useState } from 'react';
import { ProjectHourlyTraffic } from '../../types';

interface TrafficAreaChartProps {
  data: ProjectHourlyTraffic[];
  height?: number;
}

export const TrafficAreaChart: React.FC<TrafficAreaChartProps> = ({ data, height = 180 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-slate-200">
        No hay datos de tráfico por hora disponibles
      </div>
    );
  }

  const maxVisits = Math.max(...data.map(d => d.visits), 50);
  const chartWidth = 540;
  const chartHeight = height - 40;
  const paddingX = 25;
  const paddingY = 15;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - (d.visits / maxVisits) * (chartHeight - 2 * paddingY);
    return { x, y, ...d, index };
  });

  // Create smooth SVG path
  const linePath = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="w-full relative">
      {/* Chart Top Header & Active Inspection Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38A5F8] animate-pulse" />
          <span className="text-[11px] font-bold text-slate-700">Tráfico por Hora (Hoy)</span>
        </div>
        {activePoint && (
          <div className="text-[11px] font-mono bg-blue-50 text-[#1d8fe6] px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <span className="text-slate-500 font-sans">{activePoint.hour}:</span>
            <strong>{activePoint.visits.toLocaleString()} visitas</strong>
            <span className="text-slate-400">({activePoint.requests.toLocaleString()} reqs)</span>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-blue-50/30 to-slate-50/20 border border-slate-100 p-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38A5F8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38A5F8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#CBD5E1"
          />

          {/* Area fill */}
          <path d={areaPath} fill="url(#trafficGradient)" />

          {/* Main curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#38A5F8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Interactive Nodes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={chartHeight - paddingY}
                    stroke="#38A5F8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#1d8fe6' : '#ffffff'}
                  stroke="#38A5F8"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Invisible larger hit area for easy touch/mouse targeting */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={18}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Hour Labels */}
        <div className="flex justify-between px-3 pt-1 text-[10px] font-mono text-slate-400">
          {data.map((d, i) => (
            <span key={i} className="text-center">{d.hour}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
