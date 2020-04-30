DICOM.CommandHelper = {};

DICOM.CommandHelper.create = function(cmd) {
    if (cmd.type == 'flip') {
        return new DICOM.Commands.FlipCommand(cmd.arguments);
    }
    if (cmd.type == 'rotate') {
        return new DICOM.Commands.RotateCommand(cmd.arguments);
    }
};
