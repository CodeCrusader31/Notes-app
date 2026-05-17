import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";

export interface INote {
  title: string;
  content: string;
  owner: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteDocument = HydratedDocument<INote>;

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index({ title: "text", content: "text", tags: "text" });
noteSchema.index({ owner: 1, isDeleted: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ sharedWith: 1, isDeleted: 1, updatedAt: -1 });

noteSchema.set("toJSON", {
  transform: (_doc, ret: Partial<INote> & { _id?: unknown; id?: unknown }) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Note = mongoose.model<INote>("Note", noteSchema);
