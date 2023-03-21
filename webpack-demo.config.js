const path = require('node:path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function () {
  return {
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.css', '.svg'],
      alias: { '../../worker': '../../worker-dist' },
    },
    entry: './demo/index.tsx',
    devServer: {
      https: true,
      port: 9090,
      static: {
        directory: path.resolve(__dirname, '../demo'),
      },
      liveReload: true,
    },
    stats: 'errors-only',
    devtool: 'source-map',
    output: {
      clean: true,
      path: path.resolve(__dirname, 'demo-dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: { compilerOptions: { noEmit: false } },
          },
          exclude: [/\.(spec|e2e)\.ts$/],
        },
        {
          test: /\.css$/,
          exclude: /variables\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
          ],
        },
        {
          test: /variables\.css$/,
          use: [{ loader: 'postcss-variables-loader?es5=1' }],
        },
        {
          test: /\.svg$/,
          issuer: /\.tsx?$/,
          use: [{ loader: '@svgr/webpack' }],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './demo/index.html',
      }),

      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),

      new CopyWebpackPlugin({
        patterns: [
          { from: '.nojekyll', context: './demo' },
          { from: '**/*.png', context: './demo' },
          { from: '**/*.ico', context: './demo' },
        ],
      }),
    ],
  };
};
