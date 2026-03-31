import mongoose, { Schema, Document, Model } from "mongoose";

export interface INoteDocument extends Document {
  notes_id: string;
  description: string;
  content: string;
  keyword: string[];
  is_sensitive: boolean;
  dates: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INoteDocument> = new Schema(
  {
    notes_id: {
      type: String,
      required: [true, "Note ID is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    keyword: {
      type: [String],
      default: [],
      index: true,
    },
    is_sensitive: {
      type: Boolean,
      default: false,
    },
    dates: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.index({ description: "text", content: "text", keyword: "text" });
NoteSchema.index({ dates: 1 });

const Note: Model<INoteDocument> =
  mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;