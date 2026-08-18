import { FAQ_ITEMS } from '../content/seoContent';

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-gray-200 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Câu hỏi thường gặp</p>
          <h2 id="faq-heading" className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Hiểu rõ Arion trước khi bắt đầu.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-gray-600">Nếu bạn đang chuẩn bị cho một vị trí mới, đây là những điều cần biết về cách Arion hỗ trợ quá trình đó.</p>
        </div>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-gray-950 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4">
                {item.question}
                <span aria-hidden="true" className="relative size-5 shrink-0 text-gray-500 before:absolute before:left-0 before:top-1/2 before:h-px before:w-5 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-5 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:rotate-90" />
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-6 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
