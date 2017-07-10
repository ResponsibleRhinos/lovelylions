var db = require('../../database/index.js');
var Promise = require('bluebird');
var fs = require('fs');
fs.writeFileAsync = Promise.promisify(fs.writeFile);
var generateFilename = require('./helperFunctions.js').generateFilename;


var saveImagePart = (req, bodyPart) => {
  var base64Data = req.body[bodyPart].path.split(',')[1];
  var fileName = generateFilename(base64Data);
  var username = req.body.artist;
  console.log('username: ', username);
  return fs.writeFileAsync(`./server/images/${fileName}.png`, base64Data, 'base64')
    .catch((err) => {console.log(err)})
    .then(() => {
      req.body[bodyPart].path = `./images/${fileName}.png`;
      return db.getUserIdAsync(username);
    }).then((userId) => {
      console.log('user id: ', userId);
      let thePath = `images?path=${fileName}.png`;
      return db.savePartImageAsync(userId, bodyPart, thePath);
    }).then((partId) => {
      req.body[bodyPart]['partId'] = partId;
    });
};

module.exports = (req, res) => {
  var bodyParts = ['head', 'torso', 'legs'];
  saveImagePart(req, 'head')
    .then(() => {
      return saveImagePart(req, 'torso');
    }).then(() => {
      return saveImagePart(req, 'legs');
    }).then(() => {
      return db.saveImageToFinalImageAsync(req.body);
    }).then((data) => {
      bodyParts.forEach((part) => console.log(req.body[part]['partId']));
      res.end();
    });
}