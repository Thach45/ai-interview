import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, XCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <Play size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-lg">Đang kết nối luồng Live: {title}</p>
              <p className="text-sm mt-2">Video hướng dẫn đang được biên tập. Tính năng trải nghiệm trực tiếp sẽ sớm mở cho tài khoản của bạn.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
