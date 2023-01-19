/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcDir = path.join(__dirname, 'src');

const entries = {
  Panel: `${srcDir}/Panel/Panel`,
  RepositoryAction: `${srcDir}/RepositoryAction/RepositoryAction`,
};

module.exports = {
  entry: entries,
  devtool: 'source-map',
  output: {
    filename: '[name]/[name].js',
    publicPath: '/dist/',
    clean: true,
  },
  devServer: {
    server: 'https',
    port: 3000,
    static: ['dist'],
  },
  stats: {
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.woff$/,
        type: 'asset/inline',
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html'],
    alias: {
      'azure-devops-extension-sdk': path.resolve('node_modules/azure-devops-extension-sdk'),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: '**/*.html', context: 'src' }],
    }),
  ],
};
