import { useRouter } from 'next/navigation';
import { LayoutTemplate, Loader2, X } from 'lucide-react';
import { useCvTemplatesClient } from '../../hooks/useCvTemplatesClient';

interface TemplatePanelProps {
  onClose: () => void;
}

export function TemplatePanel({ onClose }: TemplatePanelProps) {
  const router = useRouter();
  const { templates, isLoading } = useCvTemplatesClient();
  console.log(templates)

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] border-r border-gray-200 overflow-hidden w-full lg:w-[480px] shrink-0 animate-in slide-in-from-left-4 duration-300">
      <div className="px-6 py-5 shrink-0 flex items-center justify-between bg-white shadow-sm z-10 border-b border-gray-100">
        <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
          <LayoutTemplate className="size-5 text-[#4b2c9a]" />
          Chọn mẫu CV khác
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#f8f9fa]">
        {isLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary size-8" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {templates.map((t: any) => (
              <div 
                key={t.id} 
                className="w-full group cursor-pointer bg-white p-2 rounded-xl border border-gray-100 hover:border-[#4b2c9a] hover:shadow-md transition-all" 
                onClick={() => {
                  const currentSearch = window.location.search;
                  router.push(`/cv-builder/${t.id}${currentSearch}`);
                  onClose();
                }}
              >
                <div className="w-full aspect-[210/297] bg-gray-50 rounded-lg overflow-hidden relative">
                  {t.thumbnailUrl ? (
                    <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <LayoutTemplate className="size-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#4b2c9a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[13px] font-bold text-gray-800 group-hover:text-[#4b2c9a] transition-colors line-clamp-2">{t.name}</p>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-500 text-sm">Không có mẫu nào</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
