'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CloudUpload, FileText, X, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

      // Simulate a small delay for progress UI to show on fast networks
      setTimeout(() => setProgress('Generating flashcards with AI... (this may take 30-60 seconds)'), 1500);

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
    <div className="upload-container relative">
      {/* Drop Zone */}
      <motion.div
        className={`drop-zone glass relative overflow-hidden transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'border-white/20 bg-white/5'} ${file ? 'border-emerald-400 bg-emerald-500/5 cursor-default' : 'cursor-pointer border-dashed border-2'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && document.getElementById('file-input')?.click()}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Animated Dashed Border (visible when empty) */}
        {!file && (
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden" style={{ padding: '2px' }}>
            <div className="absolute inset-0 bg-[length:200%_100%] animate-[iridescentBg_3s_linear_infinite] opacity-50" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.8) 50%, transparent 100%)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 2px, 2px 2px, 2px calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 2px, 0 2px)' }}></div>
          </div>
        )}

        {/* Floating background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(108,99,255,0.15),_transparent_60%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              className="drop-zone-content relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="upload-icon-wrap glass bg-gradient-to-br from-purple-500/20 to-cyan-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 float-animation shadow-[0_0_20px_rgba(108,99,255,0.3)]">
                <CloudUpload size={40} className="text-primary-light drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              </div>
              <p className="drop-title text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Drop your PDF here</p>
              <p className="drop-subtitle text-gray-400 mb-2">or click to browse files</p>
              <p className="drop-hint text-gray-500 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">Supports PDFs up to 20MB</p>

              {/* Particles on drag over */}
              {isDragging && (
                <Sparkles className="absolute -top-4 -right-4 text-primary-light animate-ping opacity-75" size={24} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              className="file-preview flex items-center gap-4 relative z-10 bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20 shadow-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex flex-shrink-0 items-center justify-center">
                <FileText size={24} className="text-emerald-400 drop-shadow-sm" />
              </div>
              <div className="file-info flex-1 text-left">
                <p className="file-name font-semibold text-white truncate max-w-[300px]">{file.name}</p>
                <p className="file-size text-gray-400 text-sm mt-1">{formatSize(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  className="remove-file-btn p-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                >
                  <X size={18} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Deck Title Input */}
      {file && (
        <motion.div
          className="title-input-wrap flex flex-col gap-2 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="input-label text-sm font-semibold text-gray-300" htmlFor="deck-title">Deck Name</label>
          <input
            id="deck-title"
            type="text"
            className="text-input w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_0_2px_rgba(0,212,255,0.2)] transition-all"
            placeholder="e.g. Biology Chapter 3"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            disabled={uploading}
          />
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-banner flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: [-5, 5, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <X size={16} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <AnimatePresence>
        {uploading && progress && (
          <motion.div
            className="progress-banner flex flex-col gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-3 text-purple-300 font-medium">
              {progress.includes('✓') ? (
                <CheckCircle size={18} className="text-emerald-400 shadow-emerald-400 drop-shadow-md" />
              ) : (
                <div className="progress-spinner w-4 h-4 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
              )}
              <span className="text-sm tracking-wide">{progress}</span>
            </div>
            {!progress.includes('✓') && (
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full animate-[iridescentBg_2s_linear_infinite] w-[150%]" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {file && !uploading && (
        <motion.button
          id="upload-btn"
          className="btn-primary upload-btn w-full flex items-center justify-center gap-2 p-4 text-base font-bold shadow-[0_4px_20px_rgba(108,99,255,0.4)] hover:shadow-[0_8px_30px_rgba(108,99,255,0.6)] border border-white/10"
          onClick={handleUpload}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ y: 2, scale: 0.99 }}
        >
          <CheckCircle size={20} />
          Generate Flashcards
        </motion.button>
      )}
    </div>
  );
}
