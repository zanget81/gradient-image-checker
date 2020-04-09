'use strict';

const fs = require('fs');
const jpeg = require('jpeg-js');


var jpeg = require('jpeg-js');
var jpegData = fs.readFileSync('grumpycat.jpg');
var rawImageData = jpeg.decode(jpegData);
console.log(rawImageData);

// TODO
function check(imagePath) {
    var jpegData = fs.readFileSync(imagePath);
    var rawImageData = jpeg.decode(jpegData);

    return Promise.resolve();
}

module.exports = {
    check
};
