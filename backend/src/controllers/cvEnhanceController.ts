import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../middleware/errorHandler';
import { PROMPTS } from '../constants/prompts';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-reasoner';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature: number;
  max_tokens: number;
}

interface EvaluationResponse {
  score: string;
  analysis: string;
}

const parseEvaluationResponse = (text: string): EvaluationResponse => {
  const lines = text.split('\n');
  let score = '';
  let analysis = '';

  for (const line of lines) {
    if (line.startsWith('Score:')) {
      score = line.replace('Score:', '').trim();
    } else if (line.startsWith('Brief Analysis:')) {
      analysis = line.replace('Brief Analysis:', '').trim();
    } else if (analysis === '' && line.trim() !== '') {
      // Handle case where analysis might be on next line
      analysis = line.trim();
    }
  }

  return { score, analysis };
};

const callDeepSeekAPI = async (prompt: string): Promise<string> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new AppError('DeepSeek API key is not configured', 500);
  }

  const messages: DeepSeekMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const requestBody: DeepSeekRequest = {
    model: DEEPSEEK_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 2000,
  };

  try {
    const response = await axios.post(DEEPSEEK_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    return response.data.choices[0]?.message?.content?.trim() || '';
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      throw new AppError('Invalid DeepSeek API key', 401);
    } else if (error.response?.status === 429) {
      throw new AppError('Rate limit exceeded for DeepSeek API', 429);
    } else if (error.code === 'ECONNABORTED') {
      throw new AppError('DeepSeek API request timeout', 504);
    } else {
      throw new AppError('Failed to call DeepSeek API', 500);
    }
  }
};

export const evaluateExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { experience, jobDescription } = req.body;

    if (!experience || !jobDescription) {
      return next(new AppError('Experience and job description are required', 400));
    }

    const evaluationPrompt = PROMPTS.EVALUATION.replace('{experience}', experience).replace(
      '{jobDescription}',
      jobDescription
    );

    const aiResponse = await callDeepSeekAPI(evaluationPrompt);
    const { score, analysis } = parseEvaluationResponse(aiResponse);

    res.json({
      status: 'success',
      data: {
        score,
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const enhanceExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { experience, jobDescription } = req.body;

    if (!experience || !jobDescription) {
      return next(new AppError('Experience and job description are required', 400));
    }

    const enhancementPrompt = PROMPTS.ENHANCEMENT.replace('{experience}', experience).replace(
      '{jobDescription}',
      jobDescription
    );

    const enhancedText = await callDeepSeekAPI(enhancementPrompt);

    res.json({
      status: 'success',
      data: {
        enhancedText,
      },
    });
  } catch (error) {
    next(error);
  }
};
