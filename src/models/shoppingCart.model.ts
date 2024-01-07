import { Schema, model, Document, Types } from "mongoose";

export type ICartItem = {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
};

export type IShoppingCart = Document & {
  userId: Types.ObjectId;
  items: ICartItem[];
};

const shoppingCartSchema = new Schema<IShoppingCart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IShoppingCart>("ShoppingCart", shoppingCartSchema);
