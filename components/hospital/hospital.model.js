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
    required: false
  },
  longitude: {
    type: Number,
    required: false
  }
});

hospitalSchema.plugin(autoIncrement.plugin, { model: 'Hospital', field: 'id' });

// Hospital Model
const HospitalModel = mongoose.model(`Hospital`, hospitalSchema, `Hospitals`);

module.exports = HospitalModel;