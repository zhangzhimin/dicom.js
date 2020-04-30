var DICOM = DICOM || {};

DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.ObservableData = function(v) {
    this.value = v;
};

DICOM.ObservableData.prototype = {
    constructor: DICOM.ObservaleData,

    get value() {
        return this._value;
    },

    set value(v) {
        if (this._value === v) {
            return;
        }

        var cumstomEvent = {type: 'change', newValue: v, oldValue: this._value};
        this._value = v;

        this.dispatchEvent(cumstomEvent);
    },
};

DICOM.EventDispatcher.prototype.apply(DICOM.ObservableData.prototype);

DICOM.observe = function(subject, callback) {
    subject.addEventListener('change', callback);
    var customEvent = {type: 'change', newValue: subject._value};
    subject.dispatchEvent(customEvent);
};

DICOM.bind = function(subject, callback) {

};
