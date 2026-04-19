import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application';
import Stage from '../models/Stage';
import { AppError } from '../middleware/errorHandler';

export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.company) {
      filter.company = { $regex: req.query.company, $options: 'i' };
    }

    if (req.query.role) {
      filter.role = { $regex: req.query.role, $options: 'i' };
    }

    if (req.query.workType) {
      filter.workType = req.query.workType;
    }

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('stages')
        .exec(),
      Application.countDocuments(filter),
    ]);

    res.json({
      status: 'success',
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid application ID', 400));
    }

    const application = await Application.findById(id).populate('stages').exec();

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.json({
      status: 'success',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationData = req.body;

    if (req.file) {
      applicationData.resumeFile = `/uploads/${req.file.filename}`;
    }

    const application = await Application.create(applicationData);

    res.status(201).json({
      status: 'success',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid application ID', 400));
    }

    if (req.file) {
      updateData.resumeFile = `/uploads/${req.file.filename}`;
    }

    const application = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('stages');

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.json({
      status: 'success',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid application ID', 400));
    }

    await Stage.deleteMany({ applicationId: id });
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const searchApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return next(new AppError('Search query is required', 400));
    }

    const applications = await Application.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .populate('stages')
      .exec();

    res.json({
      status: 'success',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
