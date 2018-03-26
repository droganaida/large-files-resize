
const fsAsync = require('./fsAsync');
const sharp = require('sharp');
sharp.cache(false);

async function sharpResize(fileIn, fileOut, resize) {

    const image = sharp(fileIn);
    let startTime = new Date();

    const imageSize = await image.metadata();
    await image
             .resize(Math.round(imageSize.width * resize), Math.round(imageSize.height * resize))
             .flatten(true)
             .toFile(fileOut);

    await fsAsync.unlinkFile(fileIn);
    return [fileOut.substr(1), (new Date() - startTime)];
}

module.exports.sharpResize = sharpResize;