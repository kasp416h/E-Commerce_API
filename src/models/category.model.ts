import { Schema, model, Document, Types } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

export type ICategory = Document & {
  name: string;
  description: string;
  parentCategoryId: Types.ObjectId | null;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isActive: boolean;
  isVisible: boolean;
  slug: string;
  order: number;
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    icon: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    slug: { type: String, required: true },
    order: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.plugin(AutoIncrementID, {
  field: "order",
  startAt: 1,
});

export default model<ICategory>("Category", categorySchema);
