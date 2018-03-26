
const fs = require('fs');
const {promisify} = require('util');

const unlinkFileAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);

async function saveStream(streamIn, streamOut) {

    streamIn.on('end', function() {
        streamOut.end();
    });

    const end = new Promise(function(resolve, reject) {
        streamIn.on('end', () => resolve('ok'));
        streamIn.on('error', reject);
    });

    streamIn.pipe(streamOut);

    return await end;
}

async function unlinkFile(file) {
    await unlinkFileAsync(file);
}

async function makeDir(folder) {
    await mkdirAsync(folder);
}

async function folderCleaner(folder) {
    const files = await readdirAsync(folder);
    const unlinkPromises = files.map(filename => unlinkFileAsync(`${folder}/${filename}`));
    return await Promise.all(unlinkPromises);
}

module.exports.saveStream = saveStream;
module.exports.unlinkFile = unlinkFile;
module.exports.makeDir = makeDir;
module.exports.folderCleaner = folderCleaner;