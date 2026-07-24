import { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import Handlebars from 'handlebars';
import DOMPurify from 'dompurify';
import { AlertCircle } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useCvTemplateDetail } from '../../features/cvs/hooks/useCvTemplateDetail';
import { useSaveBuilderCv, useBuilderCvDetail, useExportBuilderPdf } from '../../features/cvs/hooks/useBuilderCv';
import type { CvFormData } from '../../features/cvs/type/builder-cv.type';
import { DEFAULT_CV_FORM } from '../../features/cvs/type/builder-cv.type';
import { LoadingIndicator } from '../../shared/components/LoadingIndicator';
import { toast } from 'sonner';
import { FormPanel } from '../../features/cvs/components/cv-builder/FormPanel';
import { PreviewPanel } from '../../features/cvs/components/cv-builder/PreviewPanel';
import { TemplatePanel } from '../../features/cvs/components/cv-builder/TemplatePanel';
import { STORAGE_KEY, FORM_SECTIONS, isSectionComplete, safeMergeCvData, getEmptyItem } from '../../features/cvs/components/cv-builder/builder-types';

// ===================== MAIN PAGE =====================

const CvBuilderPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('id');

  const { data: template, isLoading: templateLoading } = useCvTemplateDetail(templateId);
  const { data: existingCv, isLoading: existingLoading } = useBuilderCvDetail(editId || undefined);
  const saveMutation = useSaveBuilderCv();
  const exportPdfMutation = useExportBuilderPdf();

  const [cvData, setCvData] = useState<CvFormData>(DEFAULT_CV_FORM);
  const [activeSection, setActiveSection] = useState('personal');
  const [isDirty, setIsDirty] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showAiMods, setShowAiMods] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const deferredCvData = useDeferredValue(cvData);
  const aiModifications = existingCv?.aiModifications || [];

  // Section completion status
  const sectionStatus = useMemo(() => {
    const status: Record<string, boolean> = {};
    FORM_SECTIONS.forEach((s) => { status[s.id] = isSectionComplete(s.id, cvData); });
    return status;
  }, [cvData]);

  const completedCount = useMemo(
    () => Object.values(sectionStatus).filter(Boolean).length,
    [sectionStatus],
  );

  // Load existing CV data (từ server) — ưu tiên draft nếu có
  useEffect(() => {
    if (existingCv) {
      setSavedId(existingCv.id);

      try {
        const draft = localStorage.getItem(STORAGE_KEY);
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed.templateId === templateId && parsed.savedId === existingCv.id) {
            return;
          }
        }
      } catch { /* ignore */ }

      try {
        const parsed = typeof existingCv.cvData === 'string'
          ? JSON.parse(existingCv.cvData)
          : existingCv.cvData;
        setCvData(safeMergeCvData(parsed as Partial<CvFormData>));
      } catch (err) {
        console.error('Parse CV data error', err);
      }
    }
  }, [existingCv]);

  // Autosave draft
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ templateId, savedId: savedId || null, cvData }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [cvData, templateId, savedId, isDirty]);

  // Restore draft
  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.templateId === templateId && parsed.savedId === (editId || null)) {
          setCvData(safeMergeCvData(parsed.cvData || {}));
        }
      }
    } catch { /* ignore */ }
  }, [templateId, editId]);

  // ===== FIELD UPDATERS =====
  const markDirty = () => setIsDirty(true);

  const updateField = useCallback(<K extends keyof CvFormData>(key: K, value: CvFormData[K]) => {
    setCvData((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }, []);

  const updateNested = useCallback(<K extends keyof CvFormData>(parent: K, field: string, value: any) => {
    setCvData((prev) => {
      const obj = { ...(prev[parent] as any) };
      obj[field] = value;
      return { ...prev, [parent]: obj };
    });
    markDirty();
  }, []);

  const updateArrayItem = useCallback((key: keyof CvFormData, index: number, field: string, value: any) => {
    setCvData((prev) => {
      const arr = [...(prev[key] as any[])];
      if (!arr[index]) arr[index] = {};
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
    markDirty();
  }, []);

  const updateStringItem = useCallback((key: keyof CvFormData, index: number, value: string) => {
    setCvData((prev) => {
      const arr = [...(prev[key] as string[])];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
    markDirty();
  }, []);

  const addArrayItem = useCallback((key: keyof CvFormData, emptyItem: any) => {
    setCvData((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), emptyItem] }));
    markDirty();
  }, []);

  const removeArrayItem = useCallback((key: keyof CvFormData, index: number) => {
    setCvData((prev) => {
      const arr = [...(prev[key] as any[])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr.length ? arr : [getEmptyItem(key)] };
    });
    markDirty();
  }, []);

  // ===== RENDERED HTML =====
  const renderedHtml = useMemo(() => {
    if (!template) return '';
    try {
      const compiled = Handlebars.compile(template.htmlStructure);
      const data = {
        fullName: deferredCvData.fullName || 'Họ và tên',
        jobTitle: deferredCvData.jobTitle || 'Vị trí ứng tuyển',
        objective: deferredCvData.objective || '',
        cssStyles: '',
        contact: {
          address: deferredCvData.contact?.address || '',
          phone: deferredCvData.contact?.phone || '',
          email: deferredCvData.contact?.email || '',
          birthday: deferredCvData.contact?.birthday || '',
        },
        experiences: deferredCvData.experiences.filter((e) => e.company || e.role),
        education: deferredCvData.education.filter((e) => e.school),
        projects: deferredCvData.projects.filter((p) => p.name),
        hardSkills: deferredCvData.hardSkills.filter((s) => s.trim()),
        computerSkills: deferredCvData.computerSkills.filter((c) => c.name),
        languages: deferredCvData.languages.filter((l) => l.name),
        certifications: deferredCvData.certifications.filter((c) => c.name),
        activities: deferredCvData.activities.filter((a) => a.name),
        references: deferredCvData.references.filter((r) => r.name),
      };
      const rawHtml = compiled(data);
      return DOMPurify.sanitize(rawHtml, {
        WHOLE_DOCUMENT: true,
        ADD_TAGS: ['style', 'link', 'meta', 'script'],
        ADD_ATTR: ['target', 'rel', 'href', 'src', 'charset'],
      });
    } catch (err) {
      console.error('Render template error:', err);
      return '';
    }
  }, [template, deferredCvData]);

  // ===== SAVE =====
  const handleSave = useCallback(() => {
    if (!templateId || !renderedHtml) return;
    saveMutation.mutate(
      {
        id: savedId || undefined,
        templateId,
        title: `CV - ${cvData.fullName || 'Chưa đặt tên'}`,
        cvData: JSON.stringify(cvData),
        renderedHtml,
      },
      {
        onSuccess: (result) => {
          setSavedId(result.id);
          setIsDirty(false);
          localStorage.removeItem(STORAGE_KEY);
        },
      },
    );
  }, [templateId, renderedHtml, savedId, cvData, saveMutation]);

  // ===== EXPORT PDF =====
  const doExportPdf = useCallback(
    async (id: string) => {
      exportPdfMutation.mutate(
        { id, html: renderedHtml },
        {
          onSuccess: (blob: any) => {
            const url = URL.createObjectURL(blob as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CV-${cvData.fullName || 'builder'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Xuất PDF thành công!');
          },
        },
      );
    },
    [renderedHtml, cvData.fullName, exportPdfMutation],
  );

  const handleExportPdf = useCallback(() => {
    const id = savedId;
    if (id) {
      doExportPdf(id);
      return;
    }
    if (!templateId || !renderedHtml) return;
    saveMutation.mutate(
      {
        templateId,
        title: `CV - ${cvData.fullName || 'Chưa đặt tên'}`,
        cvData: JSON.stringify(cvData),
        renderedHtml,
      },
      {
        onSuccess: async (result) => {
          setSavedId(result.id);
          await doExportPdf(result.id);
        },
      },
    );
  }, [savedId, templateId, renderedHtml, cvData, saveMutation, doExportPdf]);

  // ===== LOADING & ERROR STATES =====
  if (templateLoading || existingLoading) {
    return (
      <LoadingIndicator
        type="ai"
        title="Đang tải CV Builder..."
        subtitle="Chuẩn bị mẫu template và trình soạn thảo"
        fullScreen
        aiSteps={['Tải template CV...', 'Khởi tạo trình soạn thảo...', 'Sẵn sàng chỉnh sửa']}
      />
    );
  }

  if (!template) {
    return (
      <MainLayout hideSearch>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-2">
            <AlertCircle className="size-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Không tìm thấy template</h2>
          <p className="text-text-secondary text-sm">Template này có thể đã bị xóa hoặc không tồn tại.</p>
          <button
            onClick={() => router.push('/cv-builder/templates')}
            className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-pressed transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            ← Quay lại chọn mẫu
          </button>
        </div>
      </MainLayout>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <MainLayout hideSearch maxWidth="full" className="px-6 lg:px-10 pt-3 pb-12 bg-[#f4f5f7] flex h-[calc(100vh-64px)] overflow-hidden gap-6">
 
      {showTemplates ? (
        <TemplatePanel onClose={() => setShowTemplates(false)} />
      ) : (
        <FormPanel
          cvData={cvData}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sectionStatus={sectionStatus}
          completedCount={completedCount}
          onUpdateField={updateField}
          onUpdateNested={updateNested}
          onUpdateArrayItem={updateArrayItem}
          onUpdateStringItem={updateStringItem}
          onAddArrayItem={addArrayItem}
          onRemoveArrayItem={removeArrayItem}
        />
      )}

      <PreviewPanel
        renderedHtml={renderedHtml}
        isDirty={isDirty}
        showAiMods={showAiMods}
        onShowAiMods={setShowAiMods}
        aiModifications={aiModifications}
        onSave={handleSave}
        onExportPdf={handleExportPdf}
        isSaving={saveMutation.isPending}
        isExporting={exportPdfMutation.isPending}
        showTemplates={showTemplates}
        onShowTemplates={setShowTemplates}
      />
    </MainLayout>
  );
};

export default CvBuilderPage;
