// Requires
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

// Const data
const Schema = mongoose.Schema;

// Hospital Schema
const hospitalSchema = new Schema({
  id: {
    type: Number,
    required: [true, `El id es requerido`],
    default: 0
  },
  name: {
    type: String,
    required: [true, `El nombre del Hospital es requerido`]
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
  latitude: {
    type: Number,
    required: false,
    default: 0
  },
  longitude: {
    type: Number,
    required: false,
    default: 0
  }
});

hospitalSchema.plugin(autoIncrement.plugin, { model: 'Hospital', field: 'id' });

hospitalSchema.methods.updateData = function (overwriteData) {
  for (const att in overwriteData) {
    if (Object.hasOwnProperty.call(overwriteData, att)) {
      const newData = overwriteData[att];
      if (this[att] !== undefined) {
        this[att] = newData;
      }
    }
  }
}

// Hospital Model
const HospitalModel = mongoose.model(`Hospital`, hospitalSchema, `Hospitals`);

module.exports = HospitalModel;