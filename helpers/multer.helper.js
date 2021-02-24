const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const validExt = [
  `.png`,
  `.jpg`,
  `.gif`,
  `.jpeg`
];

module.exports = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    const fileExtention = path.extname(file.originalname);
    if (!validExt.includes(fileExtention)) {
      cb(new Error("File type is not supported"), false);
    }
    cb(null, true);
  },
});