
const config = require('../config');
const fsAsync = require('../libs/fsAsync');

async function folderCleaner() {
    try {
        await fsAsync.folderCleaner(config.directories.readyFiles);
    } catch (err) {
        console.log(`folderCleaner error: ${err.message}`);
    }
}

async function makeFolders() {

    const folderArray = [config.directories.uploads, config.directories.readyFiles];
    const funcArray = folderArray.map(async folder => {
        try {
            await fsAsync.makeDir(folder);
        } catch (err) {
            console.log(`Folder ${folder} exists`);
        }
    });
    await Promise.all(funcArray);

}

async function get (ctx) {

    let options = {
        title: "Работа с большими изображениями. Уменьшение jpg/png. ImageMagick vs GraphicsMagick vs Sharp. #BlondieCode",
        libraries: config.libraries
    };

    await makeFolders();
    await folderCleaner();
    return ctx.render('main', { options: options });

    // Для теста ошибок от сервера
    // ctx.throw (504, 'Test error');
    // throw new Error('Error here');
}

module.exports.get = get;