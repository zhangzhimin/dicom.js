var DICOM = DICOM || {};


DICOM.AttachedObjectCollection = function(associatedObject) {
    this.associatedObject = associatedObject;
    this._associatedOjbects = [];
};

DICOM.AttachedObjectCollection.prototype = {
    Constructor: DICOM.AttachedObjectCollection,

    clear: function() {
        for (var i = 0; i < this._associatedOjbects.length; ++i) {
            this._associatedOjbects[i].detach();
        }

        this._associatedOjbects = [];
    },

    add: function(attachedObject) {
        this._associatedOjbects.push(attachedObject);
        attachedObject.attach(this.associatedObject);

        var custom = {type: 'add', item: attachedObject};
        this.dispatchEvent(custom);
    },

    remove: function(attachedObject) {
        var index = this._associatedOjbects.valueOf(attachedObject);
        this._associatedOjbects.splice(index, 1);

        attachedObject.detach();
    },

    index: function(i) {
        return this._associatedOjbects[i];
    },

    get length() {
        return this._associatedOjbects.length;
    },

    each: function(callback) {
        for (var i = 0; i < this._associatedOjbects.length; ++i) {
            callback(this._associatedOjbects[i]);
        }
    },

    find: function(pre) {
        for (var i = 0; i < this._associatedOjbects.length; ++i) {
            if (pre(this._associatedOjbects[i])) {
                return this._associatedOjbects[i];
            }
        }

        return undefined;
    }
};

DICOM.EventDispatcher.prototype.apply(DICOM.AttachedObjectCollection.prototype);
