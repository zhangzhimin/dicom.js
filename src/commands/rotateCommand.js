DICOM.Commands = DICOM.Commands || {};

DICOM.Commands.RotateCommand = function(rad) {
    this.rad = rad;
};

DICOM.Commands.RotateCommand.prototype = new DICOM.Command();

DICOM.Commands.RotateCommand.prototype.constructor = DICOM.RotateCommand;

DICOM.Commands.RotateCommand.prototype.execute = function() {
    var rotation = this.pane.scene.rotation;
    if (Math.cos(rotation.x) * Math.cos(rotation.y) > 0) {
        rotation.z += this.rad;
    } else {
        rotation.z -= this.rad;
    }
}
