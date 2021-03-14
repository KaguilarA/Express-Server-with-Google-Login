// Requires
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

// Const data
const roles = [1, 2, 3];
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  id: {
    type: Number,
    required: [true, `El id es requerido`],
    default: 0
  },
  firstName: {
    type: String,
    required: [true, `El primer nombre es requerido`]
  },
  secondName: {
    type: String,
    required: false,
    default: ``
  },
  firstSurname: {
    type: String,
    required: [true, `El primer apellido es requerido`]
  },
  secondSurname: {
    type: String,
    required: false,
    default: ``
  },
  img: {
    type: String,
    required: false
  },
  img_id: {
    type: String,
    required: false,
    default: ``
  },
  email: {
    type: String,
    unique: true,
    required: [true, `El correo electrónico es requerido`]
  },
  password: {
    type: String,
    required: [true, `La contraseña es requerida`]
  },
  role: {
    type: Number,
    required: true,
    enum: roles
  },
  googleTokenLogin: {
    type: Boolean,
    required: true,
    default: false
  }
});

userSchema.pre(`save`, function (next) {
  this.password = bcrypt.hashSync(this.password);
  next();
});

userSchema.virtual('fullName').get(function() {
  const fullName = this.firstName + ' ' + this.firstSurname;
  return fullName;
});

userSchema.methods.comparePassword = function (pPwToValidate) {
  const isMatch = bcrypt.compareSync(pPwToValidate, this.password);
  return isMatch;
}

userSchema.methods.setGoogleLogin = function () {
  this.googleTokenLogin = true;
}

userSchema.plugin(uniqueValidator, {
  message: `El correo electrónico ya esta registrado.`
});

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });

// User Model
const UserModel = mongoose.model(`User`, userSchema, `Users`);

module.exports = UserModel;