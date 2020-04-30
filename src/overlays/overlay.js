var DICOM = DICOM || {}

DICOM.Overlays = DICOM.Overlays || {};
//Overlay是覆盖在Viewer上的一层2D元素，其实就是一个和Viewer等大的div元素（也就是构造函数中的domElement）。
//我们可以在onAttch里往该div注入逻辑， 在onDetach中移除
DICOM.Overlays.Overlay = function(){

};

DICOM.Overlays.Overlay.prototype = new DICOM.AttachedObject();

//绑定Viewer, 该函数会在addOverlay中被调用
DICOM.Overlays.Overlay.prototype.onAttach= function(pane){
    this.domElement = document.createElement("div");
    this.domElement.style.position = "absolute";
    this.domElement.style.left = "0";
    this.domElement.style.top = "0";
    this.domElement.style.right = "0";
    this.domElement.style.bottom = "0";

    this.pane = this.associatedObject;
    this.pane.container.appendChild(this.domElement);
};

//解绑Viewer, 该函数会在removeOverlay中被调用
DICOM.Overlays.Overlay.prototype.onDetach = function(pane){
    this.pane = undefined;
}
