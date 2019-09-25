const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsIntegrateWebpackPlugin = require('assets-integrate-webpack-plugin')
module.exports = {
  entry: 'index.js',
  mode: 'production',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, use: 'babel-loader',
      },
      {
        test: /\.css$/, use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              public: 'assets/',
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: 'ok.[id].css'
    }),
    new AssetsIntegrateWebpackPlugin({
      templatePath: './file-template.ejs',
      filename: 'demo-anss.txt'
    })
  ]
}
