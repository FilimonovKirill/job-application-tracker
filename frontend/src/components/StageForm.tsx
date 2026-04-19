import React from 'react';
import { CreateStageData } from '../types';

interface StageFormProps {
  value: CreateStageData;
  onChange: (data: CreateStageData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading?: boolean;
  onCancel: () => void;
}

const StageForm: React.FC<StageFormProps> = ({
  value,
  onChange,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: newValue } = e.target;
    onChange({
      ...value,
      [name]: newValue,
    });
  };

  return (
    <form onSubmit={onSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="stageType" className="block text-sm font-medium text-gray-700">
            Stage Type
          </label>
          <select
            id="stageType"
            name="type"
            value={value.type}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={loading}
          >
            <option value="hr_screening">HR Screening</option>
            <option value="technical_interview">Technical Interview</option>
            <option value="fit_interview">Fit Interview</option>
            <option value="final_interview">Final Interview</option>
          </select>
        </div>

        <div>
          <label htmlFor="stageDate" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="stageDate"
            name="date"
            value={value.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="stageComments" className="block text-sm font-medium text-gray-700">
            Comments
          </label>
          <textarea
            id="stageComments"
            name="comments"
            value={value.comments || ''}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Any notes about this stage..."
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Stage'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StageForm;
