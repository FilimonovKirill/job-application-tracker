import mongoose, { Schema, Document } from 'mongoose';

export interface IStage extends Document {
  type: 'hr_screening' | 'technical_interview' | 'fit_interview' | 'final_interview';
  comments?: string;
  date: Date;
  applicationId: mongoose.Types.ObjectId;
}

const StageSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['hr_screening', 'technical_interview', 'fit_interview', 'final_interview'],
      required: [true, 'Stage type is required'],
    },
    comments: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Stage date is required'],
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStage>('Stage', StageSchema);
