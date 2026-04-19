import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../types';
import { applicationApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ApplicationListItem from '../components/ApplicationListItem';
import Pagination from '../components/Pagination';

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadApplications = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationApi.getApplications({ page: pageNum, limit: 10 });
      setApplications(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(page);
  }, [page]);

  if (loading && applications.length === 0) {
    return <LoadingSpinner text="Loading applications..." />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <Link
          to="/applications/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new job application.
          </p>
          <div className="mt-6">
            <Link
              to="/applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Application
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <ApplicationListItem key={application._id} application={application} />
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsList;
