DICOM.Commands = DICOM.Commands || {};

DICOM.Commands.FlipCommand = function(direction) {
    this.direction = direction;
};

DICOM.Commands.FlipCommand.prototype = new DICOM.Command();

DICOM.Commands.FlipCommand.prototype.constructor = DICOM.FlipCommand;

DICOM.Commands.FlipCommand.prototype.execute = function() {
    var viewer = this.target;
    self = this;
    viewer.panes.each(function(pane) {
        if (self.direction == 'x') {
            pane.scene.rotation.x += Math.PI;
        }
        if (self.direction == 'y') {
            pane.scene.rotation.y += Math.PI;
        }
    })
};
