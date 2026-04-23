import express from 'express';
import { evaluateExperience, enhanceExperience } from '../controllers/cvEnhanceController';
import { validate } from '../middleware/validate';
import Joi from 'joi';

const router = express.Router();

const cvEnhanceSchema = Joi.object({
  experience: Joi.string().required().min(10).max(5000).messages({
    'string.empty': 'Work experience is required',
    'string.min': 'Work experience must be at least 10 characters',
    'string.max': 'Work experience must not exceed 5000 characters',
  }),
  jobDescription: Joi.string().required().min(10).max(5000).messages({
    'string.empty': 'Job description is required',
    'string.min': 'Job description must be at least 10 characters',
    'string.max': 'Job description must not exceed 5000 characters',
  }),
});

router.post('/evaluate', validate(cvEnhanceSchema), evaluateExperience);
router.post('/enhance', validate(cvEnhanceSchema), enhanceExperience);

export default router;
