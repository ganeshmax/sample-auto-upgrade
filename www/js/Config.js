var config = {
    baseUrl: 'http://localhost:8000/',
    manifestName: 'manifest.json',

    manifestUrl: function() {
        return this.baseUrl + this.manifestName;
    }
};