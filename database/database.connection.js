const mongoose = require('mongoose');
const data = require('dotenv').config();
const colors = require('./../shared/colors.shared');

// Constants
const solidColors = colors.colors;
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}

function dbConnection() {
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', true)
  mongoose.connect(data.parsed.DB_URL, connectionOptions).then((result) => {
    console.log(`Data Base on port 27017 ${solidColors.yellow}`, "online");
  }).catch((err) => {
    console.error(`Connection Error ${solidColors.red}`, err);
  });
}

module.exports = {
  connect: dbConnection
}


