DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.SelectBehavior = function(selection) {
    this.selection = selection;
};

DICOM.MouseBehaviors.SelectBehavior.prototype = new DICOM.Behavior();

DICOM.MouseBehaviors.SelectBehavior.prototype.constructor = DICOM.MouseBehaviors.SelectBehavior;

DICOM.MouseBehaviors.SelectBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    var self = this;
    this.pane.addEventListener('selected', function() {
        self.pane.borderDiv.style.border = '1px solid red';
    });

    this.pane.addEventListener('unselected', function() {
        self.pane.borderDiv.style.border = '1px solid yellow';
    });

    this._mousedown = function(e) {
        self.selection.select(self.pane);
    };
    this.pane.container.addEventListener('mousedown', this._mousedown);
};

DICOM.MouseBehaviors.SelectBehavior.prototype.onDetach = function() {
    this.pane.container.removeEventListener('mousedown', this._mousedown);

    DICOM.Behavior.prototype.onAttach.call(this);
};
