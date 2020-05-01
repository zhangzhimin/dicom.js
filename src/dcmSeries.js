DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.DcmSeries = function() {
    this.imageWrappers = [];
};

DICOM.EventDispatcher.prototype.apply(DICOM.DcmSeries.prototype);

DICOM.DcmSeries.prototype.appendDcmArrayBuffer = function(buffer) {
    try {
        var imageWrapper = {};
        dicomParser = new dwv.dicom.DicomParser();
        dicomParser.parse(buffer);

        // var dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
        // console.log('study id', dataSet.string('x0020000d'));


        var tags = dicomParser.getDicomElements();
        // imageWrapper.tags = tags;
        imageWrapper.windowLevel = Number(tags.WindowCenter.value[0]);
        imageWrapper.windowWidth = Number(tags.WindowWidth.value[0]);
        imageWrapper.patientName = Number(tags.PatientName.value[0]);
        imageWrapper.row = Number(tags.Rows.value[0]);
        imageWrapper.column = Number(tags.Columns.value[0]);
        imageWrapper.pixelSpacingX = Number(tags.PixelSpacing.value[0]);
        imageWrapper.pixelSpacingY = Number(tags.PixelSpacing.value[1]);
        imageWrapper.imageNumber = tags.ImageNumber.value[0];

        var imgFactory = new dwv.image.ImageFactory();
        var img = imgFactory.create(dicomParser.getDicomElements(), dicomParser.getPixelBuffer());
        var width = imageWrapper.column;
        var height = imageWrapper.row;
        var imgArray = new Float32Array(width * height);
        for (var i = 0; i < imgArray.length; ++i) {
            imgArray[i] = img.getValueAtOffset(i);
        }
        var frameTexture =
            new THREE.DataTexture(imgArray, width, height, THREE.LuminanceFormat, THREE.FloatType);
        frameTexture.needsUpdate = true;
        if (DICOM.WebGLContext.webgl.getExtension('OES_texture_float_linear')) {
            frameTexture.minFilter = THREE.LinearFilter;
            frameTexture.magFilter = THREE.LinearFilter;
        } else {
            frameTexture.minFilter = THREE.NearestFilter;
            frameTexture.magFilter = THREE.NearestFilter;
        }
        imageWrapper.texture = frameTexture;
        imageWrapper.pixelBufferFloat32 = imgArray;

        img = null;
        delete imgFactory;
        delete dicomParser;

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
        this.addEventListener('append', function(e) {
            if (e.index != index) {
                return;
            }

            var img = this.imageWrappers[index];
            if (img) {
                callback({image: img, index: index});
            }

            return;
        });
    }
};
