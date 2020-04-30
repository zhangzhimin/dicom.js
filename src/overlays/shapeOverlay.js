DICOM.Overlays.ShapeOverlay = function() {};

DICOM.Overlays.ShapeOverlay.prototype = new DICOM.Overlays.Overlay();

DICOM.Overlays.ShapeOverlay.prototype.constructor = DICOM.Overlays.ShapeOverlay;

DICOM.Overlays.ShapeOverlay.prototype.onAttach = function() {
    DICOM.Overlays.Overlay.prototype.onAttach.call(this);

    this.shapes = new DICOM.AttachedObjectCollection(this);

    // this.leftSide = document.createElement("ul");
    // this.leftSide.style.top = '50%';
    // this.leftSide.style.right = 0;
    // this.leftSide.style.padding = "0.5em";
    // this.leftSide.style.margin = 0;
    // this.leftSide.style.listStyle = "none";
    // this.leftSide.style.position ="absolute";
    // this.domElement.appendChild(this.leftSide);
    this.lengthDiv = document.createElement('div');
    this.lengthDiv.style.top = '50%';
    this.lengthDiv.style.right = 0;
    this.lengthDiv.style.color = 'red';
    this.lengthDiv.style.padding = '0.5em';
    this.lengthDiv.style.position = 'absolute';
    this.domElement.appendChild(this.lengthDiv);

};

DICOM.Overlays.ShapeOverlay.prototype.onDetach = function() {
    this.domElement.removeChild(this.lengthDiv);

    DICOM.Overlays.Overlay.prototype.onDetach.call(this);
}
