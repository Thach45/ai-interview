"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Đã xảy ra sự cố
          </p>
          <h1 className="mt-3 text-2xl font-semibold">
            Không thể tải trang này
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Hệ thống vừa gặp lỗi ngoài dự kiến. Vui lòng thử lại.
          </p>

          <button
            type="button"
            onClick={unstable_retry}
            className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Thử lại
          </button>
        </main>
      </body>
    </html>
  );
}