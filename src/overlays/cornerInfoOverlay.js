var DICOM = DICOM || {};

DICOM.Overlays.CornerInfoOverlay = function() {};

DICOM.Overlays.CornerInfoOverlay.prototype = new DICOM.Overlays.Overlay();

DICOM.Overlays.CornerInfoOverlay.prototype.constructor = DICOM.Overlays.CornerInfoOverlay;

DICOM.Overlays.CornerInfoOverlay.prototype.onAttach = function() {
    DICOM.Overlays.Overlay.prototype.onAttach.call(this);

    this.domElement.style.color = 'white';
    this.domElement.style.fontSize = '10px';

    this.leftTopCorner = document.createElement('ul');
    this.leftTopCorner.style.top = 0;
    this.leftTopCorner.style.left = 0;
    this.leftTopCorner.style.padding = '0.5em';
    this.leftTopCorner.style.margin = 0;
    this.leftTopCorner.style.listStyle = 'none';
    this.leftTopCorner.style.position = 'absolute';
    this.domElement.appendChild(this.leftTopCorner);

    this.rightTopCorner = document.createElement('ul');
    this.rightTopCorner.style.top = 0;
    this.rightTopCorner.style.right = 0;
    this.rightTopCorner.style.padding = '0.5em';
    this.rightTopCorner.style.margin = 0;
    this.rightTopCorner.style.listStyle = 'none';
    this.rightTopCorner.style.position = 'absolute';
    this.domElement.appendChild(this.rightTopCorner);

    this.leftBottomCorner = document.createElement('ul');
    this.leftBottomCorner.style.bottom = 0;
    this.leftBottomCorner.style.left = 0;
    this.leftBottomCorner.style.padding = '0.5em';
    this.leftBottomCorner.style.margin = 0;
    this.leftBottomCorner.style.listStyle = 'none';
    this.leftBottomCorner.style.position = 'absolute';
    this.domElement.appendChild(this.leftBottomCorner);

    this.rightBottomCorner = document.createElement('ul');
    this.rightBottomCorner.style.bottom = 0;
    this.rightBottomCorner.style.right = 0;
    this.rightBottomCorner.style.padding = '0.5em';
    this.rightBottomCorner.style.margin = 0;
    this.rightBottomCorner.style.listStyle = 'none';
    this.rightBottomCorner.style.position = 'absolute';
    this.domElement.appendChild(this.rightBottomCorner);

    var patientLi = document.createElement('li');
    patientLi.innerHTML = this.pane.image.patientName;
    this.leftTopCorner.appendChild(patientLi);

    var imageNumberLi = document.createElement('li');
    this.leftTopCorner.appendChild(imageNumberLi);
    DICOM.observe(this.pane.state.frameIndex, function(e) {
        imageNumberLi.innerHTML = 'Id: ' + e.newValue;
    });

    var windowLevelLi = document.createElement('li');
    this.rightTopCorner.appendChild(windowLevelLi);
    DICOM.observe(this.pane.state.windowLevel, function(e) {
        windowLevelLi.innerHTML = 'WL: ' + e.newValue;
    });

    var windowWidthLi = document.createElement('li');
    this.rightTopCorner.appendChild(windowWidthLi);
    DICOM.observe(this.pane.state.windowWidth, function(e) {
        windowWidthLi.innerHTML = 'WW: ' + e.newValue;
    });
};

DICOM.Overlays.CornerInfoOverlay.prototype.onDetach = function() {
    DICOM.Overlays.Overlay.prototype.onDetach.call(this);
}
