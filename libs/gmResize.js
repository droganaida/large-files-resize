
const fs = require('fs');
const fsAsync = require('./fsAsync');
const gm = require('gm');

async function gmAsync(fileIn, fileOut, resize) {

    let startTime = new Date();
    let stdOut;
    gm(fileIn)
        .resize(resize * 100 + "%")
        .stream(function (error, stdout, stderr) {
            const writeStream = fs.createWriteStream(fileOut);
            stdOut = stdout;
            stdOut.pipe(writeStream);
        });

    const end = new Promise(function(resolve, reject) {
        stdOut.on('end', () => resolve('ok'));
        stdOut.on('error', reject);
    });

    await end;
    await fsAsync.unlinkFile(fileIn);
    return [fileOut.substr(1), (new Date() - startTime)];
}

module.exports.gmAsync = gmAsync;