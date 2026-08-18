import { Check, FileText, MessageSquareText, Sparkles, Target } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Thêm CV và vị trí mục tiêu',
    description: 'Arion dùng CV và JD để hiểu đúng ngữ cảnh bạn đang chuẩn bị.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Luyện phỏng vấn với AI',
    description: 'Thực hành câu hỏi và follow-up bám theo kinh nghiệm của bạn.',
    icon: MessageSquareText,
  },
  {
    number: '03',
    title: 'Cải thiện từ phản hồi',
    description: 'Xem rõ điều cần làm trước lần ứng tuyển tiếp theo.',
    icon: Sparkles,
  },
] as const;

function StepPreview({ index }: { index: number }) {
  if (index === 0) {
    return <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 p-3 text-xs"><span className="inline-flex items-center gap-2 rounded bg-white px-2.5 py-2 font-medium text-gray-950"><FileText size={14} aria-hidden="true" />CV_MinhTran.pdf</span><span className="text-gray-400">+</span><span className="inline-flex items-center gap-2 rounded bg-white px-2.5 py-2 font-medium text-gray-950"><Target size={14} aria-hidden="true" />Frontend Engineer</span><span className="ml-auto inline-flex items-center gap-1 text-emerald-700"><Check size={13} strokeWidth={3} aria-hidden="true" />Sẵn sàng</span></div>;
  }

  if (index === 1) {
    return <div className="rounded-md bg-gray-50 p-3"><div className="flex items-center justify-between text-[11px]"><span className="font-medium text-gray-950">Arion Interview</span><span className="text-emerald-700">● Đang luyện tập</span></div><p className="mt-3 text-xs leading-5 text-gray-700">Hãy kể về một lần bạn phải cân bằng deadline và chất lượng kỹ thuật.</p><div className="mt-3 flex items-center gap-1" aria-hidden="true">{[9, 14, 21, 12, 25, 17, 10, 20, 13, 8, 17, 11, 23, 13, 8].map((height, itemIndex) => <span key={itemIndex} className="w-0.5 rounded-full bg-gray-400" style={{ height }} />)}</div></div>;
  }

  return <div className="flex flex-wrap items-center gap-4 rounded-md bg-gray-50 p-3"><div><p className="text-[11px] text-gray-500">Mức độ sẵn sàng</p><p className="mt-1 text-xl font-semibold tracking-tight text-gray-950">85<span className="text-xs text-gray-400">/100</span></p></div><div className="h-9 w-px bg-gray-200" /><p className="max-w-[38ch] text-xs leading-5 text-gray-600">Lượng hóa kết quả dự án trước khi mô tả cách triển khai.</p></div>;
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-24 border-b border-gray-200 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex max-w-2xl flex-col gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Cách Arion hỗ trợ bạn</p>
          <h2 id="how-it-works-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Một lộ trình rõ ràng cho mỗi cơ hội ứng tuyển.</h2>
          <p className="text-base leading-7 text-gray-600 sm:text-lg">Từ CV đến buổi phỏng vấn, mọi thứ kết nối với nhau để bạn biết chính xác mình cần chuẩn bị gì.</p>
        </div>

        <ol className="mt-12 border-y border-gray-200">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="grid gap-4 border-b border-gray-200 py-6 last:border-b-0 sm:grid-cols-[48px_minmax(0,0.82fr)_minmax(0,1.18fr)] sm:items-center sm:gap-6 sm:py-7">
                <div className="flex items-center gap-3 sm:block"><span className="flex size-10 items-center justify-center rounded-full bg-black text-white sm:size-12"><Icon size={18} aria-hidden="true" /></span><span className="text-xs font-medium text-gray-500 sm:mt-3 sm:block">{step.number}</span></div>
                <div><h3 className="text-base font-semibold tracking-tight text-gray-950">{step.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">{step.description}</p></div>
                <StepPreview index={index} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
