import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../types';
import WorkTypeBadge from './WorkTypeBadge';

interface ApplicationListItemProps {
  application: Application;
  linkTo?: string;
  showComments?: boolean;
  showVacancyText?: boolean;
}

const ApplicationListItem: React.FC<ApplicationListItemProps> = ({
  application,
  linkTo = `/applications/${application._id}`,
  showComments = false,
  showVacancyText = false,
}) => {
  const getStageCount = (app: Application) => app.stages?.length || 0;

  return (
    <li>
      <Link to={linkTo} className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-lg font-medium text-blue-600 truncate">
                  {application.company} - {application.role}
                </p>
                <div className="ml-2">
                  <WorkTypeBadge workType={application.workType} />
                </div>
              </div>
              {(showComments && application.userComments) ||
              (showVacancyText && application.vacancyText) ? (
                <div className="mt-2">
                  {showComments && application.userComments && (
                    <p className="text-sm text-gray-600 line-clamp-2">{application.userComments}</p>
                  )}
                  {showVacancyText && application.vacancyText && (
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {application.vacancyText}
                    </p>
                  )}
                </div>
              ) : null}
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                {application.city && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {application.city}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
                  {getStageCount(application)} stages
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ApplicationListItem;
