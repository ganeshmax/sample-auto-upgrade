
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on('deviceready', this.onDeviceReady);
        $("#btnDownload").on("click", this.downloadWeb);

    },

    onDeviceReady: function() {
        log('Device is ready');
        fileUtil.persistentFs();
        fileUtil.temporaryFs();
        fileUtil.attemptLibraryFolder();
        app.initiateAutoUpgrade();
    },

    initiateAutoUpgrade: function() {
        app.downloadManifest();
    },

    downloadManifest: function() {
        $.getJSON('http://localhost:8000/manifest.json')
            .done(function(data) {
                log('Success', 'Successfully downloaded manifest.json');
                log('Manifest', JSON.stringify(data));
                log('Manifest - Version', JSON.stringify(data.version));
                log('Manifest - Files', JSON.stringify(data.files));

            })
            .fail(function(jqXhr, textStatus, error) {
                log('Error', 'Failed to download manifest.json');
            })
    }
};



function download() {
    var ft = new FileTransfer();
    ft.download(
        url,
        window.rootFS.fullPath + "/" + fileName,
        function(entry) {
            console.log("download complete: " + entry.fullPath);

        },
        function(error) {
            console.log("download error" + error.code);
        }
    );
}