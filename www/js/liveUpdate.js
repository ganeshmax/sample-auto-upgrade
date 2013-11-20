var liveUpdate

var freshner = {

    currentAppDirectory: null,
    manifestAppDirectory: null,
    manifest: null,

    init: function() {
        var self = this;
        util.log('Bootstrap init');

        // localDb.reset();

        async.waterfall([
            function getCurrentAppDirectory(next) {
                util.log('getCurrentAppDirectory()');
                var currentAppDirectoryName = null;

                try {
                    currentAppDirectoryName = localDb.getAppDirectoryName();
                    util.log('currentAppDirectoryName', currentAppDirectoryName);
                } catch(error) {    // NON Fatal error, proceed to the next Function
                    util.log('First Launch of app. No Current AppDirectory');
                    next();
                    return;
                }

                // If there was no error getting current app directory name, init app directory object
                new AppDirectory(currentAppDirectoryName).init()
                    .done(function(appDirectory) {
                        freshner.currentAppDirectory = appDirectory;
                        next();
                    })
                    .fail(function(errorMessage) {
                        next(new BootstrapError(BootstrapError.Type.FATAL, 0, errorMessage));
                    })
            },

            function downloadManifest(next) {
                util.log('downloadManifest()', config.manifestUrl());
                $.getJSON(config.manifestUrl())
                    .done(function(manifest) {
                        freshner.manifest = manifest;

                        if(localDb.isServerAndClientVersionSame(manifest)) {
                            next(new BootstrapError(BootstrapError.Type.NON_FATAL, 0, 'Server and Client versions are Same'));
                        } else {
                            next(null, manifest);
                        }
                    })
                    .fail(function() {
                        next(new BootstrapError(BootstrapError.Type.NON_FATAL, 0, 'Error fetching manifest'));
                    });
            },

            function getManifestAppDirectory(manifest, next) {
                var manifestAppDirectoryName = null;

                try {
                    manifestAppDirectoryName = localDb.getAppDirectoryNameFromManifest(manifest);
                } catch(error) {
                    next(new BootstrapError(BootstrapError.Type.NON_FATAL, 0, 'Error fetching app version and/or app name based on manifest'));
                    return;
                }

                new AppDirectory(manifestAppDirectoryName).init()
                    .done(function(appDirectory) {
                        freshner.manifestAppDirectory = appDirectory;
                        next();
                    })
                    .fail(function(errorMessage) {
                        next(new BootstrapError(BootstrapError.Type.NON_FATAL, 0, 'Error initializing manifestAppDirectory from FS'));
                    })
            },

            function downloadWebFiles(next) {
                util.log('downloadWebFiles()');
                var fileTransfer = new FileTransfer();

                async.eachSeries(
                    freshner.manifest.files,

                    function downloadFile(filePath, downloadNext) {
                        var serverUrl = config.baseUrl + filePath;
                        var localUrl = freshner.manifestAppDirectory.getPath() + filePath;

                        util.log('Server URL', serverUrl);
                        util.log('Local URL', localUrl);

                        fileTransfer.download(
                            serverUrl, localUrl,
                            function(entry) {
                                util.log("Download Complete TO", entry.fullPath);
                                downloadNext();
                            },
                            function(error) {
                                util.log("Download error", error);
                                downloadNext(error);
                            }
                        );
                    },

                    function onEndOrError(error) {
                        util.log('onEndOrError() in downloadFiles');
                        if (error) {
                            util.log('Removing manifest app directory');
                            // freshner.manifestAppDirectory.remove();
                            next(new BootstrapError(BootstrapError.Type.NON_FATAL, 0, error));
                            return;
                        }

                        next();
                    }
                );
            },

            function startApp() {
                util.log('startApp()');
                localDb.saveManifestDetails(freshner.manifest);
                redirectTo(freshner.manifestAppDirectory);
            }

        ],
            function onEndOrError(error) {
                util.log('onEndOrError()');

                if(error) {
                    util.log('Error Message', error.message);
                    if(error.isFatal()) {
                        onFatalError(error);
                    } else {
                        redirectTo(freshner.currentAppDirectory);
                    }
                }
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