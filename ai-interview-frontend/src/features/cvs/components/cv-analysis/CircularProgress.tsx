import React from 'react';
import { motion } from 'framer-motion';

export const CircularProgress = ({ score }: { score: number }) => {
  const radius = 35;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-green-500";
  if (score < 50) color = "text-red-500";
  else if (score < 75) color = "text-amber-500";
  else color = "text-primary";

  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-gray-100"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold tracking-tight ${color}`}>{score}%</span>
      </div>
    </div>
  );
};
