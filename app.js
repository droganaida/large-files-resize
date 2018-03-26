
const Koa = require('koa');
const views = require('koa-views');
const serve = require('koa-static');
const compose = require('koa-compose');
const bodyParser = require('koa-body');
const path = require('path');
const cors = require('koa2-cors');

const config = require('./config');
const commonMiddleware = require('./common');
const app = new Koa();

const middlewares = compose([
    commonMiddleware.setVariables,
    commonMiddleware.logger,
    commonMiddleware.errorHandler
]);

app.use(bodyParser({
    formidable: {
        uploadDir: config.directories.uploads,
        maxFileSize: config.limits.maxFileSize
    },
    multipart: true,
    urlencoded: true
}));
app.use(cors());
app.use(middlewares);
app.use(serve('.'));
app.use(serve(__dirname + '/public'));
app.use(views(path.join(__dirname, '/templates'), { extension: 'ejs' }));
app.use(require('./routes').routes());

app.listen(config.port, () => console.log(`Вишу на порту ${config.port}`));