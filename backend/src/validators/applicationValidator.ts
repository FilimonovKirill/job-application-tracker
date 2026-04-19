import Joi from 'joi';

export const createApplicationSchema = Joi.object({
  company: Joi.string().required().trim().max(200),
  role: Joi.string().required().trim().max(200),
  userComments: Joi.string().trim().allow('').optional(),
  vacancyText: Joi.string().trim().allow('').optional(),
  city: Joi.string().trim().max(100).optional(),
  workType: Joi.string().valid('remote', 'on-site', 'hybrid').default('on-site'),
  resumeFile: Joi.string().optional(),
});

export const updateApplicationSchema = Joi.object({
  company: Joi.string().trim().max(200).optional(),
  role: Joi.string().trim().max(200).optional(),
  userComments: Joi.string().trim().allow('').optional(),
  vacancyText: Joi.string().trim().allow('').optional(),
  city: Joi.string().trim().max(100).optional(),
  workType: Joi.string().valid('remote', 'on-site', 'hybrid').optional(),
  resumeFile: Joi.string().optional(),
});

export const createStageSchema = Joi.object({
  type: Joi.string()
    .valid('hr_screening', 'technical_interview', 'fit_interview', 'final_interview')
    .required(),
  comments: Joi.string().trim().allow('').optional(),
  date: Joi.date().required(),
});

export const updateStageSchema = Joi.object({
  type: Joi.string()
    .valid('hr_screening', 'technical_interview', 'fit_interview', 'final_interview')
    .optional(),
  comments: Joi.string().trim().allow('').optional(),
  date: Joi.date().optional(),
});
