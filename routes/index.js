
const router = require('koa-router')();

const startPageRoute = require('./startPage');
router.get('/', startPageRoute.get);

const imageResizeRoute = require('./imageResize');
router.post('/', imageResizeRoute.resizeImage);

module.exports = router;