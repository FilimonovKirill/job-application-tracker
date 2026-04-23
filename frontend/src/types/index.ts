export interface Application {
  _id: string;
  company: string;
  role: string;
  userComments?: string;
  vacancyText?: string;
  city?: string;
  workType: 'remote' | 'on-site' | 'hybrid';
  resumeFile?: string;
  createdAt: string;
  updatedAt: string;
  stages: Stage[];
}

export interface Stage {
  _id: string;
  type: 'hr_screening' | 'technical_interview' | 'fit_interview' | 'final_interview';
  comments?: string;
  date: string;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface CreateApplicationData {
  company: string;
  role: string;
  userComments?: string;
  vacancyText?: string;
  city?: string;
  workType: 'remote' | 'on-site' | 'hybrid';
  resumeFile?: File;
}

export interface CreateStageData {
  type: 'hr_screening' | 'technical_interview' | 'fit_interview' | 'final_interview';
  comments?: string;
  date: string;
}

export interface CVEnhanceEvaluation {
  score: string;
  analysis: string;
}

export interface CVEnhanceEnhancement {
  enhancedText: string;
}
