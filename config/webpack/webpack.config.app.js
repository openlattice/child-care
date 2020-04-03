/* eslint-disable import/extensions */

const devWebpackConfig = require('./webpack.config.dev.js');
const prodWebpackConfig = require('./webpack.config.prod.js');

module.exports = (env) => {

  const appWebpackConfig = {};
  const webpackEnvironment = env || {};

  if (webpackEnvironment.production) {
    Object.assign(appWebpackConfig, prodWebpackConfig(webpackEnvironment));
  }
  else {
    Object.assign(appWebpackConfig, devWebpackConfig(webpackEnvironment));
  }

  return appWebpackConfig;
};
