DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.PixelBehavior = function(button) {
    this.button = button;
};

DICOM.MouseBehaviors.PixelBehavior.prototype = new DICOM.Behavior();

DICOM.MouseBehaviors.PixelBehavior.prototype.constructor = DICOM.MouseBehaviors.PixelBehavior;

DICOM.MouseBehaviors.PixelBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    var self = this;

    var cornerOverlay = this.cornerOverlay = this.pane.overlays.find(function(overlay) {
        return overlay instanceof DICOM.Overlays.CornerInfoOverlay;
    });

    var pixelLi = document.createElement('li');
    this.pixelLi = pixelLi;
    pixelLi.innerHTML = 'Hu: NaN';

    cornerOverlay.leftBottomCorner.appendChild(pixelLi);



    var pane = self.pane;
    this._mousemove = function(e) {
        var domPos = pane.getDomPosition(e);
        var cameraPos = pane.getCameraPosition(domPos);
        var scenePos = pane.getScenePosition(cameraPos);
        //获取在数据中的坐标
        var memPos = pane.getImageMemPos(scenePos);

        var value = null;
        if (memPos.x >= 0 && memPos.x < pane.image.column && memPos.y >= 0 &&
            memPos.y < pane.image.row) {
            var offset = pane.image.column * memPos.y + memPos.x;
            value = pane.image.pixelBufferFloat32[offset];
        }

        pixelLi.innerHTML = 'Hu: ' + (value || 'NaN');
        // pixelLi.innerHTML = 'dom ' + JSON.stringify(domPos) + ' camera ' +
        //     JSON.stringify(cameraPos) + ' scene ' + JSON.stringify(scenePos) + ' mem ' +
        //     JSON.stringify(memPos);
    };
    this.pane.container.addEventListener('mousemove', this._mousemove);

    this._mouseleave = function(e) {
        pixelLi.innerHTML = 'Hu: ' +
            'NaN';
    };
    this.pane.container.addEventListener('mouseleave', this._mouseleave);
};

DICOM.MouseBehaviors.PixelBehavior.prototype.onDetach = function() {
    this.cornerOverlay.leftBottomCorner.removeChild(this.pixelLi);
    this.pane.container.removeEventListener('mousemove', this._mousemove);
    this.pane.container.removeEventListener('mouseleave', this._mouseleave);

    DICOM.Behavior.prototype.onDetach.call(this);
};
