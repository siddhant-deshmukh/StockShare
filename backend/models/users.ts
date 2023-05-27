import mongoose, { Types } from "mongoose";

export interface IUserSnippet {
  name: string,
}
export interface IUser extends IUserSnippet {
  _id: Types.ObjectId,
  emailVerfied: boolean,
  email?: string,
}
export interface IUserCreate {
  name: string,
  emailVerfied: boolean,
  email: string,
  password?: string,
}
export interface IUserStored extends IUserSnippet {
  _id: Types.ObjectId,
  emailVerfied: boolean,
  email: string,
  password?: string,
}

const userSchema = new mongoose.Schema<IUserStored>({
  name: { type: String, required: true, maxLength: 50, minlength: 3 },
  email: { type: String, unique: true, maxLength: 50, minlength: 3 },
  password: { type: String, maxLength: 100, minlength: 5 },
  emailVerfied: { type: Boolean, default: false }
})

const User = mongoose.model<IUserStored>("User", userSchema);
export default User;