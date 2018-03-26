
const config = require('./config');
const log = require('./libs/log')(module);
const fsAsync = require('./libs/fsAsync');

async function setVariables(ctx, next) {
    ctx.state.brand = config.brand;
    await next();
}

async function logger(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    log.info('%s %s - %s', ctx.method, ctx.url, ms);
}

async function errorHandler(ctx, next) {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.throw (404, config.error.notFound);
        }
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        if (ctx.method == 'GET') {
            return ctx.render ('error', {
                message: err.message,
                error: ctx.status,
                options: {
                    title: 'Ошибочка вышла'
                }
            });
        } else {
            ctx.body = err.message;
        }
    }
}

module.exports.setVariables = setVariables;
module.exports.logger = logger;
module.exports.errorHandler = errorHandler;