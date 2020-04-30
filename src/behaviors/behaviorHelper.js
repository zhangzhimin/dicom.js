

DICOM.BehaviorHelper = {};

DICOM.BehaviorHelper.create = function(name) {
    if (name == 'default') {
        var defaultBehavior = new DICOM.CompositeBehavior();
        defaultBehavior.behaviors.push(new DICOM.MouseBehaviors.PageBehavior('left'));
        defaultBehavior.behaviors.push(new DICOM.MouseBehaviors.WWWLBehavior('right'));

        return defaultBehavior;
    }
    if (name == 'pan') {
        return new DICOM.MouseBehaviors.PanBehavior('left');
    }
    if (name == 'zoom') {
        return new DICOM.MouseBehaviors.ZoomBehavior('left');
    }
    if (name == 'WWWL') {
        return new DICOM.MouseBehaviors.WWWLBehavior('left');
    }
    if (name == 'page') {
        return new DICOM.MouseBehaviors.PageBehavior('left');
    }
    if (name == 'pixel') {
        return new DICOM.MouseBehaviors.PixelBehavior('left');
    }
    if (name == 'line') {
        return new DICOM.MouseBehaviors.InsertLineBehavior('left');
    }
    if (name == 'select') {
        return new DICOM.MouseBehaviors.SelectShapeBehavior('select');
    }
};
