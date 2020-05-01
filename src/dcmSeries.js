DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.DcmSeries = function() {
    this.imageWrappers = [];
};

DICOM.EventDispatcher.prototype.apply(DICOM.DcmSeries.prototype);

DICOM.DcmSeries.prototype.appendDcmArrayBuffer = function(buffer) {
    try {
        var imageWrapper = {};
        var dataset = dicomParser.parseDicom(new Uint8Array(buffer));
        imageWrapper.studyUid = dataset.string('x0020000d');
        imageWrapper.seriesUid = dataset.string('x002000e');
        imageWrapper.imageNumber = dataset.string('x00200013');
        imageWrapper.patientName = dataset.string('x00100010');
        imageWrapper.windowLevel = Number(dataset.string('x00281050'));
        imageWrapper.windowWidth = Number(dataset.string('x00281051'));

        pixelSpacings = dataset.string('x00280030').split('\\');
        imageWrapper.pixelSpacingX = Number(pixelSpacings[0]);
        imageWrapper.pixelSpacingY = Number(pixelSpacings[1]);
        imageWrapper.row = dataset.uint16('x00280010');
        imageWrapper.column = dataset.uint16('x00280011');

        var pixelDataElement = dataset.elements.x7fe00010;
        var pixelData = new Int16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset);

        var width = imageWrapper.column;
        var height = imageWrapper.row;
        var pixelDataFloat32 = new Float32Array(width * height);
        for (var i = 0; i < pixelDataFloat32.length; ++i) {
            pixelDataFloat32[i] = pixelData[i];
        }

        delete dataset;

        var frameTexture = new THREE.DataTexture(
            pixelDataFloat32, width, height, THREE.LuminanceFormat, THREE.FloatType);
        frameTexture.needsUpdate = true;
        if (DICOM.WebGLContext.webgl.getExtension('OES_texture_float_linear')) {
            frameTexture.minFilter = THREE.LinearFilter;
            frameTexture.magFilter = THREE.LinearFilter;
        } else {
            frameTexture.minFilter = THREE.NearestFilter;
            frameTexture.magFilter = THREE.NearestFilter;
        }
        imageWrapper.texture = frameTexture;
        imageWrapper.pixelBufferFloat32 = pixelDataFloat32;

        var insertedIndex = this._insertImageWrapper(imageWrapper);
        this.dispatchEvent({type: 'append', message: imageWrapper, index: insertedIndex});
    } catch (ex) {
        console.error('faield to add dicom array buffer', ex);
    }
};

DICOM.DcmSeries.prototype._insertImageWrapper = function(imageWrapper) {
    var instanceNumber = imageWrapper.imageNumber;
    var i = 0;
    for (; i < this.imageWrappers.length; ++i) {
        if (instanceNumber < this.imageWrappers[i].imageNumber) {
            break;
        }
    }

    this.imageWrappers.splice(i, 0, imageWrapper);

    return i;
};

DICOM.DcmSeries.prototype.onLoadedImage = function(index, callback) {
    var imageWrapper = this.imageWrappers[index];
    if (imageWrapper) {
        callback({image: imageWrapper, index: index});
    } else {
        var self = this;
        var _append = function(e) {
            if (e.index != index) {
                return;
            }

            var img = this.imageWrappers[index];
            if (img) {
                callback({image: img, index: index});
            }

            self.removeEventListener('append', _append);
        };
        this.addEventListener('append', _append);
    }
};
