import axios, { AxiosInstance } from 'axios';
import {
  Application,
  Stage,
  PaginatedResponse,
  ApiResponse,
  CreateApplicationData,
  CreateStageData,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const applicationApi = {
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    company?: string;
    role?: string;
    workType?: string;
  }): Promise<PaginatedResponse<Application>> => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  createApplication: async (data: CreateApplicationData): Promise<ApiResponse<Application>> => {
    const formData = new FormData();
    formData.append('company', data.company);
    formData.append('role', data.role);
    if (data.userComments) formData.append('userComments', data.userComments);
    if (data.vacancyText) formData.append('vacancyText', data.vacancyText);
    if (data.city) formData.append('city', data.city);
    formData.append('workType', data.workType);
    if (data.resumeFile) formData.append('resumeFile', data.resumeFile);

    const response = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateApplication: async (
    id: string,
    data: Partial<CreateApplicationData>
  ): Promise<ApiResponse<Application>> => {
    const formData = new FormData();
    if (data.company) formData.append('company', data.company);
    if (data.role) formData.append('role', data.role);
    if (data.userComments !== undefined) formData.append('userComments', data.userComments || '');
    if (data.vacancyText !== undefined) formData.append('vacancyText', data.vacancyText || '');
    if (data.city !== undefined) formData.append('city', data.city || '');
    if (data.workType) formData.append('workType', data.workType);
    if (data.resumeFile) formData.append('resumeFile', data.resumeFile);

    const response = await api.put(`/applications/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteApplication: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },

  searchApplications: async (query: string): Promise<ApiResponse<Application[]>> => {
    const response = await api.get('/applications/search', { params: { q: query } });
    return response.data;
  },
};

export const stageApi = {
  createStage: async (
    applicationId: string,
    data: CreateStageData
  ): Promise<ApiResponse<Stage>> => {
    const response = await api.post(`/applications/${applicationId}/stages`, data);
    return response.data;
  },

  updateStage: async (id: string, data: Partial<CreateStageData>): Promise<ApiResponse<Stage>> => {
    const response = await api.put(`/stages/${id}`, data);
    return response.data;
  },

  deleteStage: async (id: string): Promise<void> => {
    await api.delete(`/stages/${id}`);
  },
};

export const cvEnhanceApi = {
  evaluate: async (
    experience: string,
    jobDescription: string
  ): Promise<ApiResponse<{ score: string; analysis: string }>> => {
    const response = await api.post('/cv-enhance/evaluate', { experience, jobDescription });
    return response.data;
  },

  enhance: async (
    experience: string,
    jobDescription: string
  ): Promise<ApiResponse<{ enhancedText: string }>> => {
    const response = await api.post('/cv-enhance/enhance', { experience, jobDescription });
    return response.data;
  },
};

export default api;
