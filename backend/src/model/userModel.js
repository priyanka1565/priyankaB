const mongoose = require("mongoose");

const bycrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const validator = require("validator");
// for genrating user reset password 
// make user model 
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter Your Email "],
    unique: true,
    validate: [validator.isEmail, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter valid password"],
    // we admin also not get password of user so select false
    select: false,
    minlength: [8, "please Enter valid password"],
  },
});

// hash passwrd here and make password strong
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
});

// user login during registraion no seprate login after registration 
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
    expiresIn:process.env.JWT_EXPIRE,
  })
}
// CALL THIS METOD IN CONTROLLERS
// make compared password function 
userSchema.methods.comparePassword = async function (enterpasswordpassword) {
  return await bycrypt.compare(enterpasswordpassword,this.password);
} 

// export 
module.exports = mongoose.model("User", userSchema);