
//用于布局（grid）视图里面的一个Pane， 同一个Viewer里面的Pane会共享一个Viewer
// left ,bottom width, height is relate to the render size.
DICOM.Pane = function(left, bottom, width, height) {
    this.uuid = THREE.Math.generateUUID();
    this._renderAbled = false;

    this.left = left;
    this.bottom = bottom;
    this.width = width;
    this.height = height;

    this.container = document.createElement('div');
    this.container.style.left = left + '%';
    this.container.style.bottom = bottom + '%';
    this.container.style.width = width + '%';
    this.container.style.height = height + '%';
    this.container.style.position = 'absolute';

    //使用额外的div来放置border， 否在border会干扰clientWidth， offsetWidth等， 影响
    //鼠标的定位
    this.borderDiv = document.createElement('div');
    this.borderDiv.style.left = '0px';
    this.borderDiv.style.top = '0px';
    this.borderDiv.style.right = '0px';
    this.borderDiv.style.bottom = '0px';
    this.borderDiv.style.position = 'absolute';
    this.borderDiv.style.border = '1px solid yellow';
    this.container.appendChild(this.borderDiv);

    this.behaviors = new DICOM.AttachedObjectCollection(this);
    this.overlays = new DICOM.AttachedObjectCollection(this);

    this.state = {};
    this.state.windowWidth = new DICOM.ObservableData();
    this.state.windowLevel = new DICOM.ObservableData();

    this.uniforms = this.uniforms = {
        texture: {type: 't', value: undefined},
        windowWidth: {type: 'f', value: undefined},
        windowLevel: {type: 'f', value: undefined}
    };
};

DICOM.Pane.prototype = new DICOM.AttachedObject();
DICOM.Pane.prototype.constructor = DICOM.Pane;

DICOM.EventDispatcher.prototype.apply(DICOM.Pane.prototype);

DICOM.Pane.prototype.onAttach = function() {

    this.viewer = this.associatedObject;
    this.viewer.container.appendChild(this.container);

    var self = this;
    this._onresize = function(e) {
        if (!self.image) {
            return;
        }

        var cameraSize = self._getCameraSize();
        self.camera.left = cameraSize.width / -2;
        self.camera.right = cameraSize.width / 2;
        self.camera.top = cameraSize.height / 2;
        self.camera.bottom = cameraSize.height / -2;
        self.camera.updateProjectionMatrix();

        self.dispatchEvent({type: 'sizeChanged'});
    };

    this.viewer.addEventListener('resize', this._onresize);
};

DICOM.Pane.prototype.onDetach = function() {
    this.viewer.container.removeChild(this.container);
    this.viewer.removeEventListener('resize', this._onresize);

    this.viewer = undefined;
};


DICOM.Pane.prototype.loadDcmSeries = function(dcmSeries) {
    this.dcmSeries = dcmSeries;
    this.state.frameIndex = new DICOM.ObservableData(0);

    var self = this;

    //利用第一张图像来初始化Pane的各种设置
    dcmSeries.onLoadedImage(0, function(e) {
        //
        self.initializeBy(e.image);
        //激活翻页功能
        DICOM.observe(self.state.frameIndex, function(e) {
            var index = e.newValue;
            dcmSeries.onLoadedImage(index, function(e) {
                self.drawImage(e.image);
            });
        });
    });

    this.dispatchEvent({type: 'loadedDcmSeries', dcmSeries: dcmSeries});
};

DICOM.Pane.prototype.initializeBy = function(imagePrototype) {
    this.image = imagePrototype;

    var geometry = new THREE.PlaneBufferGeometry(this.getImageWidth(), this.getImageHeight());
    var cameraSize = this._getCameraSize();
    this.camera = new THREE.OrthographicCamera(
        cameraSize.width / -2, cameraSize.width / 2, cameraSize.height / 2, cameraSize.height / -2,
        -100, 100);

    this.scene = new THREE.Scene();
    var material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: DICOM.vertexShader,
        fragmentShader: DICOM.fragmentShader
    });
    material.side = THREE.DoubleSide;
    var imageMesh = new THREE.Mesh(geometry, material);
    imageMesh.position.z = 0;
    this.scene.add(imageMesh);
    this.scaleRulerScene = new THREE.Scene();
};

DICOM.Pane.prototype.drawImage = function(image) {
    this.image = image;
    var self = this;

    var state = this.state;
    var uniforms = this.uniforms;

    state.windowWidth.value = state.windowWidth.value || image.windowWidth;
    state.windowLevel.value = state.windowLevel.value || image.windowLevel;

    DICOM.observe(this.state.windowWidth, function(e) {
        uniforms.windowWidth.value = self.state.windowWidth.value;
        uniforms.windowWidth.needsUpdate = true;
    });
    DICOM.observe(this.state.windowLevel, function(e) {
        uniforms.windowLevel.value = self.state.windowLevel.value;
        uniforms.windowLevel.needsUpdate = true;
    });

    this.uniforms.texture.value = this.image.texture;
    this.uniforms.texture.needsUpdate = true;

    if (!this._renderAbled) {
        this._renderAbled = true;
        this.dispatchEvent({type: 'loaded'});
    }
};

