import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  company: string;
  role: string;
  userComments?: string;
  vacancyText?: string;
  city?: string;
  workType: 'remote' | 'on-site' | 'hybrid';
  resumeFile?: string;
  createdAt: Date;
  updatedAt: Date;
  stages: mongoose.Types.ObjectId[];
}

const ApplicationSchema: Schema = new Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      index: true,
    },
    userComments: {
      type: String,
      trim: true,
    },
    vacancyText: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    workType: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
      default: 'on-site',
    },
    resumeFile: {
      type: String,
    },
    stages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stage',
      },
    ],
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({
  company: 'text',
  role: 'text',
  userComments: 'text',
  vacancyText: 'text',
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);
