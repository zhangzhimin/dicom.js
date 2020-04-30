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
        // self.pane.border.material.color = new THREE.Color(1.0,0.0,0.0);
        self.pane.borderDiv.style.border = '1px solid red';
        // self.pane.container.style.zIndex = "1000";
    });

    this.pane.addEventListener('unselected', function() {
        // self.pane.border.material.color = new THREE.Color(1,1,1);
        self.pane.borderDiv.style.border = '1px solid yellow';
        // self.pane.container.style.zIndex = "1";

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
