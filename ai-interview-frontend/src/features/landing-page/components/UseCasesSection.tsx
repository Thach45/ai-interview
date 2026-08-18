import Image from 'next/image';
import { BriefcaseBusiness, GraduationCap, UserRoundCheck, UsersRound } from 'lucide-react';

const CAREER_JOURNEYS = [
  {
    initials: 'SV',
    title: 'Bạn đang bắt đầu',
    description: 'Tập giới thiệu bản thân, trình bày đồ án hoặc kinh nghiệm đầu tiên một cách rõ ràng.',
    roles: ['Sinh viên', 'Fresher'],
    icon: GraduationCap,
  },
  {
    initials: 'CV',
    title: 'Bạn đang tìm một cơ hội mới',
    description: 'Làm rõ kinh nghiệm đã có, đối chiếu CV với vị trí mong muốn và luyện câu trả lời.',
    roles: ['Chuyển việc', 'Đổi ngành'],
    icon: BriefcaseBusiness,
  },
  {
    initials: 'UP',
    title: 'Bạn đang hướng tới bước tiến tiếp theo',
    description: 'Chuẩn bị cho vai trò nhiều trách nhiệm hơn hoặc một buổi phỏng vấn quan trọng.',
    roles: ['Thăng tiến', 'Ứng tuyển mới'],
    icon: UserRoundCheck,
  },
] as const;

export function UseCasesSection() {
  return (
    <section id="use-cases" aria-labelledby="use-cases-heading" className="scroll-mt-24 border-b border-gray-200 bg-gray-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Dành cho mọi hành trình nghề nghiệp</p>
          <h2 id="use-cases-heading" className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Không có một mẫu ứng viên duy nhất.</h2>
          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">Arion giúp bạn chuẩn bị cho cơ hội tiếp theo, dù bạn đang bắt đầu, đổi hướng hay muốn tiến xa hơn trong công việc.</p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-xl border border-gray-200 bg-white lg:grid-cols-[0.38fr_0.62fr]">
          <aside className="relative flex min-h-[420px] overflow-hidden border-b border-gray-200 bg-gray-950 p-7 text-white sm:p-9 lg:border-b-0 lg:border-r">
            <Image src="/landing-career-journeys.png" alt="Nhóm ứng viên đang cùng chuẩn bị cho cơ hội nghề nghiệp" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/5" />
            <div className="relative z-10 mt-auto"><span className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/20"><UsersRound size={18} aria-hidden="true" /></span><h3 className="mt-6 max-w-[13ch] text-2xl font-semibold tracking-tight">Bạn không cần thuộc một ngành cụ thể để chuẩn bị tốt hơn.</h3><p className="mt-4 max-w-sm text-sm leading-6 text-gray-200">Điều quan trọng là cơ hội bạn muốn theo đuổi — Arion sẽ giúp bạn biến sự chuẩn bị thành các bước rõ ràng.</p></div>
          </aside>

          <div className="divide-y divide-gray-200 px-6 sm:px-8">
            {CAREER_JOURNEYS.map((journey, index) => {
              const Icon = journey.icon;
              return (
                <article key={journey.title} className="flex gap-4 py-6 sm:gap-5 sm:py-7">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700"><Icon size={18} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h3 className="text-base font-semibold tracking-tight text-gray-950">{journey.title}</h3><p className="mt-2 max-w-[52ch] text-sm leading-6 text-gray-600">{journey.description}</p></div><span className="shrink-0 text-xs font-medium text-gray-500">0{index + 1}</span></div><ul className="mt-4 flex flex-wrap gap-2">{journey.roles.map((role) => <li key={role} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{role}</li>)}</ul></div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
