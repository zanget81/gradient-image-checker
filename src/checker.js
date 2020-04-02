'use strict';

const { logError } = require('./utils');
const pngChecker = require('./png-checker');
const fs = require('fs');

const PNG = 'png';

function selectChecker(imagePath) {
    const extensionChunks = imagePath.split('.');
    let extension = '';
    let promiseResult;

    if (extensionChunks.length > 1) {
        extension = extensionChunks[extensionChunks.length-1];
    } else {
        logError('File has no extension');
    }

    switch (extension) {
        case PNG: {
            promiseResult = pngChecker.check(imagePath);
            break;
        }
        default: {
            logError('Unsupported extension');
        }
    }

    return promiseResult || Promise.reject();
}

function checker(imagePath) {
    return new Promise((resolve, reject) => {
        if (!imagePath) {
            logError('No image path provided');
            reject();
            return;
        }

        fs.access(imagePath, fs.F_OK, (err) => {
            if (err) {
                logError('Error reading image file: ' + err);
                reject();
                return;
            }

            resolve();
        });
    }).then(() => {
        return selectChecker(imagePath);
    });
}

module.exports = {
    checker
};
