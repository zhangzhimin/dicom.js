DICOM.TouchBehaviors = DICOM.TouchBehaviors || {};

DICOM.TouchBehaviors.PanBehavior = function() {

};

DICOM.TouchBehaviors.PanBehavior.prototype = new DICOM.Behavior();

DICOM.TouchBehaviors.PanBehavior.prototype.constructor = DICOM.TouchBehaviors.PanBehavior;

DICOM.TouchBehaviors.PanBehavior.prototype.onAttach = function() {
    var self = this;
    var preX, preY;
    this._touchstart = function(e) {
        if (e.touches.length != 1) return;

        preX = e.touches[0].clientX;
        preY = e.touches[0].clientY;

        e.preventDefault();
    };
    this.viewer.container.addEventListener('touchstart', this._touchstart);

    this._touchmove = function(e) {
        if (e.touches.length != 1 || preX == undefined || preY == undefined) return;

        self.viewer.imageMesh.position.x += (e.touches[0].clientX - preX);
        self.viewer.imageMesh.position.y -= (e.touches[0].clientY - preY);

        preX = e.touches[0].clientX;
        preY = e.touches[0].clientY;

        e.preventDefault();
    };
    this.viewer.container.addEventListener('touchmove', this._touchmove);

    this._touchend = function(e) {
        preX = undefined;
        preY = undefined;
    };
    this.viewer.container.addEventListener('touchend', this._touchend);
};

DICOM.TouchBehaviors.PanBehavior.prototype.onDetach = function() {
    this.viewer.container.removeEventListener('touchstart', this._touchstart);
    this.viewer.container.removeEventListener('touchmove', this._touchmove);
    this.viewer.container.removeEventListener('touchend', this._touchend);
};
