# Dicom.js
dicom.js是一个dicom的显示控件
## 功能
dicom图像的系列显示
## 依赖的浏览器特性
* [webgl](https://en.wikipedia.org/wiki/WebGL)
如果其不支持webgl的线性插值，在放大时会有锯齿, 后面可以考虑使用half_float_texture等来减少内存的消耗
* [typed array](https://developer.mozilla.org/en/docs/Web/JavaScript/Typed_arrays)

该库支持IE11， Edge，及较新的Chrome， Firefox， Safri的浏览器。

## 依赖项
* [dwv](https://github.com/ivmartel/dwv) 一个dicom解析显示组件，我们使用了其解析模块，可以考虑将其抽离出来。不支持多frame的dicom文件，可以考虑将其抽离出来， 需要typed array特性
* [three.js](https://github.com/mrdoob/three.js)
three.js库是一个webgl的渲染库， 我们使用了其来渲染图形和图像， 需要webgl特性
用于在build时拼接压缩js文件，该组件仅build时依赖。
* [dicom.js](https://coding.net/u/matazure/p/dicom.js)
即本项目自己生成的

## Build
build.bat会生成libs/dicom.min.js文件，如果使用OSX或者linux平台，则对应做下处理，需要安装nodejs后用
```
npm install -g unglifyjs
```
安装uglifyjs组件，可github搜索uglifyjs了解因为项目里面又加入了新文件， 在最终发布时， 重新编写build.bat文件生成正确的dicom.min.js文件。

## 部署测试
项目中加入了nodejs的静态资源部署模块， 可下载安装nodejs后在dicom.js目录下执行：
```
npm install
node server.js
```
然后访问问localhost:3000端口， 既可查看资源， http://localhost:3000/examples/demo.html 是现在的范例

## 内存问题
dicom.js消耗了大量的内存， 比如200M图像会消耗200*4MB的内存，那是因为有数据被全部一次转换成了float数据+纹理内存， 所以产生了过多的内存消耗， 可以考虑单张的内存转换和绑定，这样就不会有过多的内存消耗，但是该方法会需要不断往显存里面写数据，会很卡， 所以两种方案需要权衡，如果将来需要有缩略图，需要将 图像数据相关的部分重构一下，要将原始图像数据将分辨率后放入viewer里面，以防止过多的内存开销。

## 使用简介

### Viewer

### Pane

### Behavior

### Command

### Overlay
