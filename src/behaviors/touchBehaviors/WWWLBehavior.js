DICOM.TouchBehaviors = DICOM.TouchBehaviors || {};

DICOM.TouchBehaviors.WWWLBehavior = function() {

};

DICOM.TouchBehaviors.WWWLBehavior.prototype = new DICOM.Behavior();

DICOM.TouchBehaviors.WWWLBehavior.prototype.constructor = DICOM.TouchBehaviors.WWWLBehavior;

DICOM.TouchBehaviors.WWWLBehavior.prototype.onAttach = function() {

    var self = this;

    var preX, preY;
    this._touchstart = function(e) {
        if (e.touches.length != 1) return;

        preX = e.touches[0].clientX;
        preY = e.touches[0].clientY;

        e.preventDefault();
    };
    this.pane.overlay.addEventListener('touchstart', this._touchstart);

    this._touchmove = function(e) {
        if (e.touches.length != 1 || preX == undefined || preY == undefined) return;

        var tmpX = e.touches[0].clientX;
        var tmpY = e.touches[0].clientY;

        self.viewer.windowLevel += (tmpY - preY);
        self.viewer.windowWidth += (tmpX - preX);
        self.viewer.windowWidth = self.viewer.windowWidth >= 1 ? self.viewer.windowWidth : 1;

        self.viewer.uniforms.windowWidth.value = self.viewer.windowWidth;
        self.viewer.uniforms.windowLevel.value = self.viewer.windowLevel;
        self.viewer.uniforms.windowWidth.needsUpdate = true;
        self.viewer.uniforms.windowLevel.needsUpdate = true;

        var event = new CustomEvent(
            'wwwl',
            {detail: {windowLevel: self.viewer.windowLevel, windowWidth: self.viewer.windowWidth}});
        self.viewer.container.dispatchEvent(event);

        preX = tmpX;
        preY = tmpY;

        e.preventDefault();
    };
    this.pane.overlay.addEventListener('touchmove', this._touchmove);

    this._touchend = function(e) {
        preX = undefined;
        preY = undefined;
    };
    this.pane.overlay.addEventListener('touchend', this._touchend);

};

DICOM.TouchBehaviors.WWWLBehavior.prototype.onDetach = function() {
    this.pane.overlay.removeEventListener('touchstart', this._touchstart);
    this.pane.overlay.removeEventListener('touchmove', this._touchmove);
    this.pane.overlay.removeEventListener('touchend', this._touchend);
};
