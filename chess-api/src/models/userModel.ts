import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (enteredpassword: string) {
  return await bcrypt.compare(enteredpassword, this.password);
};

userSchema.methods.generateJwtToken = async function () {
  try {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
  }
};

export default mongoose.model("User", userSchema);
