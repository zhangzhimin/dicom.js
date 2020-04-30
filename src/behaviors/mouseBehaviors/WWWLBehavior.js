DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.WWWLBehavior = function(button) {
    this.button = button;
};



DICOM.MouseBehaviors.WWWLBehavior.prototype =
    new DICOM.MouseBehaviors.ButtonCapturedMouseBehavior();

DICOM.MouseBehaviors.WWWLBehavior.prototype.constructor = DICOM.MouseBehaviors.WWWLBehavior;

DICOM.MouseBehaviors.WWWLBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach.call(this);

    var self = this;
    this._captureMousemove = function(e) {
        var speedRatio = 3;
        var wl = self.pane.state.windowLevel.value + e.domPositionDelta.y * speedRatio;
        var ww = self.pane.state.windowWidth.value + e.domPositionDelta.x * speedRatio;
        ww = ww >= 1 ? ww : 1;

        self.pane.viewer.panes.each(function(pane) {
            pane.state.windowWidth.value = ww;
            pane.state.windowLevel.value = wl;
        });

        // self.pane.state.windowLevel.value +=  e.domPositionDelta.y * 3;
        // self.pane.state.windowWidth.value +=  e.domPositionDelta.x * 3;
        // self.pane.state.windowWidth.value = self.pane.state.windowWidth.value >= 1 ?
        // self.pane.state.windowWidth.value : 1;
    };
    this.addEventListener('capturedMousemove', this._captureMousemove);
};

DICOM.MouseBehaviors.WWWLBehavior.prototype.onDetach = function() {
    this.removeEventListener('capturedMousemove', this._captureMousemove);

    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach.call(this);
};
