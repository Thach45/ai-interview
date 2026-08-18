import { BriefcaseBusiness, Code2, FileSearch, GraduationCap } from 'lucide-react';

const USE_CASES = [
  {
    title: 'Sinh viên và Fresher',
    description: 'Luyện cách giới thiệu bản thân, trình bày đồ án và trả lời các câu hỏi phỏng vấn đầu tiên.',
    icon: GraduationCap,
  },
  {
    title: 'Developer và kỹ sư',
    description: 'Chuẩn bị phần kỹ thuật, system design và cách kể về dự án theo đúng vị trí đang ứng tuyển.',
    icon: Code2,
  },
  {
    title: 'Product, Business và vận hành',
    description: 'Diễn giải tư duy giải quyết vấn đề, kinh nghiệm phối hợp và tác động của công việc rõ ràng hơn.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Ứng tuyển theo một JD cụ thể',
    description: 'Đối chiếu CV với yêu cầu công việc để biết nội dung nào cần ưu tiên trước khi gửi hồ sơ.',
    icon: FileSearch,
  },
] as const;

export function UseCasesSection() {
  return (
    <section id="use-cases" aria-labelledby="use-cases-heading" className="border-b border-gray-200 bg-gray-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Chuẩn bị theo cách của bạn</p>
            <h2 id="use-cases-heading" className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Một không gian luyện tập cho từng chặng đường ứng tuyển.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-gray-600">Dùng Arion để chuẩn bị cho vòng phỏng vấn đầu tiên, một cơ hội chuyển việc hoặc vị trí bạn đang thực sự muốn chinh phục.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <article key={useCase.title} className="rounded-xl border border-gray-200 bg-white p-6 sm:p-7">
                <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-900"><Icon size={19} aria-hidden="true" /></span>
                <h3 className="mt-8 text-lg font-semibold tracking-tight">{useCase.title}</h3>
                <p className="mt-3 max-w-[44ch] text-sm leading-6 text-gray-600">{useCase.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
