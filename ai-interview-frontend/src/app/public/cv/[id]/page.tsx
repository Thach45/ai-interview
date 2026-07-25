'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { cvApi } from '@/features/cvs/api/cv.api';
import { CvHtmlPreview } from '@/features/cvs/components/my-cv/CvHtmlPreview';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicCvPage() {
  const params = useParams() as { id: string };
  const id = params?.id;
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      cvApi.getPublicCvById(id)
        .then((data) => {
          setCv(data);
        })
        .catch((err) => {
          toast.error('Không thể tải CV, có thể CV này không tồn tại.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <h1 className="text-2xl font-semibold text-neutral-800">Không tìm thấy CV</h1>
        <p className="text-neutral-500 mt-2">CV này có thể đã bị xoá hoặc đường dẫn không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {cv.renderedHtml ? (
          <CvHtmlPreview html={cv.renderedHtml} />
        ) : cv.fileUrl ? (
          <div className="w-full h-[800px] border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <iframe 
              src={cv.fileUrl} 
              className="w-full h-full border-none" 
              title={cv.title}
            />
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-neutral-500">CV này chưa có nội dung để hiển thị.</p>
          </div>
        )}
      </div>
    </div>
  );
}
