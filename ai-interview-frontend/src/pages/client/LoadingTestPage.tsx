import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingIndicator, type LoadingIndicatorType } from '../../shared/components/LoadingIndicator';
export const LoadingTestPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  // Determine the type safely
  const loadingType: LoadingIndicatorType = type === 'ai' ? 'ai' : 'normal';

  // Set appropriate titles based on type
  const title = loadingType === 'ai' 
    ? 'AI đang tổng hợp báo cáo phỏng vấn...' 
    : 'Đang tải dữ liệu trang...';
    
  const subtitle = loadingType === 'ai'
    ? 'Mô hình ngôn ngữ lớn đang phân tích hàng ngàn điểm dữ liệu từ buổi phỏng vấn của bạn. Vui lòng không đóng trang này.'
    : 'Chỉ mất vài giây thôi, vui lòng chờ.';

  return (
    <LoadingIndicator 
      type={loadingType} 
      title={title} 
      subtitle={subtitle} 
      fullScreen={true} 
    />
  );
};
