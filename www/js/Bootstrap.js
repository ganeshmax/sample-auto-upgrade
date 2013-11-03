var bootstrap = {

    appDirectory: null, // Will be filled by init

    /**
     * Download manifest
     * Check localStorage.manifest version and downloaded manifest version
     *  If same,
     *      get AppDirectory based on name+version that is stored in the localStorage,
     *      redirect user to the index.html in the AppDirectory
 *      If not same,
     *      create AppDirectory with new name+version that is in the manifest
     *      download files in the manifest to the AppDirectory
     *      store the new name+version in localStorage
     *      remove the old AppDirectory
     *      redirect user to the index.html in the AppDirectory
     */
    init: function() {
        var self = this;
        util.log('Bootstrap init');

        async.

        this.downloadManifest()
            .done(function(manifest) {
                util.log('Success', JSON.stringify(manifest));
                self.initAppDirectory(manifest);
            })
            .fail(self.onError);
    },

    initAppDirectory: function(manifest) {
        var self = this;
        var appName = manifest.name + "-" + manifest.version.web;
        self.appDirectory = new AppDirectory(appName);
        self.appDirectory.init()
            .done(function() {
                util.log('Success', 'AppDir initialized');
                self.downloadWebFiles(manifest.files);
            })
            .fail(self.onError);
    },

    downloadWebF: function() {
        self.downloadWebFiles(manifest.files)
            .done(function() {
                util.log('Success', 'All files downloaded and saved to AppDir');
            })
            .fail(self.onError);
    },

    downloadManifest: function() {
        util.log('downloadManifest', config.manifestUrl());
        return $.getJSON(config.manifestUrl());
    },

    downloadWebFiles: function(files, i) {
        var self = this;
        var deferred = $.Deferred();
        i = i || 0; // If i is not specified, then we assume 0;

        var filePath = files[i];
        var serverUrl = config.baseUrl + filePath;
        var localUrl = self.appDirectory.getPath() + filePath;

        util.log('Server URL', serverUrl);
        util.log('Local URL', localUrl);

        this.downloadWebFile(serverUrl, localUrl)
            .done(function() {

            })
            .fail(self.onError);

        return deferred.promise();
    },

    downloadWebFile: function(source, target) {
        var self = this;
        var deferred = $.Deferred();

        this.fileTransfer.download(
            source, // Server URL
            target, // AppDirectory in device
            function(entry) {
                util.log("Download of " + source + " complete", entry.fullPath);
                deferred.resolve();
            },
            function(error) {
                util.log("Download error", error);
                deferred.reject();
            }
        );

        return deferred.promise();
    },

    onError: function(error) {
        util.log('Error', error);
    }
};