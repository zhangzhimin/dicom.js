DICOM.Commands = DICOM.Commands || {};

DICOM.Commands.FlipCommand = function(direction) {
    this.direction = direction;
};

DICOM.Commands.FlipCommand.prototype = new DICOM.Command();

DICOM.Commands.FlipCommand.prototype.constructor = DICOM.FlipCommand;

DICOM.Commands.FlipCommand.prototype.execute = function() {
    if (this.direction == 'x') {
        this.pane.scene.rotation.x += Math.PI;
    }
    if (this.direction == 'y') {
        this.pane.scene.rotation.y += Math.PI;
    }
};
