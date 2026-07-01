import React from 'react';
import { motion } from 'framer-motion';

interface PerformanceChartProps {
  data?: number[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data: propData }) => {
  const hasData = propData && propData.length > 0;
  const data = hasData ? propData : [];
  const labels = data.map((_, i) => `Lần ${i + 1}`);
  
  const width = 800;
  const height = 200;
  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (Math.max(data.length - 1, 1))) * usableWidth;
    const y = height - (padding + (d / 100) * usableHeight);
    return { x, y };
  });
  
  const pathData = points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '';
  const areaData = points.length > 0 ? `${pathData} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z` : '';

  return (
    <div className="bg-bg-canvas p-6 rounded-lg border border-border-hairline mb-10 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-text-primary uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
            Tiến độ luyện tập
          </h3>
          {hasData && (
             <p className="text-[12px] text-text-secondary mt-1">Dựa trên các phiên phỏng vấn gần đây của bạn</p>
          )}
        </div>
        {hasData && (
           <div className="flex gap-2">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">insights</span>
                Biểu đồ phân tích
              </span>
           </div>
        )}
      </div>
      
      {!hasData ? (
        <div className="h-[160px] w-full flex flex-col items-center justify-center opacity-60">
           <span className="material-symbols-outlined text-[40px] text-gray-300 mb-2">monitoring</span>
           <p className="text-[13px] text-text-secondary">Chưa có dữ liệu tiến độ. Hãy bắt đầu phiên phỏng vấn đầu tiên!</p>
        </div>
      ) : (
        <>
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
                {points.length > 1 && (
                  <motion.path 
                    initial={{ opacity: 0, d: `M ${points[0].x},${height - padding} L ${points.map(() => `${points[0].x},${height - padding}`).join(' L ')} Z` }}
                    animate={{ opacity: 1, d: areaData }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    fill="url(#chartGradient)" 
                  />
                )}

                {/* Line Path */}
                {points.length > 1 && (
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
                )}

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
        </>
      )}
    </div>
  );
}

