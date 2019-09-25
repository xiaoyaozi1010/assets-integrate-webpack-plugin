const AssetGenerateWebpackPlugin = require('./asset-integrate-webpack-plugin')

module.exports = {
  webpack: function (config) {
    config.plugins.push(new AssetGenerateWebpackPlugin({
      templatePath: 'file-template.ejs',
      filename: 'demo-anss.txt',
    }))
    return config
  }
}
