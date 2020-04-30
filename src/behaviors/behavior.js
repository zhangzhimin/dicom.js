var DICOM = DICOM || {};

//我们可以将Behavior理解为类似于一系列 鼠标 触摸事件的集合
//我们会在派生对象的onAttach函数里注册 交互事件及其逻辑， 在onDetech函数中移除
DICOM.Behavior = function() {

};

DICOM.Behavior.prototype = new DICOM.AttachedObject();
DICOM.Behavior.prototype.constructor = DICOM.Behavior;

//利用该函数绑定Viewer， 该函数会在Viewer.addBhavior中被调用
DICOM.Behavior.prototype.onAttach = function() {
    this.pane = this.associatedObject;
};

//解绑Viewer, 该函数会在Viewr.removeBehaviro中被调用
DICOM.Behavior.prototype.onDetach = function() {
    this.pane = undefined;
};
