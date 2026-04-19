import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Stage from '../models/Stage';
import Application from '../models/Application';
import { AppError } from '../middleware/errorHandler';

export const createStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId } = req.params;
    const stageData = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return next(new AppError('Invalid application ID', 400));
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    stageData.applicationId = applicationId;
    const stage = await Stage.create(stageData);

    await Application.findByIdAndUpdate(applicationId, {
      $push: { stages: stage._id },
    });

    res.status(201).json({
      status: 'success',
      data: stage,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid stage ID', 400));
    }

    const stage = await Stage.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!stage) {
      return next(new AppError('Stage not found', 404));
    }

    res.json({
      status: 'success',
      data: stage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid stage ID', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const stage = await Stage.findByIdAndDelete(id).session(session);

      if (!stage) {
        throw new AppError('Stage not found', 404);
      }

      await Application.findByIdAndUpdate(stage.applicationId, {
        $pull: { stages: stage._id },
      }).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(204).send();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
