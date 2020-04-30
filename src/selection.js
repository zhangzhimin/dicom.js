var DICOM = DICOM || {};

DICOM.Selection = function(e) {

};

DICOM.Selection.prototype.select = function(item) {
    this.unselect(this._selectedItem);

    this._selectedItem = item;

    var event = {type: 'selected'};
    item.dispatchEvent(event);
};

DICOM.Selection.prototype.unselect = function(item) {
    if (!item) return;

    if (this._selectedItem === item) {
        this._selectedItem = undefined;
    }

    var event = {type: 'unselected'};
    item.dispatchEvent(event);
};

// DICOM.Selection.prototype.defin

// DICOM.Selection.prototype.getSelected = function(){
//     return this._selectedItem;
// }
