import React, { useState, useRef } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  TECHNICAL_SKILLS: 'Kỹ năng kỹ thuật',
  EXPERIENCE: 'Kinh nghiệm',
  SOFT_SKILLS: 'Kỹ năng mềm',
  EDUCATION: 'Học vấn',
  PROJECT_RELEVANCE: 'Độ phù hợp dự án',
};

export const ScoringRadarChart = ({ data }: { data: any[] }) => {
  const [tooltip, setTooltip] = useState<{ mouseX: number; mouseY: number; detail: any } | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const size = 320;
  const center = size / 2;
  const radius = (size / 2) - 55;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.sin(index * angleStep);
    const y = center - r * Math.cos(index * angleStep);
    return { x, y };
  };

  const polygon = data.map((d, i) => { const p = getPoint(d.score, i); return `${p.x},${p.y}`; }).join(' ');

  const showTooltip = (e: React.MouseEvent, d: any) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setTooltip({ mouseX: e.clientX, mouseY: e.clientY, detail: d });
  };

  const scheduleHide = () => {
    hideTimeout.current = setTimeout(() => setTooltip(null), 120);
  };

  const cancelHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg width={size} height={size} className="overflow-visible">
        {[20, 40, 60, 80, 100].map(level => (
          <polygon
            key={level}
            points={data.map((_, i) => { const p = getPoint(level, i); return `${p.x},${p.y}`; }).join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray={level === 100 ? '0' : '4 4'}
          />
        ))}
        {data.map((_, i) => {
          const outer = getPoint(100, i);
          return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="1" />;
        })}
        <polygon points={polygon} fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="2" />
        {data.map((d, i) => {
          const p = getPoint(d.score, i);
          const label = getPoint(114, i);
          return (
            <g key={i}>
              <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#6b7280">
                {CATEGORY_LABELS[d.category]?.split(' ').map((w: string, wi: number) => (
                  <tspan key={wi} x={label.x} dy={wi === 0 ? 0 : 13}>{w}</tspan>
                ))}
              </text>
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c3aed">
                {d.score}
              </text>
              <circle
                cx={p.x} cy={p.y} r="8"
                fill="#7c3aed"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, d)}
                onMouseLeave={scheduleHide}
              />
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="fixed z-50 w-60 max-h-44 overflow-y-auto rounded-2xl bg-gray-900 text-white shadow-2xl border border-white/10"
          style={{ left: tooltip.mouseX + 14, top: tooltip.mouseY - 20 }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <div className="sticky top-0 bg-gray-800 px-3 pt-3 pb-1.5 rounded-t-2xl border-b border-white/10">
            <p className="font-bold text-[12px] text-purple-300">
              {CATEGORY_LABELS[tooltip.detail.category]}
              <span className="ml-2 text-white font-extrabold">{tooltip.detail.score}/100</span>
            </p>
          </div>
          <div className="px-3 pb-3 pt-1.5">
            <p className="text-[11px] text-gray-300 leading-relaxed">{tooltip.detail.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};
