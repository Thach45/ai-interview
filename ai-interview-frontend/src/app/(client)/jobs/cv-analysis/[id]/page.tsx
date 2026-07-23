'use client';
import dynamic from 'next/dynamic';

const CVAnalysisResultPage = dynamic(
  () => import('@/views/client/CVAnalysisResult'),
  { ssr: false }
);

export default function Page() { return <CVAnalysisResultPage />; }
