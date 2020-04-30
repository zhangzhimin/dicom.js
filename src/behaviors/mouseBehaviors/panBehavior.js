DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.PanBehavior = function(button) {
    this.button = button;
    this.cursor = 'move';
};

DICOM.MouseBehaviors.PanBehavior.prototype = new DICOM.MouseBehaviors.ButtonCapturedMouseBehavior();

DICOM.MouseBehaviors.PanBehavior.prototype.constructor = DICOM.MouseBehaviors.PanBehavior;

DICOM.MouseBehaviors.PanBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach.call(this);

    var self = this;

    this._captureMousemove = function(e) {
        self.pane.scene.position.y += e.cameraPositionDelta.y;
        self.pane.scene.position.x += e.cameraPositionDelta.x;
    };
    this.addEventListener('capturedMousemove', this._captureMousemove);
};

DICOM.MouseBehaviors.PanBehavior.prototype.onDetach = function() {
    this.removeEventListener('capturedMousemove', this._captureMousemove);

    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach.call(this);
};
