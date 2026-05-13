import React from 'react';
import { FileText, Calendar, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { UserCv } from '../type/cy.type';

interface CvCardProps {
  cv: UserCv;
  onDelete?: (id: string) => void;
}

const CvCard: React.FC<CvCardProps> = ({ cv, onDelete }) => {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100">
          <FileText className="text-red-600" size={24} />
        </div>
        
        <div className="flex items-center gap-1">
          <a 
            href={cv.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Xem CV"
          >
            <ExternalLink size={18} />
          </a>
          <button 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Xóa CV"
            onClick={() => onDelete?.(cv.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors text-base" title={cv.title}>
          {cv.title}
        </h4>
        
        <div className="flex items-center text-gray-400 gap-1.5">
          <Calendar size={14} />
          <span className="text-xs font-medium">
            Tải lên {format(new Date(cv.createdAt), 'dd MMMM, yyyy', { locale: vi })}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đã trích xuất AI</span>
        </div>
        
        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Sử dụng để phân tích
        </button>
      </div>
    </div>
  );
};

export default CvCard;
