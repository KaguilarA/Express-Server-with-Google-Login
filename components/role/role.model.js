const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  id: {
    type: Number,
    required: [true, "El id es necesario"],
    default: 0
  },
  name: {
    type: String,
    required: [true, "El nombre es requerido"]
  },
  authentication: {
    type: [String],
    default: []
  },
  state: {
    type: Boolean,
    required: [true, "El estado es requerido."],
    default: true
  }
});

roleSchema.methods.updateData = function (pNewRoleData) {
  for (const key in pNewRoleData) {
    const currentData = pNewRoleData[key];
    this[key] = currentData;
  }
}

roleSchema.methods.updateState = function (pRoleData) {
  this.state = pRoleData
}

roleSchema.methods.addAuth = function (pNewAuth) {
  this.authentication.push(pNewAuth);
}

roleSchema.plugin(autoIncrement.plugin, { model: 'Role', field: 'id' });

const RoleModel = mongoose.model('Role', roleSchema, 'Roles');

module.exports = RoleModel;