import React, { useState } from 'react';
import { cvEnhanceApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

interface EvaluationResult {
  score: string;
  analysis: string;
}

interface EnhanceResult {
  enhancedText: string;
}

const CVEnhancePage: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!experience.trim() || !jobDescription.trim()) {
      setError('Please provide both work experience and job description');
      return;
    }

    setIsEvaluating(true);
    setError(null);
    setEvaluationResult(null);

    try {
      const result = await cvEnhanceApi.evaluate(experience, jobDescription);
      setEvaluationResult(result.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to evaluate experience');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEnhance = async () => {
    if (!experience.trim() || !jobDescription.trim()) {
      setError('Please provide both work experience and job description');
      return;
    }

    setIsEnhancing(true);
    setError(null);
    setEnhanceResult(null);

    try {
      const result = await cvEnhanceApi.enhance(experience, jobDescription);
      setEnhanceResult(result.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enhance experience');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleClear = () => {
    setExperience('');
    setJobDescription('');
    setEvaluationResult(null);
    setEnhanceResult(null);
    setError(null);
  };

  const handleCopyEnhancedText = () => {
    if (enhanceResult?.enhancedText) {
      navigator.clipboard.writeText(enhanceResult.enhancedText);
      alert('Enhanced text copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CV Enhance</h1>
        <p className="text-gray-600 mb-6">
          Paste your work experience and target job description to get AI-powered evaluation and
          ATS-optimized enhancement.
        </p>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
              Work Experience (paste from LinkedIn)
            </label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Paste your work experience here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={10}
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum 10 characters, maximum 5000 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Target Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={10}
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum 10 characters, maximum 5000 characters
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || isEnhancing || !experience.trim() || !jobDescription.trim()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {isEvaluating ? <LoadingSpinner size="sm" /> : 'Evaluate Current Experience'}
          </button>

          <button
            onClick={handleEnhance}
            disabled={isEnhancing || isEvaluating || !experience.trim() || !jobDescription.trim()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            {isEnhancing ? <LoadingSpinner size="sm" /> : 'Enhance'}
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All
          </button>
        </div>
      </div>

      {evaluationResult && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluation Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Score</h3>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-700">{evaluationResult.score}</p>
                <p className="text-sm text-blue-600 mt-1">Relevance score out of 10</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Brief Analysis</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{evaluationResult.analysis}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {enhanceResult && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Enhanced Work Experience</h2>
            <button
              onClick={handleCopyEnhancedText}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="prose max-w-none">
              <pre className="text-gray-800 whitespace-pre-wrap font-sans">
                {enhanceResult.enhancedText}
              </pre>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700">
                <strong>Note:</strong> This enhanced text is ATS-optimized with keywords from the
                job description, strong action verbs, and measurable achievements where appropriate.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 mb-2">Evaluation</h4>
            <p className="text-sm text-gray-600">
              AI analyzes your work experience against the job description and provides a relevance
              score (1-10) with a brief analysis highlighting strengths and areas for improvement.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 mb-2">Enhancement</h4>
            <p className="text-sm text-gray-600">
              AI rewrites your experience using ATS best practices: keywords from the job
              description, strong action verbs, measurable achievements, and professional
              formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEnhancePage;
