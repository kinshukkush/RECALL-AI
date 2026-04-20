import type { Metadata } from 'next';
import { Upload } from 'lucide-react';
import UploadZone from '@/components/UploadZone';

export const metadata: Metadata = {
  title: 'Upload PDF — RecallAI',
  description: 'Upload a PDF to generate AI-powered flashcards instantly.',
};

export default function UploadPage() {
  return (
    <div className="page-content">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <Upload size={28} color="var(--primary-light)" />
          <h1 className="page-title" style={{ margin: 0 }}>Upload Your PDF</h1>
        </div>
        <p className="page-subtitle">
          Drop any PDF — textbook chapters, lecture notes, research papers. AI will generate
          tailored flashcards in seconds.
        </p>
      </div>
      <UploadZone />
    </div>
  );
}
