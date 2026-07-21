import { useNavigate } from 'react-router-dom';
import {
  FileDown, Loader2, Check, LayoutTemplate, Sparkles,
} from 'lucide-react';
import { AiModificationsPanel } from './AiModificationsPanel';

// ===================== PROPS =====================

interface PreviewPanelProps {
  renderedHtml: string;
  isDirty: boolean;
  showAiMods: boolean;
  onShowAiMods: (v: boolean) => void;
  aiModifications: any[];
  onSave: () => void;
  onExportPdf: () => void;
  isSaving: boolean;
  isExporting: boolean;
}

// ===================== PREVIEW PANEL =====================

export function PreviewPanel({
  renderedHtml,
  isDirty,
  showAiMods,
  onShowAiMods,
  aiModifications,
  onSave,
  onExportPdf,
  isSaving,
  isExporting,
}: PreviewPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col relative bg-[#f0f2f5] overflow-hidden">
      {/* Top Floating Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex items-center h-10 px-1">
            <button
              onClick={() => navigate('/cv-builder/templates')}
              className="flex items-center gap-1.5 px-3 h-8 rounded-md text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LayoutTemplate className="size-4 text-[#4b2c9a]" />
              Đổi mẫu
            </button>
          </div>

          {aiModifications.length > 0 && (
            <button
              onClick={() => onShowAiMods(true)}
              className="h-10 px-4 rounded-lg bg-white shadow-sm border border-indigo-100 text-indigo-600 hover:bg-indigo-50 text-[13px] font-bold flex items-center gap-2 transition-all"
            >
              <Sparkles className="size-4" />
              Lịch sử AI ({aiModifications.length})
            </button>
          )}

          {isDirty && (
            <span className="text-[12px] font-bold text-amber-600 bg-amber-50 h-10 px-3 rounded-lg border border-amber-100 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Chưa lưu
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="h-10 px-4 rounded-lg bg-white text-gray-700 border border-gray-100 shadow-sm text-[13px] font-bold flex items-center gap-2 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
            Tải PDF
          </button>
          <button
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="h-10 px-6 rounded-lg bg-[#4b2c9a] text-white text-[14px] font-bold flex items-center gap-2 transition-all hover:bg-[#3d2380] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Hoàn tất
          </button>
        </div>
      </div>

      {/* A4 Document Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-10 flex justify-center items-start">
        <div className="shrink-0 w-[210mm] min-h-[297mm] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-sm overflow-hidden mb-10">
          {renderedHtml ? (
            <iframe
              title="CV Preview"
              srcDoc={renderedHtml}
              className="w-full h-[297mm] border-none"
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div className="w-full h-[297mm] flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="font-medium">Đang khởi tạo mẫu CV...</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Modifications Sidebar */}
      <AiModificationsPanel
        open={showAiMods}
        onClose={() => onShowAiMods(false)}
        modifications={aiModifications}
      />
    </div>
  );
}
