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

    var pixelLi = this.pixelLi = document.createElement('li');
    pixelLi.innerHTML = 'Hu: NaN';

    cornerOverlay.leftBottomCorner.appendChild(pixelLi);

    var pane = self.pane;
    this._mousemove = function(e) {
        var domPos = pane.getDomPosition(e);
        var cameraPos = pane.getCameraPosition(domPos);
        var scenePos = pane.getScenePosition(cameraPos);

        // the position has bug
        var imagePos = pane.getImagePosition(scenePos);

        // console.log({dom: domPos, camera: cameraPos, scene: scenePos, image: imagePos});

        var nx = imagePos.x / pane.getImageWidth();
        var ny = imagePos.y / pane.getImageHeight();

        var value = null;
        if (nx >= 0 && nx < pane.getImageWidth() && ny >= 0 && ny < pane.getImageHeight()) {
            var x = Math.round(nx * pane.image.column);
            var y = Math.round(ny * pane.image.row);
            var offset = pane.image.column * y + x;
            value = pane.image.pixelBufferFloat32[offset];
        }

        pixelLi.innerHTML = 'Hu: ' + (value || 'NaN');
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
