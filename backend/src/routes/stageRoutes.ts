import express from 'express';
import { updateStage, deleteStage } from '../controllers/stageController';
import { validate } from '../middleware/validate';
import { updateStageSchema } from '../validators/applicationValidator';

const router = express.Router();

router.route('/:id').put(validate(updateStageSchema), updateStage).delete(deleteStage);

export default router;
