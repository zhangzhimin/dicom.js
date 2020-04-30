DICOM.ViewerFactory =
    function() {

}

    DICOM.ViewerFactory.prototype.createViewer = function(container) {
  var viewer = new DICOM.Viewer(container);
  // viewer.split(2,2);
  return viewer;
}
