#!/usr/bin/env node
'use strict';

const minimist = require('minimist');

const { log, logError } = require('./utils');
const { checker } = require('./checker');
const { stdReport } = require('./reporter');

function main() {
    log("####################################");
    log("       Gradient Image Checker       ");
    log("####################################");
    log("");

    let args = minimist(process.argv.slice(2), {
        string: 'path',
        alias: { p: 'path'},
        unknown: function (param) {
            throw new Error("Unknown parameter: " + param);
        }
    });

    if (!args.path) {
        log("Please provide a path for the gradient image: '-p ./path/to/gradientImage");
        process.exit(-1);
    }

    checker(args.path).then((imageObj) => {
        stdReport(args.path, imageObj);
    }).catch((e) => {
        logError('There was an error checking the image: ' + e);
    });
}


if (require.main === module) {
    try {
        main();
    }catch (e) {
        log("ERROR: " + e);
    }
}
