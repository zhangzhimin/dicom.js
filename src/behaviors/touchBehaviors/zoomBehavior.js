DICOM.TouchBehaviors = DICOM.TouchBehaviors || {};

DICOM.TouchBehaviors.ZoomBehavior = function() {

};

DICOM.TouchBehaviors.ZoomBehavior.prototype = new DICOM.Behavior();

DICOM.TouchBehaviors.ZoomBehavior.prototype.constructor = DICOM.TouchBehaviors.ZoomBehavior;

DICOM.TouchBehaviors.ZoomBehavior.prototype.onAttach = function() {

    var self = this;

    var preDistance;
    this._touchstart = function(e) {
        if (e.touches.length != 2) return;

        preDistance = Math.sqrt(
            Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
            Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2));

        e.preventDefault();
    };
    this.viewer.container.addEventListener('touchstart', this._touchstart);

    this._touchmove = function(e) {
        if (e.touches.length != 2) return;

        var currentDistance = Math.sqrt(
            Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
            Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2));

        var scala = currentDistance / preDistance;
        self.viewer.imageMesh.scale.x *= scala;
        self.viewer.imageMesh.scale.y *= scala;

        var scaleX = self.viewer.imageMesh.scale.x;
        var scaleY = self.viewer.imageMesh.scale.y;
        var ce = new CustomEvent('scale', {detail: {scale: scaleX}});
        self.viewer.container.dispatchEvent(ce);

        preDistance = currentDistance;
        e.preventDefault();
    };
    this.viewer.container.addEventListener('touchmove', this._touchmove);

    this._touchend = function(e) {
        preDistance = undefined;
    };
    this.viewer.container.addEventListener('touchend', this._touchend);
};

DICOM.TouchBehaviors.ZoomBehavior.prototype.onDetach = function() {
    this.viewer.container.removeEventListener('touchstart', this._touchstart);
    this.viewer.container.removeEventListener('touchmove', this._touchmove);
};
