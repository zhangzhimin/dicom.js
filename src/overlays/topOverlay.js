DICOM.Overlays.TopOverlay = function(){
};

DICOM.Overlays.TopOverlay.prototype = new DICOM.Overlays.Overlay();

DICOM.Overlays.TopOverlay.prototype.constructor = DICOM.Overlays.TopOverlay;

DICOM.Overlays.TopOverlay.prototype.onAttach = function(){
    DICOM.Overlays.Overlay.prototype.onAttach.call(this);

    //避免与bootstrap下拉菜单冲突
    this.domElement.style.zIndex = '100';
};

DICOM.Overlays.TopOverlay.prototype.onDetach = function(){
    DICOM.Overlays.Overlay.prototype.onDetach.call(this);
}
