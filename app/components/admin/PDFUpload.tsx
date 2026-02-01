'use client';

import { useState } from 'react';

// Supported file types matching the server-side validation
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const SUPPORTED_EXTENSIONS = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx';

interface UploadResponse {
  success: boolean;
  data?: {
    key: string;
    name: string;
    size: number;
    url: string;
  };
  error?: string;
}

export default function PDFUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pages, setPages] = useState('');
  const [topics, setTopics] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!SUPPORTED_MIME_TYPES.includes(selectedFile.type)) {
        setMessage({ type: 'error', text: 'Please select a supported file (PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX)' });
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 50MB' });
        return;
      }
      setFile(selectedFile);
      setMessage(null);

      // Auto-fill title from filename if empty (remove extension)
      if (!title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }

      // Auto-detect page count for PDFs only
      if (selectedFile.type === 'application/pdf') {
        try {
          const { PDFDocument } = await import('pdf-lib');
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          setPages(pageCount.toString());
        } catch (error) {
          console.error('Error reading PDF:', error);
          setPages('');
        }
      } else {
        // For non-PDF files, clear the pages field (user can enter manually if needed)
        setPages('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('pages', pages);
      formData.append('topics', topics);

      const response = await fetch('/api/pdfs/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned an invalid response. Please check the server logs.');
      }

      const result: UploadResponse = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'File uploaded successfully!' });
        // Reset form
        setFile(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setPages('');
        setTopics('');
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        // Callback to refresh file list
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Upload Resource</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            File *
          </label>
          <input
            id="file-input"
            type="file"
            accept={SUPPORTED_EXTENSIONS}
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100
              dark:file:bg-orange-900/20 dark:file:text-orange-400
              dark:hover:file:bg-orange-900/30
              cursor-pointer"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Supported: PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX (max 50MB)
          </p>
          {file && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            maxLength={200}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-900 dark:text-white
              focus:ring-2 focus:ring-orange-500 focus:border-transparent
              placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {title.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Short Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a short description"
            maxLength={500}
            rows={3}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-900 dark:text-white
              focus:ring-2 focus:ring-orange-500 focus:border-transparent
              placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description.length}/500 characters
          </p>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Price (USD) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-900 dark:text-white
              focus:ring-2 focus:ring-orange-500 focus:border-transparent
              placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Pages/Slides */}
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Pages/Slides *
          </label>
          <input
            id="pages"
            type="number"
            min="1"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="Enter page/slide count"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-900 dark:text-white
              focus:ring-2 focus:ring-orange-500 focus:border-transparent
              placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Auto-detected for PDFs, enter manually for other file types
          </p>
        </div>

        {/* Topics */}
        <div>
          <label htmlFor="topics" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Topics (comma-separated) *
          </label>
          <input
            id="topics"
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g., Group Theory, Ring Theory, Field Extensions"
            maxLength={500}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-900 dark:text-white
              focus:ring-2 focus:ring-orange-500 focus:border-transparent
              placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {topics.length}/500 characters - Enter topics separated by commas
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full px-6 py-3 rounded-lg font-semibold text-white
            bg-linear-to-r from-orange-600 to-amber-600
            hover:from-orange-700 hover:to-amber-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {uploading ? 'Uploading...' : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
}
