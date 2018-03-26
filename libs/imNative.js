
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

module.exports.imNativeResize = imNativeResize;