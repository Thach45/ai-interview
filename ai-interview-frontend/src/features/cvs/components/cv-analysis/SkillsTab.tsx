import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart } from './RadarChart';

export const SkillsTab = ({ result }: { result: any }) => {
  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex gap-8"
    >
      <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
        <h3 className="text-[15px] font-bold text-gray-900 mb-6 w-full text-left">Biểu đồ Kỹ năng</h3>
        <RadarChart data={result.skillsAnalysis} />
      </div>
      
      <div className="w-[40%] flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-gray-900 mb-2">Chi tiết mức độ phù hợp</h3>
        {result.skillsAnalysis.map((skill: any, i: number) => {
          const gap = skill.required - skill.user;
          const isGood = gap <= 0;
          
          return (
            <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-bold text-gray-800">{skill.skill}</span>
                <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${
                  isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isGood ? 'Đạt yêu cầu' : `Thiếu hụt ${gap}%`}
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-16 uppercase font-bold tracking-wider">Bạn có</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${skill.user}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 w-6 text-right">{skill.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-500 w-16 uppercase font-bold tracking-wider">Yêu cầu</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${skill.required}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 w-6 text-right">{skill.required}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
};
