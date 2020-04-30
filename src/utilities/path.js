
var Path = function(url) {
    this.url = url;
};

Path.prototype = {
    construct: Path,

    get extension() {
        return this.url.split('.').pop();
    },

    get filename() {
        return this.url.split('\\').pop().split('/').pop();
        // return /([^(\\|/)]+)$/.exec(this.url);
    },

    get parentFolder() {
        var filename = this.filename;
        return this.url.slice(0, this.url.length - filename.length);
    },

    get string() {
        return this.url;
    },
};
