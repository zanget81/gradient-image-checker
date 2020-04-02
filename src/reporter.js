'use strict';

// TODO
function colourToNameColour(colour) {
    let result;

    if (colour) {
        switch (colour) {
            case '255255255': {
                result = 'White';
                break;
            }
            default: {
                result = colour.match(/.{1,3}/g).join(',');
                break;
            }
        }
    }

    return result;
}

// https://www.w3.org/TR/PNG-Chunks.html
function colourTypeToString(colourType) {
    let result;
    switch(colourType) {
        case 0: {
            result = 'grayscale sample (no alpha)';
            break;
        }
        case 2: {
            result = 'R,G,B triple (no alpha)';
            break;
        }
        case 3: {
            result = 'palette index';
            break;
        }
        case 4: {
            result = 'grayscale sample followed by an alpha sample';
            break;
        }
        case 6: {
            result = 'R,G,B triple followed by an alpha sample.';
            break;
        }
        default: {
            result = 'colour type not supported';
        }
    }

    return result;
}

function stdReport(imagePath, objToReport) {
    console.log('');
    console.log('RESULTS');
    console.log('--------');
    console.log('Image Path : ' + imagePath);
    console.log('Dimensions (width x height): (' + objToReport.width + ' x ' + objToReport.height + ')');
    console.log('Colour Type: (' + objToReport.colorType + ') - ' + colourTypeToString(objToReport.colorType));
    console.log('Image is a Gradient: ' + (objToReport.gradient ? 'Yes' : 'No'));
    if (objToReport.gradient) {
        const colorString =  colourToNameColour(Object.keys(objToReport.colourList)[0]);
        if (colorString) {
            console.log('Gradient Colour: ' + '(' + colorString + ')');
        }
    }
}

module.exports = {
    stdReport
};
