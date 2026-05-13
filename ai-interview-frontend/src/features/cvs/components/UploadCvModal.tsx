import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCvs } from '../hooks/useCvs';

interface UploadCvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadCvModal: React.FC<UploadCvModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadCv, isUploading } = useCvs({ enabled: false });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Chỉ chấp nhận định dạng file PDF');
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace('.pdf', ''));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError(null);

    try {
      await uploadCv({ file, title });
      onClose();
      // Reset state
      setFile(null);
      setTitle('');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Đã xảy ra lỗi khi tải lên CV');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Tải lên CV mới</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-primary" size={28} />
              </div>
              <p className="text-sm font-medium text-gray-700">Nhấn để chọn hoặc kéo thả file</p>
              <p className="text-xs text-gray-400 mt-1">Định dạng hỗ trợ: PDF (Tối đa 10MB)</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="text-red-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-xs text-red-600 font-medium hover:underline">
                  Thay đổi
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Tiêu đề CV</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: CV Software Engineer - Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-1">
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              disabled={!file || isUploading}
              onClick={handleUpload}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-pressed transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Xác nhận tải lên
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCvModal;
