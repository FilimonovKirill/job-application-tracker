import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateApplicationData } from '../types';
import { applicationApi } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';

const CreateApplication: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateApplicationData & { resumeFile?: File }) => {
    setLoading(true);
    setError(null);

    try {
      await applicationApi.createApplication(data);
      navigate('/');
    } catch (err) {
      setError('Failed to create application. Please try again.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const initialData: CreateApplicationData = {
    company: '',
    role: '',
    userComments: '',
    vacancyText: '',
    city: '',
    workType: 'on-site',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Job Application</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track a new job application by filling out the form below.
        </p>
      </div>

      <ApplicationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitButtonText="Create Application"
        cancelButtonText="Cancel"
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateApplication;
