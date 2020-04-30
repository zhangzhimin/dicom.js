

DICOM.CompositeBehavior = function() {
    this.behaviors = [];
};

DICOM.CompositeBehavior.prototype = new DICOM.Behavior();

DICOM.CompositeBehavior.prototype.constructor = DICOM.CompositeBehavior;

DICOM.CompositeBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    for (var i = 0; i < this.behaviors.length; ++i) {
        this.behaviors[i].attach(this.pane);
    }
};

DICOM.CompositeBehavior.prototype.onDetach = function() {
    for (var i = 0; i < this.behaviors.length; ++i) {
        this.behaviors[i].detach();
    }

    DICOM.Behavior.prototype.onDetach.call(this);
};
