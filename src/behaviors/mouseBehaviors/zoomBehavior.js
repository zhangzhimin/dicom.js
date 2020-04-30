DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.ZoomBehavior = function(button) {
    this.button = button;

    this.cursor = 'zoom-in';
};

DICOM.MouseBehaviors.ZoomBehavior.prototype =
    new DICOM.MouseBehaviors.ButtonCapturedMouseBehavior();

DICOM.MouseBehaviors.ZoomBehavior.prototype.constructor = DICOM.MouseBehaviors.ZoomBehavior;

DICOM.MouseBehaviors.ZoomBehavior.prototype.onAttach = function() {
    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onAttach.call(this);

    var self = this;

    this._capturedMousemove = function(e) {

        if (Math.abs(e.domPositionDelta.y) < 0.1) {
            return;
        }

        self.pane.scene.scale.x *= (1 + e.domPositionDelta.y * 0.01);
        self.pane.scene.scale.y *= (1 + e.domPositionDelta.y * 0.01);

        self.pane.dispatchEvent({type: 'zoom'});
    };

    this.addEventListener('capturedMousemove', this._capturedMousemove);
};

DICOM.MouseBehaviors.ZoomBehavior.prototype.onDetach = function() {
    this.removeEventListener('capturedMousemove', this._capturedMousemove);

    DICOM.MouseBehaviors.ButtonCapturedMouseBehavior.prototype.onDetach.call(this);
};
