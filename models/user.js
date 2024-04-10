const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const vitalSchema = require("./vital");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validator: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [8, "Min length of password is 8"],
  },
  userID: {
    type: String,
    required: false,
    unique: true,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["Patient", "Nurse"],
  },
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vitals: [vitalSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a virtual 'id' property to return _id as id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

//Pre-save hook to generate unique userID
userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  let prefix;
  // Determine the prefix based on the user role
  switch (this.role) {
    case "Nurse":
      prefix = "N";
      break;
    case "Patient":
      prefix = "P";
      break;
    default:
      prefix = "U"; // Default to 'U' for unknown
      break;
  }

  try {
    let lastUser = await mongoose
      .model("User")
      .findOne({ userID: new RegExp("^" + prefix) }) // Find the last user with the same prefix
      .sort({ createdAt: -1 });

    let newIdNumber = 1;
    if (lastUser && lastUser.userID) {
      // Extract the numeric part of the userID and increment it
      const lastIdNumber = parseInt(lastUser.userID.substring(1));
      newIdNumber = lastIdNumber + 1;
    }

    // Format the new userID with leading zeroes to ensure it is 8 digits
    this.userID = `${prefix}${newIdNumber.toString().padStart(8, "0")}`;

    next();
  } catch (error) {
    next(error);
  }
});

//salting and hashing password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  if (user) {
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) {
      return user;
    }
    throw Error("incorrect password");
  } else {
    throw Error("incorrect email");
  }
};

module.exports = mongoose.model("User", userSchema);
