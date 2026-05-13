import React, { useState } from 'react';
import { Plus, Search, Filter, Loader2, Inbox } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import CvCard from '../features/cvs/components/CvCard';
import UploadCvModal from '../features/cvs/components/UploadCvModal';
import { useCvs } from '../features/cvs/hooks/useCvs';

const MyCvs: React.FC = () => {
  const { cvs, isLoading, refetch } = useCvs();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCvs = cvs.filter(cv => 
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout maxWidth="1440px" className="px-8 lg:px-12 py-6">
      <div className="animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Quản lý CV của tôi</h1>
            <p className="text-gray-500 font-medium">Lưu trữ và quản lý các bản CV của bạn để phân tích AI nhanh chóng.</p>
          </div>
          
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-pressed hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Tải lên CV mới</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm theo tiêu đề CV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} />
            <span>Lọc</span>
          </button>
        </div>

        {/* CV Grid / Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-primary animate-spin mb-4" size={40} />
            <p className="text-gray-500 font-medium italic">Đang tải danh sách CV của bạn...</p>
          </div>
        ) : filteredCvs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCvs.map(cv => (
              <CvCard key={cv.id} cv={cv} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Inbox className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có CV nào được tải lên</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              Hãy tải bản CV đầu tiên của bạn lên để trải nghiệm sức mạnh phân tích từ AI.
            </p>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              Bắt đầu tải lên ngay
            </button>
          </div>
        )}

        {/* Upload Modal */}
        <UploadCvModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default MyCvs;
