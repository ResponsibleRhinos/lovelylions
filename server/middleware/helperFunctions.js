var crypto = require('crypto');

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
};


module.exports.generateFilename = (fileData) => {
  var hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
};