import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  inline?: boolean;
  className?: string;
  spinnerClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  inline = false,
  className = '',
  spinnerClassName = 'text-gray-500',
}) => {
  const spinner = (
    <svg
      className={`animate-spin h-5 w-5 ${spinnerClassName}`}
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
  );

  if (inline) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {spinner}
        {text && <span className="ml-2">{text}</span>}
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center h-64 ${className}`}>
      <div className="text-center">
        <div className="inline-block">{spinner}</div>
        {text && <div className="mt-2 text-gray-500">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
