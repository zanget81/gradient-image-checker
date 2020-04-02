'use strict';

const fs = require('fs');
const { PNG } = require('pngjs');

const RED_INDEX = 0;
const GREEN_INDEX = 1;
const BLUE_INDEX = 2;
const ALPHA_INDEX = 3;

function doesColorTypeSupportGradient(colourType) {
    // grayscale with alpha and rgb with alpha
    return ((colourType === 4) || (colourType === 6));
}

function isIncrementalMode(incremental, alphaProgressive, previousAlphaValue) {
    return (((incremental === true) || (incremental === undefined)) && (alphaProgressive !== false) && (previousAlphaValue !== undefined));
}

function isDecrementalMode(incremental, alphaProgressive, previousAlphaValue) {
    return (((incremental === false) || (incremental === undefined)) && (alphaProgressive !== false) && (previousAlphaValue !== undefined));
}

function imageParser(metadata, data) {
    const colourList = {};
    let previousAlphaValue;
    let alphaProgressive;
    let incremental;

    if (metadata && doesColorTypeSupportGradient(metadata.colorType)) {

        for (let i = 0; i < metadata.height; i++) {
            for (let j = 0; j < metadata.width; j++) {
                const idx = (metadata.width * i + j) << 2;
                const colour = '' + data[idx + RED_INDEX] + data[idx + GREEN_INDEX] + data[idx + BLUE_INDEX];

                // We initialize the color Map if it was empty
                if (!colourList[colour]) {
                    colourList[colour] = 0;
                }

                colourList[colour]+=1;

                // We check that alpha is progressive (increasing or decreasing)
                if (isIncrementalMode(incremental, alphaProgressive, previousAlphaValue)) {
                    if (data[idx + ALPHA_INDEX] >= previousAlphaValue) {
                        if (incremental === undefined) {
                            incremental = true;
                        }
                    } else {
                        alphaProgressive = false;
                    }
                } else if (isDecrementalMode(incremental, alphaProgressive, previousAlphaValue)) {
                    if (data[idx + ALPHA_INDEX] <= previousAlphaValue) {
                        if (incremental === undefined) {
                            incremental = true;
                        }
                    } else {
                        alphaProgressive = false;
                    }
                }

                previousAlphaValue = data[idx + ALPHA_INDEX];
            }
        }

        alphaProgressive = (alphaProgressive === undefined) ? true : false;
    }

    return { alphaProgressive, colourList };
}

function gradientChecker(imageParsed) {
    return imageParsed && imageParsed.alphaProgressive && imageParsed.colourList && (Object.keys(imageParsed.colourList).length === 1);
}

function check(imagePath) {
    let metadata;

    return new Promise((resolve, reject) => {
        //file exists
        fs.createReadStream(imagePath).pipe(new PNG({filterType: 4}))
            .on('metadata', (metadataReceived) => {
                metadata = metadataReceived;
            })
            .on('parsed', (data) => {
                const parsedImage = imageParser(metadata, data);
                const gradient = gradientChecker(parsedImage);

                resolve(Object.assign({}, parsedImage, { gradient }, metadata));
            });
    });
}

module.exports = {
    check
};

