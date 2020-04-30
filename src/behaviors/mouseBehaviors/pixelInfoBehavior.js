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

    this._mousemove = function(e) {
        var domPos = self.pane.getDomPosition(e);
        var cameraPos = self.pane.getCameraPosition(domPos);
        var scenePos = self.pane.getScenePosition(cameraPos);
        var imagePos = self.pane.getImagePosition(scenePos);

        pixelLi.innerHTML = 'Hu: ' + (self.pane.getImageValue(imagePos) || 'NaN');
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
