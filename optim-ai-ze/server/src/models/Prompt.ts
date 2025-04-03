import mongoose, { Document, Schema } from 'mongoose';

// Define the Prompt interface
export interface IPrompt extends Document {
  title: string;
  description: string;
  content: string;
  ruleIds?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Prompt schema
const promptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: [true, 'A prompt title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Prompt content is required'],
      trim: true,
    },
    ruleIds: {
      type: [String],
      default: [],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better performance
promptSchema.index({ title: 'text', description: 'text', content: 'text' });

// Export the Prompt model
export const Prompt = mongoose.model<IPrompt>('Prompt', promptSchema);

export default Prompt; 