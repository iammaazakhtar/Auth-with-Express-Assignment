import { model, Schema, SchemaType, Types } from "mongoose";

export const User = model(
  "User",
  new Schema({
    name: { type: String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    bio: String,
    followerCount: { type: Number, default: 0 },
  })
);
