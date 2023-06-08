import { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export { schema, IUser };
