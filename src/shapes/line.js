DICOM.Shapes = DICOM.Shapes || {};

DICOM.Shapes.Line = function() {
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
    this.geometry.dynamic = true;
    this.material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2,
    });

    this.nodeMaterial = new THREE
                            .MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})

                                this.shape = new THREE.Line(this.geometry, this.material);

    var nodeGeometry = new THREE.CircleGeometry(2, 32);
    this.nodes = [];
    this.nodes[0] = new THREE.Mesh(nodeGeometry, this.nodeMaterial);
    this.nodes[0].position.x = 0;
    this.nodes[0].position.y = 0;
    this.nodes[0].position.z = 0;

    var nodeGeometry1 = new THREE.CircleGeometry(2, 32);
    this.nodes[1] = new THREE.Mesh(nodeGeometry1, this.nodeMaterial);
    this.nodes[1].position.x = 0;
    this.nodes[1].position.y = 0;
    this.nodes[1].position.z = 0;

    this.shape.add(this.nodes[0]);
    this.shape.add(this.nodes[1]);
};

DICOM.Shapes.Line.prototype = {
    constructor: DICOM.Shapes.Line,

    get startPoint() {
        return this.shape.geometry.vertices[0];
    },

    set startPoint(point) {
        this.shape.geometry.vertices[0].copy(point);

        this.nodes[0].position.x = point.x;
        this.nodes[0].position.y = point.y;

        this.shape.geometry.verticesNeedUpdate = true;
    },

    get endPoint() {
        return this.shape.geometry.vertices[1];


    },

    set endPoint(point) {
        this.shape.geometry.vertices[1].copy(point);

        // positon = point, is not work;
        this.nodes[1].position.x = point.x;
        this.nodes[1].position.y = point.y;

        this.shape.geometry.verticesNeedUpdate = true;
    },

    bugWalkaround: function() {
        this.shape.geometry.computeBoundingSphere();
    },

    onAttach: function() {
        this.associatedObject.pane.scene.add(this.shape);
    },

    onDetach: function() {
        this.associatedObject.pane.scene.remove(this.shape);
    },

    // pos is a Vector2
    hitTest: function(pos) {
        var raycaster = new THREE.Raycaster();
        raycaster.linePrecision = 3;
        raycaster.setFromCamera(pos, this.associatedObject.pane.camera);

        var self = this;

        var intersets = raycaster.intersectObjects(this.nodes);
        var handlers = {};
        handlers[this.nodes[0].uuid] = {
            moveTo: function(pos) {
                self.startPoint = new THREE.Vector3(pos.x, pos.y, 0);
            }
        };
        handlers[this.nodes[1].uuid] = {
            moveTo: function(pos) {
                self.endPoint = new THREE.Vector3(pos.x, pos.y, 0);
            }
        };
        if (intersets.length > 0) {
            return handlers[intersets[0].object.uuid];
        }

        var intersets2 = raycaster.intersectObjects([this.shape]);
        if (intersets2.length > 0) {
            console.log('hitted line');
            return {
                offset: function(delta) {
                    console.log(delta);
                    self.startPoint = new THREE.Vector3(
                        self.startPoint.x + delta.x, self.startPoint.y + delta.y, 0);
                    self.endPoint =
                        new THREE.Vector3(self.endPoint.x + delta.x, self.endPoint.y + delta.y, 0);
                    self.bugWalkaround();

                    console.log(self.startPoint);
                }
            }
        }


    },
};

DICOM.AttachedObject.prototype.apply(DICOM.Shapes.Line.prototype);
