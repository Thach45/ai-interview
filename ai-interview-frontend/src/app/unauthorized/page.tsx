'use client';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">403 - Không có quyền truy cập</h1>
      <p className="text-gray-500">Bạn không có quyền truy cập trang này.</p>
      <Link href="/dashboard" className="text-primary hover:underline">Quay về Dashboard</Link>
    </div>
  );
}
