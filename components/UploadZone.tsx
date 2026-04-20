'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CloudUpload, FileText, X, CheckCircle } from 'lucide-react';

export default function UploadZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [deckTitle, setDeckTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setError('');
      if (!deckTitle) setDeckTitle(dropped.name.replace('.pdf', ''));
    } else {
      setError('Please drop a PDF file.');
    }
  }, [deckTitle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
      setError('');
      if (!deckTitle) setDeckTitle(selected.name.replace('.pdf', ''));
    } else if (selected) {
      setError('Please select a PDF file.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress('Extracting text from PDF...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('deckTitle', deckTitle || file.name.replace('.pdf', ''));

      setProgress('Generating flashcards with AI... (this may take 30-60 seconds)');

      const res = await fetch('/api/generate-cards', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(`✓ Generated ${data.cardCount} flashcards!`);
      setTimeout(() => {
        router.push(`/deck/${data.deck.id}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setUploading(false);
      setProgress('');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="upload-container">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} ${file ? 'drop-zone-filled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {!file ? (
          <div className="drop-zone-content">
            <div className="upload-icon-wrap">
              <CloudUpload size={48} className="upload-icon" />
            </div>
            <p className="drop-title">Drop your PDF here</p>
            <p className="drop-subtitle">or click to browse files</p>
            <p className="drop-hint">Supports PDFs up to 20MB</p>
          </div>
        ) : (
          <div className="file-preview">
            <FileText size={36} className="file-icon" />
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatSize(file.size)}</p>
            </div>
            <button
              className="remove-file-btn"
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Deck Title Input */}
      {file && (
        <div className="title-input-wrap">
          <label className="input-label" htmlFor="deck-title">Deck Name</label>
          <input
            id="deck-title"
            type="text"
            className="text-input"
            placeholder="e.g. Biology Chapter 3"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-banner">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Progress */}
      {uploading && progress && (
        <div className="progress-banner">
          <div className="progress-spinner" />
          <span>{progress}</span>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && (
        <button
          id="upload-btn"
          className="btn-primary upload-btn"
          onClick={handleUpload}
        >
          <CheckCircle size={20} />
          Generate Flashcards
        </button>
      )}
    </div>
  );
}
