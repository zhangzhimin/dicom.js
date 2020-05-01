DICOM.generateGrid = function(width, height, columns, rows, callback) {

    var step1 = 1 / columns * 100;
    var step2 = 1 / rows * 100;

    var count = 0;
    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < columns; ++j) {
            callback({left: step1 * j, top: step2 * i, width: step1, height: step2, id: count});
            count++;
        }
    }

}
