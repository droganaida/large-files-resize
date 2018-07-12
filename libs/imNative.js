
const fs = require('fs');
const fsAsync = require('./fsAsync');
const spawn = require('child_process').spawn;
const Stream = require('stream');

function imCommand(streamIn, command, args) {

    const proc = spawn(command, args);

    const stream = new Stream();

    proc.stderr.on('data', stream.emit.bind(stream, 'error'));
    proc.stdout.on('data', stream.emit.bind(stream, 'data'));
    proc.stdout.on('end', stream.emit.bind(stream, 'end'));
    proc.on('error', stream.emit.bind(stream, 'error'));

    streamIn.pipe(proc.stdin);

    return stream;
}

async function imNativeResize(file, filePath, resize) {

    let startTime = new Date();
    const streamIn = fs.createReadStream(file);
    const streamResize = imCommand(streamIn, 'convert', ["-", "-resize", resize* 100 + "%", "-"]);
    const streamOut = fs.createWriteStream(filePath);

    await fsAsync.saveStream(streamResize, streamOut);
    await fsAsync.unlinkFile(file);

    return [filePath.substr(1), (new Date() - startTime)];
}

function promiseFromChildProcess(child) {
    return new Promise((resolve, reject) => {
        child.addListener('error', (code, signal) => {
            console.log('ChildProcess error', code, signal);
            reject();
        });
        child.addListener('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject();
            }
        });
    });
}

async function imNativeConvertPSD(file, filePath) {

    let startTime = new Date();
    const streamIn = fs.createReadStream(file);
    const streamOut = fs.createWriteStream(filePath);

    await fsAsync.saveStream(streamIn, streamOut);

    const magicCommands = [
        file + '[0]',
        "-background",
        "white",
        "-flatten",
        filePath.replace('.psd', '.jpg')
    ];
    await promiseFromChildProcess(spawn("convert", magicCommands));

    await fsAsync.unlinkFile(file);
    await fsAsync.unlinkFile(filePath);

    return [filePath.replace('.psd', '.jpg').substr(1), (new Date() - startTime)];
}

module.exports.imNativeResize = imNativeResize;
module.exports.imNativeConvertPSD = imNativeConvertPSD;