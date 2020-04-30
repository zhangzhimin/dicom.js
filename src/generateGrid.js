DICOM.generateGrid = function(width, height, columns, rows, callback) {

    // var step1 = Math.floor(width / columns);
    // var step2 = Math.floor(height / rows);

    var step1 = 1 / columns * 100;
    var step2 = 1 / rows * 100;

    var grid = [];

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < columns; ++j) {
            callback({left: step1 * j, bottom: step2 * i, width: step1, height: step2});
        }
    }

    return grid;
};
