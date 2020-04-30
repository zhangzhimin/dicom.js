DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.DcmSeries = function() {
    this.imageWrappers = [];
};

DICOM.EventDispatcher.prototype.apply(DICOM.DcmSeries.prototype);

DICOM.DcmSeries.prototype.appendDcmArrayBuffer = function(buffer) {
    var imageWrapper = {};
    imageWrapper.dicomParser = new dwv.dicom.DicomParser();
    imageWrapper.dicomParser.parse(buffer);

    var tags = imageWrapper.dicomParser.getDicomElements();
    imageWrapper.tags = tags;
    imageWrapper.windowLevel = Number(tags.WindowCenter.value[0]);
    imageWrapper.windowWidth = Number(tags.WindowWidth.value[0]);
    imageWrapper.patientName = Number(tags.PatientName.value[0]);
    imageWrapper.row = Number(tags.Rows.value[0]);
    imageWrapper.column = Number(tags.Columns.value[0]);

    var insertedIndex = this._insertImageWrapper(imageWrapper);

    this.dispatchEvent({type: 'append', message: imageWrapper, index: insertedIndex});
};

DICOM.DcmSeries.prototype._insertImageWrapper = function(imageWrapper) {
    var instanceNumber = imageWrapper.tags.ImageNumber.value[0];
    var i = 0;
    for (; i < this.imageWrappers.length; ++i) {
        if (instanceNumber < this.imageWrappers[i].tags.ImageNumber.value[0]) {
            break;
        }
    }

    this.imageWrappers.splice(i, 0, imageWrapper);

    return i;
};

DICOM.DcmSeries.prototype.onLoadedImage = function(index, callback) {
    var image = this.imageWrappers[index];
    if (image) {
        callback({image: image, index: index});
    } else {
        this.addEventListener('append', function(e) {
            if (e.index != index) {
                return;
            }

            var image = this.imageWrappers[index];
            if (image) {
                callback({image: image, index: index});
            }

            return;
        });
    }
};
