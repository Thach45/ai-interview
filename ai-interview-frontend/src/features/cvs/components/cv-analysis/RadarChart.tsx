import React from 'react';

export const RadarChart = ({ data }: { data: any[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.sin(index * angleStep);
    const y = center - r * Math.cos(index * angleStep);
    return `${x},${y}`;
  };

  const userPolygon = data.map((d, i) => getPoint(d.user, i)).join(" ");
  const reqPolygon = data.map((d, i) => getPoint(d.required, i)).join(" ");

  return (
    <div className="relative flex items-center justify-center w-full h-[320px]">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background webs */}
        {[20, 40, 60, 80, 100].map((level) => (
          <polygon
            key={level}
            points={data.map((_, i) => getPoint(level, i)).join(" ")}
            fill="none"
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
            strokeDasharray={level === 100 ? "0" : "4 4"}
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.sin(i * angleStep)}
            y2={center - radius * Math.cos(i * angleStep)}
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
          />
        ))}

        {/* Required Polygon */}
        <polygon
          points={reqPolygon}
          fill="rgba(245, 158, 11, 0.1)"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* User Polygon */}
        <polygon
          points={userPolygon}
          fill="rgba(124, 58, 237, 0.2)"
          stroke="#7c3aed"
          strokeWidth="2"
        />

        {/* Data points for user */}
        {data.map((d, i) => {
          const [x, y] = getPoint(d.user, i).split(",");
          return (
            <circle key={`user-pt-${i}`} cx={x} cy={y} r="4" fill="#7c3aed" />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.sin(i * angleStep);
          const y = center - labelRadius * Math.cos(i * angleStep);
          
          let textAnchor = "middle";
          if (Math.abs(Math.sin(i * angleStep)) > 0.1) {
            textAnchor = Math.sin(i * angleStep) > 0 ? "start" : "end";
          }
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor as any}
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-gray-500"
            >
              {d.skill || d.name}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-[-10px] flex gap-4 text-[12px] font-medium">
        <div className="flex items-center gap-1.5 text-primary">
          <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
          CV của bạn
        </div>
        <div className="flex items-center gap-1.5 text-amber-500">
          <div className="w-3 h-3 rounded-full bg-amber-500/10 border border-amber-500 border-dashed"></div>
          Yêu cầu Job
        </div>
      </div>
    </div>
  );
};
