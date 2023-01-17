// const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  let errormail = '';
  if (req.user) {
    errormail = req.user.email;
  }

  // logger.error({
  //   message: err.message,
  //   user: errormail,
  //   ip: req.ip,
  //   method: req.method,
  //   path: req.path
  // });

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
