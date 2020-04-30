var DICOM = DICOM || {};

DICOM.AttachedObject = function() {

};

DICOM.AttachedObject.prototype.constructor = DICOM.AttachedObject;

DICOM.AttachedObject.prototype.attach = function(o) {
    this.associatedObject = o;
    if (this.onAttach != null) this.onAttach();
};

DICOM.AttachedObject.prototype.detach = function(o) {
    if (this.onDetach != null) this.onDetach();
    this.associatedObject = undefined;
};

DICOM.AttachedObject.prototype.apply = function(object) {
    object.attach = DICOM.AttachedObject.prototype.attach;
    object.detach = DICOM.AttachedObject.prototype.detach;
};
