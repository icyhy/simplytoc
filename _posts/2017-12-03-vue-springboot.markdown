---
layout:     post
title:      "SpringBoot整合Vue脚手架项目（续）"
subtitle:   " \"使用Gradle整合SpringBoot+Vue.js的一个模板项目\""
date:       2017-12-03 22:39:00
author:     "huangyang"
header-img: "img/post-bg-2015.jpg"
tags:
    - SpringBoot
---
# 前因
前不久写了[SpringBoot整合Vue脚手架项目](http://huangyang.gitee.io/2017/11/26/vue-springboot/)，这两天基于这种方式启动了一个小项目，一切都很顺利，直到......，前端项目需要引用jquery等第三方库，按照vue-cli通过webpack template的要求，将静态文件放到前端项目的static目录下。

补充：前端项目是基于vue-cli webpack template建立的，[参考文档](https://vuejs-templates.github.io/webpack/)，"Handling Static Assets"一章的内容。我理解自己的assets如css文件等，需要webpack处理的放到src/assets目录下，自己的代码也都放到src目录下，第三方的引用放到static目录下，会在build的时候被放到由config/index.js文件中定义的build.assetsPublicPath和build.assetsSubDirectory这两个参数组合决定。
```
// config/index.js
module.exports = {
  // ...
  build: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'assets'
  }
}
```
于是在本项目中前端build后，static文件中的内容被复制到resources/main/static/assets路径下了，路径是由assetsRoot加上上面两个设置得到。这也是server端最终打包后得到的web.jar里的目录形式。
```
var assetsRoot = path.resolve(__dirname, '../build/resources/main/static') 
```
![输入图片说明](https://gitee.com/uploads/images/2017/1204/225841_45a8a2f4_58701.png "1.png")

这下尴尬了，在index.html文件中想要引用static目录中的文件，按理应该使用/assets/plugins/xxx的方式，因为最终打包成springboot的jar包后，里面的静态文件路径就是这样的（将web.jar解压后可以看到），但调试时，直接使用npm run dev时，index.html按照这个路径是找不到文件的，还是需要使用/static/plugins/xxx的方式。

# 解决办法
好吧，自己动手丰衣足食。我想无非就是使调试时的路径和最终打包后的路径一样就得了。于是修改static目录为asset目录，修改script/webpack.prod.conf.js文件中的配置
```
// copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
```
修改为
```
// copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../assets'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
```
成功！！开发和最终发布时路径一致了。前端引用的第三方库文件放在外面的assets目录下即可。模板项目已更新，可参考[springboot-vue-boilerplate](https://gitee.com/huangyang/springboot-vue-boilerplate)。