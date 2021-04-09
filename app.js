require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const colors = require('./shared/colors.shared');
const { connect } = require('./database/database.connection');
const components = require('./components/component.routes');

const solidColors = colors.colors;
const app = express();
connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(`./test`))
app.use('/', components);

app.listen(process.env.PORT, () => {
  const log = `Server Up on port ${process.env.PORT} ${solidColors.magenta}`
  console.log(log, 'online');
});