const path = require('path');

const ASSETS = 'assets';
const BUILD = 'build';
const CSS = 'css';
const IMAGES = 'images';
const JS = 'js';
const NODE = 'node_modules';
const SOURCE = 'src';
const STATIC = 'static';

const ROOT = path.resolve(__dirname, '../..');

module.exports = {
  ABS: {
    APP: path.resolve(ROOT, `${SOURCE}/index.js`),
    BUILD: path.resolve(ROOT, BUILD),
    BUILD_STATIC_CSS: path.resolve(ROOT, `${BUILD}/${STATIC}/${CSS}`),
    BUILD_STATIC_JS: path.resolve(ROOT, `${BUILD}/${STATIC}/${JS}`),
    NODE: path.resolve(ROOT, NODE),
    SOURCE: path.resolve(ROOT, SOURCE),
    SOURCE_ASSETS_IMAGES: path.resolve(ROOT, `${SOURCE}/${ASSETS}/${IMAGES}`),
  },
  REL: {
    STATIC_ASSETS_IMAGES: path.join(STATIC, `${ASSETS}/${IMAGES}`),
    STATIC_CSS: path.join(STATIC, CSS),
    STATIC_JS: path.join(STATIC, JS),
  }
};
