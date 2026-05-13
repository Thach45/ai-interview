import React from 'react';
import { X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useCvs } from '../hooks/useCvs';
import { useNavigate } from 'react-router-dom';

interface SelectCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cvId: string) => void;
}

const SelectCvModal: React.FC<SelectCvModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { cvs, isLoading } = useCvs({ enabled: isOpen });
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Chọn CV để phân tích</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="text-primary animate-spin mb-4" size={32} />
              <p className="text-sm text-gray-500 font-medium">Đang tải danh sách CV...</p>
            </div>
          ) : cvs.length > 0 ? (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div 
                  key={cv.id}
                  onClick={() => onSelect(cv.id)}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="text-red-600" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                        {cv.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tải lên: {new Date(cv.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-300" size={28} />
              </div>
              <p className="text-gray-600 font-medium mb-4">Bạn chưa có CV nào trong hệ thống</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/my-cvs');
                }}
                className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-pressed transition-colors shadow-lg shadow-primary/20"
              >
                Quản lý CV ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCvModal;
