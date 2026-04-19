import React, { useState } from 'react';

import { Application } from '../types';
import { applicationApi } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

import ApplicationListItem from '../components/ApplicationListItem';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await applicationApi.searchApplications(query);
      setResults(response.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Search Applications</h1>
        <p className="mt-2 text-sm text-gray-600">
          Search across companies, roles, comments, and vacancy descriptions.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <div className="flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms (company, role, keywords...)"
              className="block w-full px-4 py-3 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Tip: Search for specific terms like "Google", "frontend", "remote", or keywords from job
          descriptions.
        </p>
      </form>

      {error && <ErrorAlert error={error} />}

      {searched && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </h2>

          {results.length === 0 ? (
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try different search terms or check your spelling.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {results.map((application) => (
                  <ApplicationListItem
                    key={application._id}
                    application={application}
                    showComments={true}
                    showVacancyText={true}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
