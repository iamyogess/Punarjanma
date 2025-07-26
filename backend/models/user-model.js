import mongoose from "mongoose"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  password: { type: String, required: true },
  verificationCode: { type: String },
  verificationCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  loginAttempt: { type: Number, default: 0 },
  lockUntil: { type: Date },
  premiumCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.generateJWT = function () {
  return JWT.sign({ id: this._id, email: this.email, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  this.verificationCode = code
  this.verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  return code
}

userSchema.methods.verifyVerificationCode = function (verificationCode) {
  return this.verificationCode === verificationCode && this.verificationCodeExpiry > new Date()
}

const UserModel = mongoose.model("User", userSchema)

export default UserModel
