# assets-integrate-webpack-plugin

## AssetsIntegrateWebpackPlugin 文档

> 背景：大多数前后端集成开发中，前端单独开发出来的 webapp bundle，需要手动拷贝至后端环境，填入java、php或者go代码，如果是html文件尚可使用html-webpack-plugin修改，如果是某些php、go、java片段代码的话，改动范围比较大，此插件意在解决此问题。

### usage

`webpack.config.js`

```js
const AssetsIntegrateWebpackPlugin = require('assets-integrate-webpack-plugin')
module.exports = {
  entry: './index.js'，
  // ...
  plugins: [
    new AssetsIntegrateWebpackPlugin({
      // options ...
    })
  ]
}
```

`create-react-app`

```bash
npm i react-app-rewired --save-dev
# or
yarn add react-app-rewired --dev
```

根目录新建 `config-overrides.js`

```js
const AssetsIntegrateWebpackPlugin = require('assets-integrate-webpack-plugin')
module.exports = {
  webpack(config) {
    config.plugins.push(
    	new AssetsIntegrateWebpackPlugin({
        // options ...
      })
    )
  }
}
```

#### options

##### .templatePath

模板路径配置

```js
{
  template: './index.ejs'
}
```

##### .filename

输出文件名

```js
{
  template: './index.ejs',
  filename: 'test.php',
}
```

#### data sketch

数据格式，插件会将用到的js、css、map等资源文件输出到以下数据中，只需要按照 [`ejs`](https://ejs.bootcss.com/)模板语法编写template，并将资源文件写入模板即可。插件会在模板中插入 `__ASSETS__` 作为全局变量

```js
{
  css: ['path/to/xxxx.[hash].css', 'path/to/main.[hash].css'], // css 
  js: ['path/to/main.[hash].js', 'path/to/xxxx.[hash].js'], 
  sourceMap: ['path/to/main.[hash].js.map', 'path/to/xxxx.[hash].js.map'],
  images: ['path/to/xxxx.[hash].png', 'path/to/xxxx.[hash].svg', 'path/to/xxxx.[hash].jpeg', 'path/to/xxxx.[hash].jpg', 'path/to/xxxx.[hash].gif', 'path/to/favicon.icon'],
  fonts: ['path/to/xxxx.[hash].woff', 'path/to/xxxx.[hash].tff'],
  json: ['path/to/xxxx.[hash].json'],
  others: ['path/to/robots.txt', 'path/to/other-asset-type.ext']
}
```

#### static function

AssetsIntegrateWebpackPlugin提供一个静态方法，用于将文件内容输出。

```js
__ASSETS__.inlineContent('file-path')
```

#### template example

```ejs
<?php
<% for (let css in __ASSETS__.css) { %>
$this->cssfile[] = '<%= __ASSETS__.css[css] %>'
<% } %>
<% for (let js in __ASSETS__.js) { %>
$this->cssfile[] = '<%= __ASSETS__.js[js] %>'
<% } %>
<!-- 插入文件内容 -->
<script type="text/javascript">
<%= __ASSETS__.inlineContent(__ASSETS__.js[0]) %>
</script>
?>
<script>appId = '<?php echo $this->accountInfo['authorizer_appid']; ?>', Ticket = '<?php echo $ticket; ?>';</script>
```

### TODO

- more template type support 更多模板类型支持;
- js/css files should be more category types js、css文件应该分类应该更详细，如，bundle、runtime等;
- add unit test 添加单元测试;
