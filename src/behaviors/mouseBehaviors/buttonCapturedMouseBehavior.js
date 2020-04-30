DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.ButtonCapturedMouseBehavior = function() {
    // this.button = button;
};

DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype =
    new DICOM.MouseBehaviors.CapturedMouseBehavior();

DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.constructor =
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior;

DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach = function() {
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
    this._captureMousedown = function(e) {
        if (e.button == self.button) self.capture();
    };
    this.addEventListener('capturedMousedown', this._captureMousedown);

    this._captureMouseup = function(e) {
        self.release();
    };
    this.addEventListener('capturedMouseup', this._captureMouseup);
};

DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach = function() {
    if (this.unCursor) {
        this.unCursor();
    }

    this.removeEventListener('capturedMousedown', this._captureMousedown);
    this.removeEventListener('capturedMouseup', this._captureMouseup);
};
