import { Schema, model, Document, Types } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

export type IProduct = Document & {
  name: string;
  description: string;
  price: number;
  categoryId: Types.ObjectId;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  brand?: string;
  ratings: {
    rating: number;
    numOfReviews: number;
  };
  isActive: boolean;
  order: Number;
};

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String }],
    stock: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 0 },
    brand: { type: String },
    ratings: {
      rating: { type: Number, default: 0 },
      numOfReviews: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
    order: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.plugin(AutoIncrementID, {
  field: "order",
  startAt: 1,
});

export default model<IProduct>("Product", productSchema);
