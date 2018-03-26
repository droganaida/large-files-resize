const winston = require('winston');

function getLogger(module) {

    const path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports:[
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            }),
            new (winston.transports.File)({
                filename: 'node.log',
                label: path,
                colorize: true
            })
        ]
    });
}

module.exports = getLogger;