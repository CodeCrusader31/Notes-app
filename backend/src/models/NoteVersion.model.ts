import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";

export interface INoteVersion {
  noteId: Types.ObjectId;
  oldTitle: string;
  oldContent: string;
  updatedBy: Types.ObjectId;
  versionNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteVersionDocument = HydratedDocument<INoteVersion>;

const noteVersionSchema = new Schema<INoteVersion>(
  {
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    oldTitle: {
      type: String,
      required: true,
    },
    oldContent: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteVersionSchema.index({ noteId: 1, versionNumber: -1 }, { unique: true });

export const NoteVersion = mongoose.model<INoteVersion>("NoteVersion", noteVersionSchema);
