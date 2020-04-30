DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.WheelPageBehavior = function(button) {
    this.button = button;
};

DICOM.MouseBehaviors.WheelPageBehavior.prototype = new DICOM.Behavior();

DICOM.MouseBehaviors.WheelPageBehavior.prototype.constructor =
    DICOM.MouseBehaviors.WheelPageBehavior;

DICOM.MouseBehaviors.WheelPageBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    var self = this;

    this._mousewheel = function(e) {
        // cross-browser wheel delta
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        var index;
        // self.pane.scene.position.y += e.cameraPositionDelta.y;
        if (delta < -0.1)
            index = self.pane.state.frameIndex.value + 1;
        else if (delta > 0.1) {
            index = self.pane.state.frameIndex.value - 1;
        } else {
            return;
        }

        index = index < 0 ? 0 : index;
        var max = self.pane.viewer.dcmSeries.imageWrappers.length - 1;
        index = index > max ? max : index;
        self.pane.state.frameIndex.value = index;
    };
    this.pane.container.addEventListener('mousewheel', this._mousewheel);
    this.pane.container.addEventListener('DOMMouseScroll', this._mousewheel);
};

DICOM.MouseBehaviors.WheelPageBehavior.prototype.onDetach = function() {
    this.pane.container.removeEventListener('mousewheel', this._mousewheel);
    this.pane.container.removeEventListener('DOMMouseScroll', this._mousewheel);

    DICOM.Behavior.prototype.onDetach.call(this);
};
