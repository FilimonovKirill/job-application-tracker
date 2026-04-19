import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  currentFileUrl?: string | null;
  onRemove?: () => void;
  error?: string | null;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // bytes
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  currentFileUrl,
  onRemove,
  error,
  disabled = false,
  accept = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  maxSize = 3 * 1024 * 1024,
  label = 'Resume (PDF or DOCX, max 3MB)',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size must be less than ${maxSize / 1024 / 1024}MB`;
      }
      if (
        ![
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        return 'Only PDF and DOCX files are allowed';
      }
      return null;
    },
    [maxSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setInternalError(validationError);
        onChange(null);
      } else {
        setInternalError(null);
        onChange(file);
      }
    },
    [validateFile, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setInternalError(null);
    if (onRemove) onRemove();
  };

  const displayError = error || internalError;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {currentFileUrl && !value && (
        <div className="mt-2 mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-700">Current resume attached</span>
            </div>
            <div className="flex space-x-2">
              <a
                href={currentFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View
              </a>
              <button
                type="button"
                onClick={handleRemove}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                disabled ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept={accept}
                disabled={disabled}
              />
            </label>
            <p className="pl-1">or drag and drop here</p>
          </div>
          <p className="text-xs text-gray-500">PDF or DOCX up to {maxSize / 1024 / 1024}MB</p>
          {value && (
            <p className="text-sm text-green-600">
              Selected: {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {isDragOver && <p className="text-sm text-blue-600">Drop file to upload</p>}
        </div>
      </div>
      {displayError && <p className="mt-1 text-sm text-red-600">{displayError}</p>}
      <p className="mt-1 text-sm text-gray-500">
        {currentFileUrl && !value
          ? 'Upload a new file to replace the current resume.'
          : 'Leave empty to keep current resume.'}
      </p>
    </div>
  );
};

export default FileUpload;
