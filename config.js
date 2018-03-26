
let config = {};

config.port = 6008;

config.brand = '#BlondieCode';

config.error = {
    notFound: 'Нет такой страницы =(',
    noLibrary: 'Как вам нарезать, товарищ?'
};

config.libraries = [
    {
        code: 'im',
        title: 'ImageMagick'
    },
    {
        code: 'gm',
        title: 'GraphicsMagick'
    },
    {
        code: 'sharp',
        title: 'Sharp'
    }
];

config.directories = {
    uploads: './uploads',
    readyFiles: './ready'
};

config.limits = {
    maxFileSize: 100 * 1024 * 1024
};

module.exports = config;