import React from 'react';
import { Stage } from '../types';

interface StageListProps {
  stages: Stage[];
  onDelete: (stageId: string) => void;
}

const StageList: React.FC<StageListProps> = ({ stages, onDelete }) => {
  const getStageTypeLabel = (type: string) => {
    switch (type) {
      case 'hr_screening':
        return 'HR Screening';
      case 'technical_interview':
        return 'Technical Interview';
      case 'fit_interview':
        return 'Fit Interview';
      case 'final_interview':
        return 'Final Interview';
      default:
        return type;
    }
  };

  if (stages.length === 0) {
    return (
      <div className="text-center py-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No stages yet</h3>
        <p className="mt-1 text-sm text-gray-500">Add interview stages to track your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div key={stage._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{getStageTypeLabel(stage.type)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(stage.date).toLocaleDateString()}
                </span>
              </div>
              {stage.comments && <p className="mt-2 text-sm text-gray-600">{stage.comments}</p>}
            </div>
            <button
              onClick={() => onDelete(stage._id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete stage"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StageList;
