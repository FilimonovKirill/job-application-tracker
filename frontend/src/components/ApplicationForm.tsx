import React, { useState } from 'react';
import { CreateApplicationData } from '../types';
import ErrorAlert from './ErrorAlert';
import FileUpload from './FileUpload';

interface ApplicationFormProps {
  initialData: CreateApplicationData;
  onSubmit: (data: CreateApplicationData & { resumeFile?: File }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  currentResumeUrl?: string | null;
  onRemoveResume?: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  error,
  submitButtonText = 'Create Application',
  cancelButtonText = 'Cancel',
  onCancel,
  currentResumeUrl,
  onRemoveResume,
}) => {
  const [formData, setFormData] = useState<CreateApplicationData>(initialData);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleRemove = () => {
    setResumeFile(null);
    onRemoveResume?.();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError(null);
    try {
      await onSubmit({
        ...formData,
        resumeFile: resumeFile || undefined,
      });
    } catch (err) {
      setInternalError('Failed to submit application. Please try again.');
    }
  };

  const displayError = error || internalError;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <ErrorAlert error={displayError} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Google, Microsoft, etc."
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role / Position *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Senior Frontend Developer"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., San Francisco, Remote"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="workType" className="block text-sm font-medium text-gray-700">
            Work Type
          </label>
          <select
            id="workType"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={loading}
          >
            <option value="on-site">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label htmlFor="userComments" className="block text-sm font-medium text-gray-700">
            Your Comments
          </label>
          <textarea
            id="userComments"
            name="userComments"
            value={formData.userComments || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Any notes about the application process..."
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="vacancyText" className="block text-sm font-medium text-gray-700">
            Vacancy Description
          </label>
          <textarea
            id="vacancyText"
            name="vacancyText"
            value={formData.vacancyText || ''}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Paste the job description here..."
            disabled={loading}
          />
        </div>

        <FileUpload
          value={resumeFile}
          onChange={setResumeFile}
          currentFileUrl={currentResumeUrl}
          onRemove={handleRemove}
          error={null}
          disabled={loading}
        />
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelButtonText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
