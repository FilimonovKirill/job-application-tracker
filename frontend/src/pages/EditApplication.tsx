import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateApplicationData } from '../types';
import { applicationApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ApplicationForm from '../components/ApplicationForm';

const EditApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateApplicationData>({
    company: '',
    role: '',
    userComments: '',
    vacancyText: '',
    city: '',
    workType: 'on-site',
  });
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);

  const loadApplication = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingData(true);
      setError(null);
      const response = await applicationApi.getApplication(id);
      const app = response.data;
      setFormData({
        company: app.company || '',
        role: app.role || '',
        userComments: app.userComments || '',
        vacancyText: app.vacancyText || '',
        city: app.city || '',
        workType: app.workType || 'on-site',
      });
      if (app.resumeFile) {
        setCurrentResumeUrl(`http://localhost:3001${app.resumeFile}`);
      }
    } catch (err) {
      setError('Failed to load application');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  }, [id]);

  const handleRemoveResume = useCallback(() => {
    setCurrentResumeUrl(null);
  }, []);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  const handleSubmit = async (data: CreateApplicationData & { resumeFile?: File }) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      await applicationApi.updateApplication(id, data);
      navigate(`/applications/${id}`);
    } catch (err) {
      setError('Failed to update application. Please try again.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/applications/${id}`);
  };

  if (loadingData) {
    return <LoadingSpinner text="Loading application..." />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Job Application</h1>
        <p className="mt-2 text-sm text-gray-600">Update the job application details below.</p>
      </div>

      <ApplicationForm
        initialData={formData}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitButtonText="Update Application"
        cancelButtonText="Cancel"
        onCancel={handleCancel}
        currentResumeUrl={currentResumeUrl}
        onRemoveResume={handleRemoveResume}
      />
    </div>
  );
};

export default EditApplication;
