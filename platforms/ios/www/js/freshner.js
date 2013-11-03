var freshner = {

    init: function() {
        var self = this;
        util.log('Bootstrap init');

        localDb.reset();
        flow.exec(
            function getCurrentAppDirectory() {
                util.log('getCurrentAppDirectory()');

                try {
                    var currentAppDirectoryName = localDb.getAppDirectoryName();
                    util.log('currentAppDirectoryName', currentAppDirectoryName);
                    getAppDirectory(currentAppDirectoryName, this);
                } catch(error) {
                    util.log('First Launch of app. No Current AppDirectory')
                    this(null, null);
                }
            },

            function onGetCurrentAppDirectory(error, currentAppDirectory) {
                util.log('onGetCurrentAppDirectory()');
                if(error) { onFatalError(error); return; }

                this.currentAppDirectory = currentAppDirectory; // Store currentAppDirectory in context
                this();
            },

            function downloadManifest() {
                var next = this;
                util.log('downloadManifest()');
                util.log('downloadManifest', config.manifestUrl());
                $.getJSON(config.manifestUrl())
                    .done(function(manifest) {
                        this(null, manifest)
                    }.bind(this))
                    .fail(function() {
                        this('Cannot download manifest');
                    }.bind(this));
            },

            function onDownloadManifest(error, manifest) {
                util.log('onDownloadManifest()');
                if(error) {
                    util.log('Error fetching manifest');
                    redirectTo(this.currentAppDirectory);
                    return;
                }

                this.manifest = manifest;   // Store manifest in context

                if(localDb.isServerAndClientVersionSame(this.manifest)) {
                    util.log('Server and Client versions are Same');
                    redirectTo(this.currentAppDirectory);
                    return;
                }

                try {
                    var manifestAppDirectoryName = localDb.getAppDirectoryNameFromManifest(manifest);
                    getAppDirectory(manifestAppDirectoryName, this);
                } catch(error) {
                    util.log('Error fetching app version and/or app name based on manifest');
                    redirectTo(this.currentAppDirectory);
                    return;
                }
            },

            function onGetManifestAppDirectory(error, manifestAppDirectory) {
                util.log('onGetManifestAppDirectory()');
                if(error) {
                    redirectTo(this.currentAppDirectory);
                    return;
                }

                this.manifestAppDirectory = manifestAppDirectory;   // Store manifestAppDirectory in context

                try {
                    downloadWebFiles(this.manifest, this.manifestAppDirectory, this);
                } catch(downloadWebFilesError) {
                    util.log('downloadWebFilesError');
                    this(downloadWebFilesError);
                }
            },

            function onDownloadWebFiles(error) {
                util.log('onDownloadWebFiles()');
                if(error) {
                    util.log('onDownloadWebFiles() with error');
                    redirectTo(this.currentAppDirectory);
                    return;
                }
                localDb.saveManifestDetails(this.manifest);
                redirectTo(this.manifestAppDirectory);
            },

            function onEnd() {
                util.log('onEnd()');
            }
        );

    }
};

function onFatalError(error) {
    util.log('onFatalError()');
    util.log('Fatal Error, Cannot start the app', error);
}

function redirectTo(appDirectory) {
    util.log('redirectTo()');
    if(!appDirectory) {
        onFatalError('Maybe first launch, but cannot download app from server');
        return;
    }

    location.href = appDirectory.getIndexPath();
}

function downloadManifest(callback) {
    util.log('downloadManifest()');
    util.log('downloadManifest', config.manifestUrl());
    return $.getJSON(config.manifestUrl())
        .done(function(manifest) {
            callback(null, manifest)
        })
        .fail(function() {
            callback('Cannot download manifest');
        });
}

function getAppDirectory(appDirectoryName, callback) {
    util.log('getAppDirectory()');
    var appDirectory = new AppDirectory(appDirectoryName);
    appDirectory.init()
        .done(function() {
            callback(null, appDirectory);
        })
        .fail(function(errorMessage) {
            callback(errorMessage);
        })
}

function downloadWebFiles(manifest, appDirectory, callback) {
    util.log('downloadWebFiles()');
    flow.serialForEach(manifest.files,
        function downloadFile(filePath) {

            var serverUrl = config.baseUrl + filePath;
            var localUrl = appDirectory.getPath() + filePath;

            util.log('Server URL', serverUrl);
            util.log('Local URL', localUrl);

            downloadWebFile(serverUrl, localUrl, this);
        },
        function onDownloadFile(error, localPath) {
            if (error) {
                throw error;
            }
        },
        function onDownloadFiles() {
            util.log('Downloaded all web files');
            callback();
        }
    );
}

function downloadWebFile(source, target, callback) {
    util.log('downloadWebFile()');
    var fileTransfer = new FileTransfer();

    fileTransfer.download(
        source, // Server URL
        target, // AppDirectory in device
        function(entry) {
            util.log("Download of " + source + " complete", entry.fullPath);
            callback(null, entry.fullPath);
        },
        function(error) {
            util.log("Download error", error);
            callback(error);
        }
    );
}