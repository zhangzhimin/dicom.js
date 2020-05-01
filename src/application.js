
DICOM.Application = function() {
    this.viewers = new DICOM.AttachedObjectCollection();

    this.thumbnailViewers = new DICOM.AttachedObjectCollection();

    this.behaviorID = new DICOM.ObservableData('default');

    this._behaviorLut = {};

    this.paneSelection = new DICOM.Selection();

    var self = this;

    this.viewerFactory = new DICOM.ViewerFactory();

    this.viewers.addEventListener('add', function(e) {
        var viewer = e.item;
        viewer.addEventListener('split', function(e) {
            var panes = e.newPanes;
            panes.each(function(pane) {
                var selectBehavior = new DICOM.MouseBehaviors.SelectBehavior(self.paneSelection);
                pane.behaviors.add(selectBehavior);
                var wheelPageBehavior = new DICOM.MouseBehaviors.WheelPageBehavior();
                pane.behaviors.add(wheelPageBehavior);

                var behavior = DICOM.BehaviorHelper.create(self.behaviorID.value);
                pane.behaviors.add(behavior);
                self._behaviorLut[pane.uuid] = behavior;

            });
        });
    });

    var self = this;
    DICOM.observe(this.behaviorID, function(e) {
        self.viewers.each(function(viewer) {
            viewer.panes.each(function(pane) {
                if (self._behaviorLut[pane.uuid]) {
                    pane.behaviors.remove(self._behaviorLut[pane.uuid]);
                }

                var behavior = DICOM.BehaviorHelper.create(self.behaviorID.value);
                pane.behaviors.add(behavior);

                self._behaviorLut[pane.uuid] = behavior;
            });
        });
    });
};

DICOM.Application.prototype = {
    constructor: DICOM.Application,

    createViewer: function(container, id) {
        var viewer = this.viewerFactory.createViewer(container);
        this.viewers.add(viewer);

        viewer.addEventListener('loadedDcmSeries', function(e) {
            viewer.panes.each(function(pane) {
                pane.loadDcmSeries(e.dcmSeries);
            });
        });

        viewer.addEventListener('split', function(e) {
            if (viewer.dcmSeries) {
                viewer.panes.each(function(pane) {
                    pane.loadDcmSeries(viewer.dcmSeries);
                });
            }
        });

        return viewer;
    },

    executeByID: function(cmd) {
        var pane = this.paneSelection._selectedItem;
        var cmd = DICOM.CommandHelper.create(cmd);
        cmd.attach(pane);
        cmd.execute();
    },

    setWWWL: function(ww, wl) {
        this.viewers.each(function(viewer) {
            viewer.panes.each(function(pane) {
                pane.state.windowWidth.value = ww;
                pane.state.windowLevel.value = wl;
            });
        })
    },

    render: function() {
        this.viewers.each(function(viewer) {
            viewer.render();
        });

        this.thumbnailViewers.each(function(viewer) {
            viewer.render();
        });
    },

    // loaded: function(){
    //     this.viewers.each(function(viewer){
    //         viewer.dispatchEvent({type: 'loaded'})
    //     });
    // },

    getCurrentViewer: function() {
        var selectionPane = this.paneSelection._selectedItem;
        if (selectionPane) {
            return selectionPane.viewer;
        } else {
            return this.viewers.index(0);
        }
    },
}
