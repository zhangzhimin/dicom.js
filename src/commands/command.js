var DICOM = DICOM || {};

DICOM.Command = function() {};

DICOM.AttachedObject.prototype.apply(DICOM.Command.prototype);

DICOM.Command.prototype.onAttach = function() {
    this.target = this.associatedObject;

    // if (this.execute){
    //     this.execute();
    // }
};

// DICOM.Command.prototype.onDetach = function(){
//     this.target = undefined;
//
//     if (this.unexecute){
//         this.unexecute();
//     }
// }
