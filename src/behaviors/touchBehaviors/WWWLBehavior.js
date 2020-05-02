DICOM.TouchBehaviors = DICOM.TouchBehaviors || {};

DICOM.TouchBehaviors.WWWLBehavior = function(global) {
    this.global = global;
};

DICOM.TouchBehaviors.WWWLBehavior.prototype = new DICOM.Behavior();

DICOM.TouchBehaviors.WWWLBehavior.prototype.constructor = DICOM.TouchBehaviors.WWWLBehavior;

DICOM.TouchBehaviors.WWWLBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    var self = this;

    var preX, preY;
    this._touchstart = function(e) {
        if (e.touches.length != 1) return;

        preX = e.touches[0].clientX;
        preY = e.touches[0].clientY;

        e.preventDefault();
    };
    this.pane.container.addEventListener('touchstart', this._touchstart);

    this._touchmove = function(e) {
        if (e.touches.length != 1 || preX == undefined || preY == undefined) return;

        var tmpX = e.touches[0].clientX;
        var tmpY = e.touches[0].clientY;

        var speedRatio = 3;
        var wl = self.pane.state.windowLevel.value + (tmpY - preY) * speedRatio;
        var ww = self.pane.state.windowWidth.value + (tmpX - preX) * speedRatio;
        ww = ww >= 1 ? ww : 1;

        if (self.global) {
            self.pane.viewer.panes.each(function(pane) {
                pane.state.windowWidth.value = ww;
                pane.state.windowLevel.value = wl;
            });
        } else {
            self.pane.state.windowWidth.value = ww;
            self.pane.state.windowLevel.value = wl;
        }


        preX = tmpX;
        preY = tmpY;

        e.preventDefault();
    };
    this.pane.container.addEventListener('touchmove', this._touchmove);

    this._touchend = function(e) {
        preX = undefined;
        preY = undefined;
    };
    this.pane.container.addEventListener('touchend', this._touchend);

};

DICOM.TouchBehaviors.WWWLBehavior.prototype.onDetach = function() {
    this.pane.container.removeEventListener('touchstart', this._touchstart);
    this.pane.container.removeEventListener('touchmove', this._touchmove);
    this.pane.container.removeEventListener('touchend', this._touchend);
};
