DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.SelectShapeBehavior = function() {
    this.button = 'left';
    // this.cursor
};

DICOM.MouseBehaviors.SelectShapeBehavior.prototype =
    new DICOM.MouseBehaviors.CapturedMouseBehavior();

DICOM.MouseBehaviors.SelectShapeBehavior.prototype.constructor =
    DICOM.MouseBehaviors.SelectShapeBehavior;

DICOM.MouseBehaviors.SelectShapeBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.onAttach.call(this);

    this.button = this.button || 'left';

    var topOverlay = this.pane.overlays.find(function(overlay) {
        return overlay instanceof DICOM.Overlays.TopOverlay;
    });

    if (this.cursor) {
        var preCursor = topOverlay.domElement.style.cursor;
        topOverlay.domElement.style.cursor = this.cursor;
        this.unCursor = function() {
            topOverlay.domElement.style.cursor = this.preCursor || 'auto';
        }
    }

    var self = this;
    var handler;
    var shapeOverlay = self.pane.overlays.find(function(overlay) {
        return overlay instanceof DICOM.Overlays.ShapeOverlay;
    });
    this._captureMousedown = function(e) {
        if (e.button == self.button) {
            var mouse = {};
            mouse.x = e.domPosition.x / self.pane.container.clientWidth * 2 - 1;
            mouse.y = -e.domPosition.y / self.pane.container.clientHeight * 2 + 1;

            for (var i = 0; i < shapeOverlay.shapes.length; ++i) {
                handler = shapeOverlay.shapes.index(i).hitTest(mouse);

                if (handler) {
                    self.capture();
                    break;
                }
            }
        }
        // self.capture();
    };
    this.addEventListener('capturedMousedown', this._captureMousedown);

    this._captureMousemove = function(e) {
        if (handler.offset) handler.offset(e.scenePositionDelta);
        if (handler.moveTo) handler.moveTo(e.scenePosition);
    };
    this.addEventListener('capturedMousemove', this._captureMousemove);

    this._captureMouseup = function(e) {

        handler = undefined;

        self.release();
    };
    this.addEventListener('capturedMouseup', this._captureMouseup);
};

DICOM.MouseBehaviors.SelectShapeBehavior.prototype.onDetach = function() {
    if (this.unCursor) {
        this.unCursor();
    }

    this.removeEventListener('capturedMousedown', this._captureMousedown);
    this.removeEventListener('capturedMouseup', this._captureMouseup);
};
