---
layout:     post
title:      "SpringBoot整合Vue脚手架项目"
subtitle:   " \"使用Gradle整合SpringBoot+Vue.js的一个模板项目\""
date:       2017-11-25 23:24:00
author:     "huangyang"
header-img: "img/post-bg-2015.jpg"
tags:
    - SpringBoot
---

## 前因
这两年的项目都是基于SpringMvc+Vue开发的，自从SpringBoot出来后，也逐渐切换到了SpringBoot，因为项目的应用场景是局域网内，无压力，但部署安装要尽可能的方便，但目前前端开发基于Vue2.x，运行在nodejs服务器上，node服务端提供静态页面的服务，同时将rest服务请求转发到SpringBoot项目提供的微服务上。这种模式也没什么大问题，只是安装部署毕竟多了一个node服务端，并且，node服务端开发的技术点毕竟和前端还是不一样，对开发人员的能力要求也略高些。针对有些简单的应用场景，又不想放弃前后端分离开发的优势，又希望安装部署时一个jar包就解决问题，一直希望有一个整合的解决办法。参考了网文[使用Gradle整合SpringBoot+Vue.js-开发调试与打包](http://https://segmentfault.com/a/1190000008968295)，最终实现了上述目标，过程如下。

## 经过
真心感谢作者，说的非常清楚，一步一步照做就行了。这里简单再记录一下过程。
我的开发环境
```
IDE：Intellij IDEA
JDK：Java8
Gradle：4.1
Node.js：8.9.1
Vue-CLI：2.9.1
```
具体怎么安装node，怎么安装vue-cli，怎么通过vue-cli建立脚手架项目，下面就不赘述了。

 **一、 IntelliJ建立一个空Gradle project，既不要选java也不要选web **  
![输入图片说明]({{ site.baseurl }}/img/in-post/2017-11-25-vue-springboot-234708_7f697905_58701.png "1.png")

 **二、 建立前后端子项目 **  
分别建立两个module,一个名叫server，勾选java，另一个名叫web，勾选web。过程中gradle可以选local。  
web模块的build.gradle修改为
```
plugins {
    id "com.moowork.node" version "1.2.0"
    id 'java'
}
//调用npm run build命令的Gradle任务
task npmBuild(type: NpmTask, dependsOn: npmInstall) {
    group = 'node'
    args = ['run', 'build']
}

//Gradle的java插件的jar任务，依赖npmBuild,即web子模块打jar包前必须运行npm run build
jar.dependsOn npmBuild

//调用npm run dev
task npmDev(type: NpmTask, dependsOn: npmInstall) {
    group = 'node'
    args = ['run', 'dev']
}
```

server模块的build.gradle修改为
```
plugins {
    id 'org.springframework.boot' version '1.5.2.RELEASE'
    id 'java'
}

jar {
    baseName = 'server'
    version =  '1.0'
}

repositories {
    //使用淘宝的maven镜像
    maven{ url 'http://maven.aliyun.com/nexus/content/groups/public'}
}

dependencies {
    compile project(':web')//server模块依赖web模块
    compile("org.springframework.boot:spring-boot-starter-web")
    compile("org.springframework.boot:spring-boot-devtools")
    testCompile("org.springframework.boot:spring-boot-starter-test")
}
```
 **三、 后端项目增加配置。**
server项目增加WebConfiguration.java文件如下。因为前端项目build时通过`compile project(':web')`，将前端项目生成为web.jar文件，并放在springboot最终生成的jar包里的BOOT-INF\lib\web.jar位置，因此，静态文件引用要通过classpath的方式去定位，如下代码中，定义了index.html文件的位置，静态文件路径，此外，前端与后端的交互是进行rest请求，因此将后端数据服务urlmapping增加了/api/v1/前缀。
```
@Configuration
@RestController
public class WebConfiguration extends WebMvcConfigurerAdapter
{

    @Value("classpath:/static/index.html")
    private Resource indexHtml;

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CharacterEncodingFilter characterEncodingFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter("UTF-8", true);
        return filter;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
    }

    @Bean
    public ServletRegistrationBean apiV1ServletBean(WebApplicationContext wac) {
        DispatcherServlet servlet = new DispatcherServlet(wac);
        ServletRegistrationBean bean = new ServletRegistrationBean(servlet, "/api/v1/*");
        bean.setName("api-v1");
        return bean;
    }

    @RequestMapping("/")
    public Object index() {
        return ResponseEntity.ok().body(indexHtml);
    }
}
```
 **四、 使用vue-cli生成前端项目。**

先去别处建立一个空文件夹，控制台进入该目录下执行`vue init webpack web`，这是使用vue脚手架建立一个webpack模板项目，更多介绍可参考[vuejs-templates.github.io](https://vuejs-templates.github.io/webpack/)，推荐仔细阅读，就能明白下面改动的具体原理。执行成功后，在刚建立的文件加下会生成名为web的Vue模板项目，刚目录下所有文件拷贝到IntelliJ的web子项目中。IntelliJ下方打开Terminal，执行命令：cd web ，npm install，安装前端依赖。然后右侧Gradle栏目，找到npmDev任务，双击运行一下，任务运行成功会自动打开浏览器，显示localhost:8080，显示Vue的模板页面。我做到这一步有点问题，这姓npmDev后，下方显示任务一直在继续，但就是无法成功，也无错误声明，原因不详。所以手动终端中执行npm run dev，顺利运行。后续操作需要启动前端时，一直使用该命令，不过gradle npmBuild任务没有问题。

 **五、 修改vue前端配置（这一步有点麻烦，也是最关键的地方）。** 
- 因为gradle构建输出目录是build，vue-cli生成的模板的构建脚本的目录也是build，因此这里要把构建脚本的build目录修改成script：点选web/build目录，shift+F6重命名，将web/build目录改成script目录,避免与gradle的构建输出目录冲突。

- 修改web/package.json中与build目录相关的配置：
```
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config script/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node build/build.js"
  },
  改成
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config script/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node script/build.js"
  },
```

- 修改web/config/index.js中的配置,包括webpack打包输出位置，以及配置代理避免跨域问题，具体修改项看下面注释（一共7个地方）：

```
'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

var assetsRoot = path.resolve(__dirname, '../build/resources/main/static') // <-----1.add

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'assets',// <-----6.change
    assetsPublicPath: '/',
    proxyTable: {// <-----7.change
      '/api/**': 'http://localhost:8080'//代理前台/api开头的请求，代理到8080端口，spring boot的访问端口
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 3000, // <-----5.change
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(assetsRoot, 'index.html'), //<-----2.change

    // Paths
    assetsRoot: assetsRoot,// <-----3.change
    assetsSubDirectory: 'assets',// <-----4.change
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
```

至此 ，配置修改完成，IntelliJ右侧Gradle栏目找到npmBuild任务并运行。运行成功，webpack打包的前端资源会输出到web/build目录下。webpack的打包输出路径故意设置成build/resources/main/static，这样子，web子项目打成jar包后，在classpath中的路径就是/static目录了，即跟spring boot默认的静态资源查找路径是一样的。

再者，server子项目依赖web项目（show/server/build.gradle中的compile project(':web')配置），所以server子项目打jar包前会先将web子项目打成jar包，web子项目的jar包中已经包含了webpack输出的静态资源。

所以，当server子项目打包后，访问`http://localhost:8080/index.html` 就能访问到web子项目webpack打包的输出的index.html文件。
- 注意：server子项目打包前，请先删除server/src/main/resources/static目录，避免与web子项目打包过来的文件重复。

- 开发调试期间：先运行show/server子项目的bootRun任务，启动Spring Boot, 再运行web子项目的npmDev任务（有问题的执行npm run dev），启动node的开发服务器, web端请求Spring Boot后台，加上/api前缀，请求即可代理从node的开发服务器`http://localhost:3000/api/xxxx`代理到`http://localhost:8080/api/xxxx`。而在开发前台页面时候（对show/web/src目录下的文件修改），应该访问`http://localhost:3000/`，而不是8080端口，访问3000端口，即可看到页面修改的即时效果。

- 打包：运行server子项目的build任务，即可完成打包。打包的jar包已经包含show/web子项目的输出内容。最终生成一个jar包。

## 结果
建立了一个模板项目[springboot-vue-boilerplate](https://gitee.com/huangyang/springboot-vue-boilerplate)便于以后初始化建立项目。，[Clone地址](https://gitee.com/huangyang/springboot-vue-boilerplate.git)。以后会逐步完善这个项目，做出几个分支，分别加入常用的前后端依赖库，已满足常见的项目需求，如一个小管理平台，一个微信公众号后台等。

