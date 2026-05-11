import React from 'react';
import { motion } from 'framer-motion';

export const PerformanceChart = () => {
  const data = [45, 52, 48, 70, 65, 85, 80];
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  const width = 800;
  const height = 200;
  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * usableWidth;
    const y = height - (padding + (d / 100) * usableHeight);
    return { x, y };
  });
  
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaData = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="bg-bg-canvas p-6 rounded-lg border border-border-hairline mb-10 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-text-primary uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
            Tiến độ luyện tập
          </h3>
          <p className="text-[12px] text-text-secondary mt-1">Điểm trung bình tăng 12% so với tuần trước</p>
        </div>
        <div className="flex gap-2">
           <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-md flex items-center gap-1">
             <span className="material-symbols-outlined text-[14px]">trending_up</span>
             +15% Score
           </span>
        </div>
      </div>
      
      <div className="relative h-[160px] w-full">
         <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(v => (
              <line 
                key={v}
                x1={padding} 
                y1={height - (padding + (v/100) * usableHeight)} 
                x2={width - padding} 
                y2={height - (padding + (v/100) * usableHeight)} 
                stroke="var(--color-border-hairline)" 
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area */}
            <motion.path 
              initial={{ opacity: 0, d: `M ${points[0].x},${height - padding} L ${points.map(() => `${points[0].x},${height - padding}`).join(' L ')} Z` }}
              animate={{ opacity: 1, d: areaData }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              fill="url(#chartGradient)" 
            />

            {/* Line Path */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={pathData} 
              fill="none" 
              stroke="var(--color-primary)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => (
              <motion.g 
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="cursor-pointer"
              >
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="5" 
                  fill="white" 
                  stroke="var(--color-primary)" 
                  strokeWidth="2.5" 
                  className="hover:r-7 transition-all"
                />
                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                  {data[i]}%
                </text>
              </motion.g>
            ))}
         </svg>
      </div>

      <div className="flex justify-between mt-4 px-2">
        {labels.map((l, i) => (
          <span key={i} className="text-[11px] font-bold text-text-tertiary uppercase">{l}</span>
        ))}
      </div>
    </div>
  );
}
