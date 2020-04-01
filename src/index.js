#!/usr/bin/env node
'use strict';

const minimist = require('minimist');

const { log } = require('./utils');

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

    log("path: " + args.path);
}


if (require.index === module) {
    try {
        main();
    }catch (e) {
        log("ERROR: " + e);
    }
}
