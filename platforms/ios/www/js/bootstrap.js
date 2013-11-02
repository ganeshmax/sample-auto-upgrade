var bootstrap = {

    appDir: null,

    initialize: function() {
        util.log('Bootstap init');

        // Download Manifest
        // Get App name and version and create localDir
        // Download files in manifest.json to the localDir
        var downloadManifestPromise = this.downloadManifest();
        downloadManifestPromise.done(function(manifest) {
            var localDirName = manifest.name + "-" + manifest.version.web;
            var createAppDirPromise = bootstrap.createAppDir(localDirName);

            var files = manifest.files;
            createAppDirPromise.done(function() {
                bootstrap.downloadFiles(files);
            });
        });
    },

    downloadManifest: function() {
        util.log('downloadManifest', config.manifestUrl());
        return $.getJSON(config.manifestUrl())
            .done(function(data) {
                util.log('Success', 'Successfully downloaded manifest.json');
                util.log('Manifest', JSON.stringify(data));
            })
            .fail(function(jqXhr, textStatus, error) {
                util.log('Error', 'Failed to download manifest.json');
            });
    },

    downloadFiles: function(files) {
        var deferred = $.Deferred();

        var ft = new FileTransfer();
        $.each(files, function(index, value) {
            var serverUrl = config.baseUrl + value;
            var localUrl = bootstrap.appDir + value;

            util.log('Server URL', serverUrl);
            util.log('Local URL', localUrl);

            ft.download(
                serverUrl, // Download URL
                localUrl,
                function(entry) {
                    util.log("download of " + serverUrl + " complete", entry.fullPath);
                },
                function(error) {
                    util.log("download error", error);
                }
            );

        });
        return deferred.promise();
    },

    createAppDir: function(localDirName) {
        var deferred = $.Deferred();
        var self = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                var documentDir = fileSystem.root;
                documentDir.getDirectory(localDirName,
                    {create: true},
                    function (appDir) {
                        bootstrap.appDir = appDir.fullPath + '/';
                        util.log('App Dir Created');
                        deferred.resolve();
                    },
                    function (error) {
                        util.log('Error getting App Dir', error.code);
                        deferred.reject();
                    }
                );
            },
            function (evt) {
                util.log('Error accessing file system', evt.target.error.code);
                deferred.reject();
            }
        );
        return deferred.promise();
    }
};