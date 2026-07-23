'use client';
import dynamic from 'next/dynamic';

const MyCvsPage = dynamic(
  () => import('@/views/client/MyCvs'),
  { ssr: false }
);

export default function Page() { return <MyCvsPage />; }
