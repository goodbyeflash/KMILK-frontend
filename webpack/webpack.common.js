const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPageNames = ['event1', 'event2', 'admin', 'admin-event1', 'admin-event2','admin-statistics'];

const multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: Path.resolve(__dirname, `../src/pages/${name}.html`), // relative path to the HTML files
    filename: `pages/${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  entry: {
    'main': Path.resolve(__dirname, '../src/scripts/index.js'),
    'event1': Path.resolve(__dirname, '../src/scripts/event1.js'),
    'event2': Path.resolve(__dirname, '../src/scripts/event2.js'),
    'admin': Path.resolve(__dirname, '../src/scripts/admin.js'),
    'admin-event1': Path.resolve(__dirname, '../src/scripts/admin-event1.js'),
    'admin-event2': Path.resolve(__dirname, '../src/scripts/admin-event2.js'),
    'admin-statistics': Path.resolve(__dirname, '../src/scripts/admin-statistics.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
    assetModuleFilename : 'asset/images/[name].[ext]'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }],
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      chunks: ['main'],
    }),
  ].concat(multipleHtmlPlugins),
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type : 'asset/resource'
      },
    ],
  },
};
