DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.InsertLineBehavior = function(button) {
    this.cursor = 'crosshair';

    this.button = button;
};

DICOM.MouseBehaviors.InsertLineBehavior.prototype =
    new DICOM.MouseBehaviors.ButtonCapturedMouseBehavior();

DICOM.MouseBehaviors.InsertLineBehavior.prototype.constructor =
    DICOM.MouseBehaviors.InsertLineBehavior;

DICOM.MouseBehaviors.InsertLineBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach.call(this);

    var shapeOverlay = this.pane.overlays.find(function(x) {
        return (x instanceof DICOM.Overlays.ShapeOverlay);
    });

    var self = this;

    this._capturedMousedown = function(e) {
        var pos = new THREE.Vector3(e.scenePosition.x, e.scenePosition.y, 0);
        self.line = new DICOM.Shapes.Line();

        self.line.endPoint = self.line.startPoint =
            new THREE.Vector3(e.scenePosition.x, e.scenePosition.y, 10);
        self.line.geometry.verticesNeedUpdate = true;
        shapeOverlay.shapes.add(self.line);

        e.originalEvent.preventDefault();

        // var cornerInfoOverlay = self.pane.overlays.find(function(overlay){ return overlay
        // instanceof DICOM.Overlays.CornerInfoOverlay;}); var lengthLi = self.lengthLi =
        // document.createElement('li'); lengthLi.style.color = 'red'; lengthLi.innerHTML = 'length:
        // '+ '0.00mm'; cornerInfoOverlay.rightBottomCorner.appendChild(lengthLi);
    };
    this.addEventListener('capturedMousedown', this._capturedMousedown);

    this._capturedMousemove = function(e) {
        self.line.endPoint = new THREE.Vector3(e.scenePosition.x, e.scenePosition.y, 10);
        // self.line.bugWalkaround();

        var startImgPos =
            new THREE.Vector2().copy(self.pane.getImagePosition(self.line.startPoint));
        var endImgPos = new THREE.Vector2().copy(self.pane.getImagePosition(self.line.endPoint));
        var length = endImgPos.sub(startImgPos).length();

        e.originalEvent.preventDefault();

        shapeOverlay.lengthDiv.innerHTML = 'length: ' + length.toFixed(2) + 'mm';

    };

    this.addEventListener('capturedMousemove', this._capturedMousemove);

    this._capturedMouseup =
        function(e) {
        self.line.bugWalkaround();

        e.originalEvent.preventDefault();
    }

        this.addEventListener('capturedMouseup', this._capturedMouseup);
};

DICOM.MouseBehaviors.InsertLineBehavior.prototype.onDetach = function() {
    this.removeEventListener('capturedMousedown', this._capturedMousedown);
    this.removeEventListener('capturedMousemove', this._capturedMousemove);
    this.removeEventListener('capturedMouseup', this._capturedMouseup);

    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach.call(this);
};
