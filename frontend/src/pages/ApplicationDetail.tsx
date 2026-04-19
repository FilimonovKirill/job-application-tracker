import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Application, CreateStageData } from '../types';
import { applicationApi, stageApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import WorkTypeBadge from '../components/WorkTypeBadge';
import StageForm from '../components/StageForm';
import StageList from '../components/StageList';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddStage, setShowAddStage] = useState(false);
  const [stageForm, setStageForm] = useState<CreateStageData>({
    type: 'hr_screening',
    comments: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [addingStage, setAddingStage] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationApi.getApplication(id!);
      setApplication(response.data);
    } catch (err) {
      setError('Failed to load application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationApi.deleteApplication(id!);
        navigate('/');
      } catch (err) {
        setError('Failed to delete application');
        console.error(err);
      }
    }
  };

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setAddingStage(true);
      await stageApi.createStage(id, stageForm);
      await loadApplication();
      setShowAddStage(false);
      setStageForm({
        type: 'hr_screening',
        comments: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError('Failed to add stage');
      console.error(err);
    } finally {
      setAddingStage(false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      try {
        await stageApi.deleteStage(stageId);
        await loadApplication();
      } catch (err) {
        setError('Failed to delete stage');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading application details..." />;
  }

  if (error || !application) {
    return <ErrorAlert error={error || 'Application not found'} />;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.company}</h1>
            <p className="text-lg text-gray-600">{application.role}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <WorkTypeBadge workType={application.workType} />
              {application.city && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {application.city}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Applied {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/applications/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {application.userComments && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Comments</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{application.userComments}</p>
            </div>
          )}

          {application.vacancyText && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vacancy Description</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {application.vacancyText}
                </pre>
              </div>
            </div>
          )}

          {application.resumeFile && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resume</h2>
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-gray-400"
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
                <div className="ml-3">
                  <a
                    href={`http://localhost:3001${application.resumeFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Interview Stages</h2>
              <button
                onClick={() => setShowAddStage(!showAddStage)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Stage
              </button>
            </div>

            {showAddStage && (
              <StageForm
                value={stageForm}
                onChange={setStageForm}
                onSubmit={handleAddStage}
                loading={addingStage}
                onCancel={() => setShowAddStage(false)}
              />
            )}

            <StageList stages={application.stages} onDelete={handleDeleteStage} />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(application.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(application.updatedAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Stages</dt>
                <dd className="text-sm text-gray-900">{application.stages?.length || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
