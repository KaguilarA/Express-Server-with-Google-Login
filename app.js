// Requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const colors = require('./shared/colors.shared');
const { connect } = require('./database/database.connection');

// Routes Imports
const components = require('./components/component.routes');

// Constants
const solidColors = colors.colors;

// Initialization
const app = express();

// DB Connection
connect();

// Body Parser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(cors());

// Routes
app.use(express.static(`./test`))
app.use('/', components);

// Listener

app.listen(process.env.PORT, () => {
  console.log(`Server Up on port ${process.env.PORT} ${solidColors.magenta}`, 'online');
});