// Requires
const msj = require('./../../shared/msj.shared');

// Exports
module.exports.basicGet = (req, res, next) => {
  msj.sendData(res, `Request done`);
}