DICOM.Pane.prototype.getRect = function() {
    var left = this.container.offsetLeft;
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    if (!this.container.offsetParent) {
        console.error('the viewer container has not appended to document');
    }

    var bottom = this.container.offsetParent.offsetHeight - height - this.container.offsetTop;

    return {
        left: left, bottom: bottom, width: width, height: height
    }
};

DICOM.Pane.prototype.getImageWidth = function() {
    return this.image.column * this.image.pixelSpacingX;
};

DICOM.Pane.prototype.getImageHeight = function() {
    return this.image.row * this.image.pixelSpacingY;
};

DICOM.Pane.prototype.getImageValue = function(pos) {
    var nx = pos.x / this.getImageWidth();
    var ny = pos.y / this.getImageHeight();

    if (nx < 0 || nx >= this.getImageWidth() || ny < 0 || ny >= this.getImageHeight()) {
        return undefined;
    }

    var column = this.image.column;
    var row = this.image.row;
    var x = Math.round(nx * column);
    var y = Math.round(ny * row);
    var offset = column * y + x;
    return this.pixelBuffer[offset];
};

DICOM.Pane.prototype._getCameraSize = function() {
    var rect = this.getRect();
    var imageWidth = this.getImageWidth();
    var imageHeight = this.getImageHeight();
    var cameraWidth, cameraHeight;
    var ratio = imageWidth / imageHeight;
    var paneRatio = rect.width / rect.height;
    if (ratio > paneRatio) {
        cameraWidth = imageWidth;
        cameraHeight = cameraWidth / paneRatio;
    } else {
        cameraHeight = imageHeight;
        cameraWidth = cameraHeight * paneRatio;
    }

    return {width: cameraWidth, height: cameraHeight};
};

DICOM.Pane.prototype.render = function() {
    if (!this.viewer || !this._renderAbled) {
        return;
    }

    var rect = this.getRect();

    this.viewer.renderer.setViewport(rect.left, rect.bottom, rect.width, rect.height);
    this.viewer.renderer.setScissor(rect.left, rect.bottom, rect.width, rect.height);
    this.viewer.renderer.enableScissorTest(true);
    // this.viewer.renderer.setClearColor(new THREE.Color().setRGB(0.5,0.0,0.0));
    this.viewer.renderer.clear();
    this.viewer.renderer.render(this.scene, this.camera);
    this.viewer.renderer.clearDepth();
    this.viewer.renderer.render(this.scaleRulerScene, this.camera);
};

// CameraPosition是和Image图像一样的尺寸, 但坐标适合this.scene一致，
// ImagePosition一般为左上角 输入为鼠标点击在该Dom元素上的位置
DICOM.Pane.prototype.getCameraPosition = function(domPos) {
    var domWidth = this.container.clientWidth;
    var domHeight = this.container.clientHeight;
    var nx = domPos.x / domWidth - 0.5;
    var ny = domPos.y / domHeight - 0.5;

    var sceneX = nx * (this.camera.right - this.camera.left);
    var sceneY = ny * (this.camera.bottom - this.camera.top);

    return {x: sceneX, y: sceneY};
};

DICOM.Pane.prototype.getDomPosition = function(e) {
    return mousePositionElement(e, this.container)
};

DICOM.Pane.prototype.getScenePosition = function(cameraPos) {
    var tmp = new THREE.Vector4(cameraPos.x, cameraPos.y, 0, 1);
    var inMatrixWorld = new THREE.Matrix4();
    inMatrixWorld.getInverse(this.scene.matrixWorld);
    tmp.applyMatrix4(inMatrixWorld);
    return {x: tmp.x, y: tmp.y};
};

DICOM.Pane.prototype.getImagePosition = function(scenePos) {
    return {
        x: scenePos.x + 0.5 * this.getImageWidth(),
        y: -scenePos.y + 0.5 * this.getImageHeight()
    };
};

DICOM.Pane.prototype.convertCameraPositionToDomPosition = function(cameraPos) {
    var nx = cameraPos.x / (this.camera.right - this.camera.left) + 0.5;
    var ny = cameraPos.y / (this.camera.bottom - this.camera.top) + 0.5;

    var domWidth = this.container.clientWidth;
    var domHeight = this.container.clientHeight;

    return {x: domWidth * nx, y: domHeight * ny};
};

DICOM.bindDcmSeriesToPane = function(dcmSeries, pane) {
    pane.dcmSeries = dcmSeries;
    pane.state.frameIndex = new DICOM.ObservableData(0);

    DICOM.observe(pane.state.frameIndex, function(e) {
        var index = e.newValue;
        dcmSeries.onLoadedImage(index, function(e) {
            pane.drawImage(e.image);
        });
    });
};
