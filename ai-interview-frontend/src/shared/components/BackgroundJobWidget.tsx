import { useState, useEffect } from 'react';
import { useBackgroundJobStore,type BackgroundJob } from '../../store/backgroundJobStore';
import { Loader2, CheckCircle, XCircle, X, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PROGRESS_MESSAGES = [
  'Đang khởi tạo AI...',
  'Đang đọc và trích xuất dữ liệu...',
  'Đang phân tích kỹ năng...',
  'Đang đánh giá mức độ phù hợp...',
  'Đang tổng hợp kết quả...',
  'Đang hoàn thiện báo cáo...'
];

const JobItemView = ({ job, removeJob }: { job: BackgroundJob; removeJob: (id: string) => void }) => {
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    if (job.status !== 'processing') return;
    
    // Tính toán index dựa trên thời gian đã trôi qua
    const elapsedMs = Date.now() - job.createdAt;
    const initialIndex = Math.min(Math.floor(elapsedMs / 4000), PROGRESS_MESSAGES.length - 1);
    setProgressIndex(initialIndex);

    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        if (prev >= PROGRESS_MESSAGES.length - 1) return prev; // Dừng ở tin nhắn cuối
        return prev + 1;
      });
    }, 4000); // Đổi text mỗi 4 giây

    return () => clearInterval(interval);
  }, [job.status, job.createdAt]);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          {job.status === 'processing' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          {job.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
          {job.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {job.title}
          </span>
          {job.status === 'processing' && (
            <span className="text-xs text-blue-500/80 truncate animate-pulse mt-0.5">
              {PROGRESS_MESSAGES[progressIndex]}
            </span>
          )}
          {job.status === 'success' && (
            <span className="text-xs text-green-500 truncate mt-0.5">Phân tích thành công</span>
          )}
          {job.errorMessage && (
            <span className="text-xs text-red-500 truncate mt-0.5">{job.errorMessage}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {job.status === 'success' && job.resultUrl && (
          <Link
            href={job.resultUrl}
            className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50"
            title="Xem kết quả"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
        <button
          onClick={() => removeJob(job.id)}
          className="p-1.5 text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Xóa"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const BackgroundJobWidget = () => {
  const { jobs, removeJob, clearAll } = useBackgroundJobStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const activeJobsCount = jobs.filter((j) => j.status === 'processing').length;
  const isAllDone = activeJobsCount === 0;
  
  // Hiển thị tối đa 2 jobs
  const displayJobs = jobs.slice(0, 2);
  const remainingCount = jobs.length - 2;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {jobs.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 md:w-96 overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                {isAllDone ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {isAllDone ? 'Đã hoàn tất các tác vụ' : `Đang xử lý ${activeJobsCount} tác vụ...`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Đóng tất cả"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Job List */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="max-h-80 overflow-y-auto"
                >
                  <div className="p-2 flex flex-col gap-1">
                    {displayJobs.map((job) => (
                      <JobItemView key={job.id} job={job} removeJob={removeJob} />
                    ))}
                    {remainingCount > 0 && (
                      <div className="text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 mt-1">
                        + {remainingCount} tác vụ khác
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
