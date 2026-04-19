import express from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  searchApplications,
} from '../controllers/applicationController';
import { createStage } from '../controllers/stageController';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import {
  createApplicationSchema,
  updateApplicationSchema,
  createStageSchema,
} from '../validators/applicationValidator';

const router = express.Router();

router
  .route('/')
  .get(getApplications)
  .post(upload.single('resumeFile'), validate(createApplicationSchema), createApplication);

router.get('/search', searchApplications);

router
  .route('/:id')
  .get(getApplicationById)
  .put(upload.single('resumeFile'), validate(updateApplicationSchema), updateApplication)
  .delete(deleteApplication);

router.post('/:applicationId/stages', validate(createStageSchema), createStage);

export default router;
