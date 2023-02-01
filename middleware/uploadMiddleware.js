/* eslint-disable prefer-template */
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/xhtml+xml'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter: filefilter });

module.exports = upload;
