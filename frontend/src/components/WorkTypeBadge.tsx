import React from 'react';

interface WorkTypeBadgeProps {
  workType: 'remote' | 'on-site' | 'hybrid' | string;
  className?: string;
}

const WorkTypeBadge: React.FC<WorkTypeBadgeProps> = ({ workType, className = '' }) => {
  const getColorClasses = (type: string) => {
    switch (type) {
      case 'remote':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-site':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses(
        workType
      )} ${className}`}
    >
      {workType}
    </span>
  );
};

export default WorkTypeBadge;
