DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.PageBehavior = function(button) {
    this.button = button;
};

DICOM.MouseBehaviors.PageBehavior.prototype =
    new DICOM.MouseBehaviors.ButtonCapturedMouseBehavior();

DICOM.MouseBehaviors.PageBehavior.prototype.constructor = DICOM.MouseBehaviors.PageBehavior;

DICOM.MouseBehaviors.PageBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach.call(this);

    var self = this;

    this._captureMousemove = function(e) {
        var index;

        // self.pane.scene.position.y += e.cameraPositionDelta.y;
        if (e.domPositionDelta.y > 0.1)
            index = self.pane.state.frameIndex.value + 1;
        else if (e.domPositionDelta.y < -0.1) {
            index = self.pane.state.frameIndex.value - 1;
        } else {
            return;
        }

        index = index < 0 ? 0 : index;
        var max = self.pane.viewer.dcmSeries.imageWrappers.length - 1;
        index = index > max ? max : index;
        self.pane.state.frameIndex.value = index;
    };
    this.addEventListener('capturedMousemove', this._captureMousemove);
};

DICOM.MouseBehaviors.PageBehavior.prototype.onDetach = function() {
    this.removeEventListener('capturedMousemove', this._captureMousemove);

    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach.call(this);
};
