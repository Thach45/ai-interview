import Link from 'next/link';
import { ArrowRight, FileText, MessageSquareText, Sparkles } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Thêm CV và vị trí mục tiêu',
    description: 'Tải CV hoặc dán mô tả công việc để Arion hiểu ngữ cảnh bạn đang chuẩn bị.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Luyện phỏng vấn với AI',
    description: 'Thực hành theo vai trò mong muốn, trả lời câu hỏi và theo dõi mạch trao đổi như một buổi phỏng vấn.',
    icon: MessageSquareText,
  },
  {
    number: '03',
    title: 'Cải thiện từ phản hồi cụ thể',
    description: 'Xem điểm mạnh, điểm cần làm rõ và gợi ý để chỉnh CV hoặc câu trả lời cho lần ứng tuyển tiếp theo.',
    icon: Sparkles,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="border-b border-gray-200 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex max-w-2xl flex-col gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Cách Arion hỗ trợ bạn</p>
          <h2 id="how-it-works-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Từ CV đến buổi phỏng vấn, mọi bước đều có định hướng rõ ràng.</h2>
          <p className="text-base leading-7 text-gray-600 sm:text-lg">Chuẩn bị cho một vị trí cụ thể thay vì luyện tập chung chung. Arion kết nối CV, JD và phần luyện phỏng vấn trong một quy trình liền mạch.</p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">{step.number}</span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"><Icon size={18} aria-hidden="true" /></span>
                </div>
                <h3 className="mt-12 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{step.description}</p>
              </li>
            );
          })}
        </ol>

        <Link href="/register" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          Bắt đầu chuẩn bị <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
