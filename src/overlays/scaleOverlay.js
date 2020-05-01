
DICOM.Overlays.ScaleOverlay = function() {};

DICOM.Overlays.ScaleOverlay.prototype = new DICOM.Overlays.Overlay();

DICOM.Overlays.ScaleOverlay.prototype.onAttach = function() {
    DICOM.Overlays.Overlay.prototype.onAttach.call(this);

    this.refreshScaleRuler();

    var self = this;
    this._refresh = function() {
        self.refreshScaleRuler();
    };
    this.pane.addEventListener('sizeChanged', this._refresh);
};

DICOM.Overlays.ScaleOverlay.prototype.refreshScaleRuler = function() {
    if (this.scaleRuler) {
        this.pane.scaleRulerScene.remove(this.scaleRuler);
        this.scaleRuler = undefined;
        this.domElement.removeChild(this.txtSpan);
    }

    var self = this;
    var pixelspacingX = this.pane.imageWrapper.pixelSpacingX;
    var pixelspacingY = this.pane.imageWrapper.pixelSpacingY;
    if (pixelspacingX != pixelspacingY) {
        //应该设置显示时的参数， 以支持不规则的图次昂
        console.log('Error: the pixelspacing is not same.');
    }

    var scale = this.pane.scene.scale.x;

    var tenMM = 10;

    var material = new THREE.LineBasicMaterial({color: 0xffff00});

    var scaleRect = this.getScaleRulerRect();

    var bottomPos = scaleRect.top + scaleRect.height
    var bottomPos2 = scaleRect.top;

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(tenMM, bottomPos, 0), new THREE.Vector3(-tenMM, bottomPos, 0));
    var scaleRuler = new THREE.Line(geometry, material);

    var tickGeometry = new THREE.Geometry();
    tickGeometry.vertices.push(
        new THREE.Vector3(0, bottomPos, 0), new THREE.Vector3(0, bottomPos2, 0));
    var tick = new THREE.Line(tickGeometry, material);
    scaleRuler.add(tick);
    var tickGeometry1 = new THREE.Geometry();
    tickGeometry1.vertices.push(
        new THREE.Vector3(tenMM, bottomPos, 0), new THREE.Vector3(tenMM, bottomPos2, 0));
    var tick1 = new THREE.Line(tickGeometry1, material);
    scaleRuler.add(tick1);
    var tickGeometry2 = new THREE.Geometry();
    tickGeometry2.vertices.push(
        new THREE.Vector3(-tenMM, bottomPos, 0), new THREE.Vector3(-tenMM, bottomPos2, 0))
        var tick2 = new THREE.Line(tickGeometry2, material);
    scaleRuler.add(tick2);

    this.scaleRuler = scaleRuler;
    this.scaleRuler.scale.x = scale;
    this.pane.scaleRulerScene.add(scaleRuler);

    // this.pane.addEventListener("zoom", function(e){
    //     self.scaleRuler.scale.x = self.pane.scene.scale.x;
    // });

    //使用THREEJS字体，则文件太多，所以选在使用div来渲染文本
    // var domPos = this.pane.convertCameraPositionToDomPosition({x: 0, y: 5});
    var txtPos = this.getScaleRulerTextPosition();
    var txtSpan = this.txtSpan = document.createElement('span');
    txtSpan.innerHTML = '1cm';
    txtSpan.style.color = 'white';
    txtSpan.style.position = 'absolute';
    txtSpan.style.top = txtPos.top + 'px';
    txtSpan.style.left = txtPos.left + 'px';
    txtSpan.style.color = 'yellow';
    this.domElement.appendChild(txtSpan);

    // this.pane.addEventListener('sizeChanged', function(){
    //     var domPos = self.pane.convertCameraPositionToDomPosition({x: 0, y: bottomPos});
    //     txtSpan.style.top = (domPos.y+2) + "px";
    //     txtSpan.style.left = domPos.x + 'px';
    // });
};

DICOM.Overlays.ScaleOverlay.prototype.getScaleRulerRect = function() {
    var clientWidth = this.pane.container.clientWidth;
    var clientHeight = this.pane.container.clientHeight;

    //距离底部10个像素
    var bottom = 20;
    var height = 7;
    var width = clientWidth * 0.5;
    var left = (clientWidth - width) * 0.5;
    var right = left;
    var top = clientHeight - bottom - height;

    var lt = this.pane.getCameraPosition({x: left, y: top});
    var rb = this.pane.getCameraPosition({x: left + width, y: top + height});

    return {left: lt.x, top: lt.y, width: rb.x - lt.x, height: rb.y - lt.y};
};

DICOM.Overlays.ScaleOverlay.prototype.getScaleRulerTextPosition = function() {
    var clientWidth = this.pane.container.clientWidth;
    var clientHeight = this.pane.container.clientHeight;

    var left = clientWidth * 0.5;
    var top = clientHeight - 17;

    return {left: left, top: top};
}
