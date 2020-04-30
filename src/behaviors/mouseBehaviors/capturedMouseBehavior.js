DICOM.EventDispatcher = DICOM.EventDispatcher || THREE.EventDispatcher;

DICOM.MouseBehaviors = DICOM.MouseBehaviors || {};

DICOM.MouseBehaviors.CapturedMouseBehavior = function() {};

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype = new DICOM.Behavior();

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.constructor =
    DICOM.MouseBehaviors.CapturedMouseBehavior;

DICOM.EventDispatcher.prototype.apply(DICOM.MouseBehaviors.CapturedMouseBehavior.prototype);

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.onAttach = function() {
    DICOM.Behavior.prototype.onAttach.call(this);

    var capture = false;
    var self = this;
    var which;
    var preDomPos;
    var preCameraPos;
    var preScenePos;
    var button;

    this._mousemove = function(e) {
        if (which == 0) return;

        var domPos = mousePositionElement(e, self.pane.container);
        var cameraPos = self.pane.getCameraPosition(domPos);
        var scenePos = self.pane.getScenePosition(cameraPos);
        var customEvent = {
            type: 'capturedMousemove',
            button: button,
            domPosition: domPos,
            domPositionDelta: deltaPosition(domPos, preDomPos),
            cameraPosition: cameraPos,
            cameraPositionDelta: deltaPosition(cameraPos, preCameraPos),
            scenePosition: scenePos,
            scenePositionDelta: deltaPosition(scenePos, preScenePos),
            originalEvent: e
        };
        self.dispatchEvent(customEvent);

        preDomPos = domPos;
        preCameraPos = cameraPos;
        preScenePos = scenePos;
    };

    this._mousedown = function(e) {
        var domPos = preDomPos = self.pane.getDomPosition(e);
        var cameraPos = preCameraPos = self.pane.getCameraPosition(domPos);
        var scenePos = preScenePos = self.pane.getScenePosition(cameraPos);

        which = e.which;
        switch (which) {
            case 1:
                button = 'left';
                break;
            case 2:
                button = 'middle';
                break;
            case 3:
                button = 'right';
                break;
            default:
                throw 'unexpected'
        };

        var customEvent = {
            type: 'capturedMousedown',
            button: button,
            domPosition: domPos,
            cameraPosition: cameraPos,
            scenePosition: scenePos,
            originalEvent: e
        };
        self.dispatchEvent(customEvent);

        e.preventDefault();
    };

    this.pane.container.addEventListener('mousedown', this._mousedown);

    this._mouseup = function(e) {
        if (e.which != which) return;

        which = 0;

        var domPos = mousePositionElement(e, self.pane.container);
        var cameraPos = self.pane.getCameraPosition(preDomPos);
        var scenePos = self.pane.getScenePosition(cameraPos);
        var customEvent = {
            type: 'capturedMouseup',
            button: undefined,
            domPosition: domPos,
            cameraPosition: cameraPos,
            scenePosition: scenePos,
            originalEvent: e
        };
        self.dispatchEvent(customEvent);
    }
};

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.onDetach = function() {
    this.pane.container.removeEventListener('mousedown', this._mousedown);
    this.pane.container.removeEventListener('mouseup', this._mouseup);

    DICOM.Behavior.prototype.onDetach.call(this);
};

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.capture = function() {
    document.addEventListener('mousemove', this._mousemove);
    document.addEventListener('mouseup', this._mouseup);
};

DICOM.MouseBehaviors.CapturedMouseBehavior.prototype.release = function() {
    document.removeEventListener('mousemove', this._mousemove);
    document.removeEventListener('mouseup', this._mouseup);
};
