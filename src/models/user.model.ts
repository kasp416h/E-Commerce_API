import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IUser>("User", userSchema);
