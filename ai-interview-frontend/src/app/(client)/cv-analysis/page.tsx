'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AnalyzeExternalCvPage = dynamic(
  () => import('@/views/client/AnalyzeExternalCvPage'),
  { ssr: false }
);

export default function Page() { return <Suspense><AnalyzeExternalCvPage /></Suspense>; }
