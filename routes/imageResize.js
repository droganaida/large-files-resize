
const config = require('../config');
const path = require('path');

const imNative = require('../libs/imNative');
const gmResize = require('../libs/gmResize');
const sharpResize = require('../libs/sharpAsync');

async function resizeImage(ctx) {

    const file = ctx.request.body.files.fileUpload;
    const filePath = config.directories.readyFiles + '/' + new Date().getTime() + path.extname(file.name);
    let resizeResult;

    switch (ctx.request.body.fields.action) {

        case 'im':
            //=========================== im streams
            resizeResult = await imNative.imNativeResize(file.path, filePath, 0.2);
            ctx.body = {path: resizeResult[0], time: resizeResult[1], size: file.size};
            break;
        case 'gm':
            //=========================== gm
            resizeResult = await gmResize.gmAsync(file.path, filePath, 0.2);
            ctx.body = {path: resizeResult[0], time: resizeResult[1], size: file.size};
            break;
        case 'sharp':
            //=========================== sharp
            resizeResult = await sharpResize.sharpResize(file.path, filePath, 0.2);
            ctx.body = {path: resizeResult[0], time: resizeResult[1], size: file.size};
            break;
        default:
            ctx.throw (500, config.error.noLibrary);
            break;
    }
}

module.exports.resizeImage = resizeImage;