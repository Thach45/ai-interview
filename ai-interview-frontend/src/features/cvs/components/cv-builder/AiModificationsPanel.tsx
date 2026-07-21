import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, History, CheckCircle2, XCircle } from 'lucide-react';

interface AiModification {
  id: number;
  type: string;
  title: string;
  desc: string;
}

export function AiModificationsPanel({
  open,
  onClose,
  modifications,
}: {
  open: boolean;
  onClose: () => void;
  modifications: AiModification[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-[440px] h-full bg-white shadow-2xl flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="size-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[14px]">Lịch sử Tối ưu AI</h3>
                  <p className="text-[10px] text-gray-500">{modifications.length} thay đổi</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-[0.95]"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50">
              {modifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <History className="size-10 text-gray-300" />
                  <p className="text-[13px] font-medium text-gray-400">Chưa có lịch sử tối ưu</p>
                </div>
              ) : (
                <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-gray-200">
                  {modifications.map((mod, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative flex gap-4 group"
                    >
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 shadow-sm shrink-0">
                        <CheckCircle2 size={18} />
                      </div>
                      <div className="flex-1 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                            {mod.type || 'TỐI ƯU'}
                          </span>
                          <span className="text-[12px] font-bold text-gray-800">{mod.title}</span>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed font-medium">{mod.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
