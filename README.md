# Dicom.js

基于dicom系列2D显示序列

## 功能

基于WebGL的高效2D绘制引擎, 已经支持一下功能

* 2D序列显示
* 翻页
* 布局调整
* 窗宽窗位
* 平移缩放
* 选装反转

## 依赖的浏览器特性

该库支持IE11, Edge, 及较新的Chrome, Firefox, Safri的浏览器, 需要下面两个关键特性

* [webgl](https://en.wikipedia.org/wiki/WebGL)
* [typed array](https://developer.mozilla.org/en/docs/Web/JavaScript/Typed_arrays)

## 依赖项

* [dicomParser](https://github.com/cornerstonejs/dicomParser) 一个dicom文件解析工具
* [three.js](https://github.com/mrdoob/three.js)
three.js库是一个webgl的渲染库, 我们使用了其来渲染图形和图像, 需要webgl特性
用于在build时拼接压缩js文件, 该组件仅build时依赖. 
* [dicom.js](https://coding.net/u/matazure/p/dicom.js)即本项目自己生成的

## 生成

安装uglify-js, 使用gen_min_dicomjs.sh生成libs/dicom.min.js文件

```bash
npm install uglify-js -g
```

## 示例

项目中加入了nodejs的静态资源部署模块, 可下载安装nodejs后在dicom.js目录下执行：

```bash
npm install
node server.js
```

通过<http://localhost:3000/examples/demo.html>即可查看示例, 示例依赖图像, 需要适配你自己dicom图像数据

## 结构说明

### Viewer

Viewer是我们的最外层组件, 其管理dicom图像和Panes

事件说明

* layoutChanged 当执行layoutGrid操作后, 会响应该事件
* sizeChanged 当viewer的div发生改变时, 直接使用了window的resize事件触发, 暂未考虑其他的sizeChanged方式

### Pane

每个Pane对应个独立的绘制面板, 每个面板拥有独立的容器(div), Threejs的Scene和behaviros

* loaded 当threejs已经初始化完成, 可以渲染时触发
* sizeChanged 当pane的size发生改变和进行缩放时触发

### Behavior

目前behavior作用于单独的pane, 目前主要实现了鼠标交互行为和一两个触摸交互行为. 大家可以参考已有的behavior实现自定义的behavior

### Command

目前command均作用于viewer里的所有panes, command的设计主要是为了将来实现todo和undo的功能

### Overlay

overlay目前主要在pane中使用, pane默认会添加topoverlay以响应鼠标事件, 除此之外还有其他的多种overlay

## 合作交流

邮箱: p3.1415@qq.com
微信: zhangzhimin-tju
