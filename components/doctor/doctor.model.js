// Requires
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

// Const data
const Schema = mongoose.Schema;
const ObjectId= mongoose.Types.ObjectId;

// Doctor Schema
const doctorSchema = new Schema({
  id: {
    type: Number,
    required: [true, `El id es requerido`],
    default: 0
  },
  firstName: {
    type: String,
    required: [true, `El primer nombre del doctor es requerido`]
  },
  secondName: {
    type: String,
    required: false,
    default: ``
  },
  firstSurname: {
    type: String,
    required: [true, `El primer apellido del doctor es requerido`]
  },
  secondSurname: {
    type: String,
    required: false,
    default: ``
  },
  img: {
    type: String,
    required: false,
    default: `https://res.cloudinary.com/thiamine/image/upload/v1611333689/adminPro/no-img.jpg`
  },
  img_id: {
    type: String,
    required: false,
    default: ``
  },
  userCreatorId: {
    type: Schema.Types.ObjectId,
    ref: `User`
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: `Hospital`,
    required: [true, `El hospital es requerido`],
  }
});

doctorSchema.static.validateIdType = (id) => {
  return ObjectId.isValid(id);
}

doctorSchema.plugin(autoIncrement.plugin, { model: 'Doctor', field: 'id' });

doctorSchema.methods.updateData = function (overwriteData) {
  for (const att in overwriteData) {
    if (Object.hasOwnProperty.call(overwriteData, att)) {
      const newData = overwriteData[att];
      if (this[att] !== undefined) {
        this[att] = newData;
      }
    }
  }
}

// Doctor Model
const DoctorModel = mongoose.model(`Doctor`, doctorSchema, `Doctors`);

module.exports = DoctorModel;