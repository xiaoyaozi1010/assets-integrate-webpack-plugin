/*
* Description: generate a integration assets file.
* Author:  lizy(zhiyongli@tencent.com)
* Date: 2019.09.24
* */
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const url = require('url')

const PLUGIN_NAME = 'assets-integrate-webpack-plugin'
const DEFAULT_FILE_NAME = 'index.html'
const FILE_EXT_NAME_MAP = {
  css: '.css',
  js: '.js',
  sourceMap: '.map',
  images: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.icon'],
  fonts: ['.eot', '.woff', '.woff2', '.ttf', '.otf'],
  jsons: '.json',
}
const DEFAULT_OPT = { filename: DEFAULT_FILE_NAME, templatePath: './public/index.html', inlineRuntime: false }
class AssetIntegrateWebpackPlugin {
  constructor(conf) {
    if (!conf || !conf.templatePath || typeof conf.templatePath !== 'string') {
      throw new Error(`${PLUGIN_NAME}: templatePath must be a file path`)
      return
    }
    this.conf = Object.assign(DEFAULT_OPT, conf)
    const templatePath = path.resolve(process.cwd(), this.conf.templatePath)
    if (!fs.existsSync(templatePath)) {
      throw new Error(`${PLUGIN_NAME}: template file is not find at ${templatePath}`)
    }
    this.conf.templatePath = templatePath
  }
  apply(compiler) {
    compiler.hooks.emit.tap('AssetGenerateWebpackPlugin', (compilation) => {
      let AssetsIntegrateWebpackPlugin = {
        css: [],
        js: [],
        sourceMap: [],
        images: [],
        fonts: [],
        jsons: [],
        others: []
      }
      const publicPath = compilation.outputOptions.publicPath
      for (let filename in compilation.assets) {
        const extname = path.extname(filename)
        filename = url.resolve(publicPath, filename)
        if (extname === FILE_EXT_NAME_MAP.css) {
          AssetsIntegrateWebpackPlugin.css.push(filename)
        }
        else if (extname === FILE_EXT_NAME_MAP.js) {
          AssetsIntegrateWebpackPlugin.js.push(filename)
        }
        else if (extname === FILE_EXT_NAME_MAP.sourceMap) {
          AssetsIntegrateWebpackPlugin.sourceMap.push(filename)
        }
        else if (FILE_EXT_NAME_MAP.images.includes(extname)) {
          AssetsIntegrateWebpackPlugin.images.push(filename)
        }
        else if (FILE_EXT_NAME_MAP.fonts.includes(extname)) {
          AssetsIntegrateWebpackPlugin.fonts.push(filename)
        }
        else if (extname === FILE_EXT_NAME_MAP.jsons) {
          AssetsIntegrateWebpackPlugin.jsons.push(filename)
        }
        else {
          AssetsIntegrateWebpackPlugin.others.push(filename)
        }
      }
      AssetsIntegrateWebpackPlugin.inlineContent = function (filepath) {
        if (filepath && path.isAbsolute(filepath)) {
          filepath = filepath.replace(publicPath, '')
        }
        if (filepath && compilation.assets[filepath]) {
          return compilation.assets[filepath].source()
        }
      }
      const tpl = fs.readFileSync(this.conf.templatePath, 'utf8')
      const fileContent = ejs.render(tpl, { __ASSETS__: AssetsIntegrateWebpackPlugin })
      compilation.assets[this.conf.filename || DEFAULT_FILE_NAME] = {
        source: function () {
          return fileContent
        },
        size: function () {
          return fileContent.length
        }
      }
      return compilation
    })
  }
}

module.exports = AssetIntegrateWebpackPlugin
