/* eslint-disable import/extensions */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

const APP_PATHS = require('../app/paths.config.js');
const baseWebpackConfig = require('./webpack.config.base.js');

module.exports = (env) => {

  const DEV_SERVER_PORT = 9000;
  const baseConfig = baseWebpackConfig(env);

  const output = Object.assign({}, baseConfig.output, {
    filename: `${APP_PATHS.REL.STATIC_JS}/index.js`,
  });

  const plugins = [
    new HtmlWebpackPlugin({
      favicon: `${APP_PATHS.ABS.SOURCE_ASSETS_IMAGES}/favicon_v2.png`,
      inject: true,
      template: `${APP_PATHS.ABS.SOURCE}/index.html`,
    }),
    new Webpack.HotModuleReplacementPlugin(),
    ...baseConfig.plugins
  ];

  return Object.assign({}, baseConfig, {
    output,
    plugins,
    devServer: {
      contentBase: APP_PATHS.ABS.BUILD,
      historyApiFallback: {
        index: baseConfig.output.publicPath,
      },
      hot: true,
      port: DEV_SERVER_PORT,
      publicPath: baseConfig.output.publicPath,
    },
    devtool: false,
  });
};
