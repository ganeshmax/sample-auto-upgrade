var bootstrap = {
    initialize: function() {
        util.log('Bootstap init');

        // Download Manifest
        // Get App name and version and create localDir
        // Download files in manifest.json to the localDir
        this.downloadManifest().done(function(manifest) {
            var appName = manifest.name;
            var appVersion = manifest.version.web;
            var localDirName = appName + "-" + appVersion;
            bootstrap.createAppDir(localDirName);
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

    createAppDir: function(localDirName) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                var documentDir = fileSystem.root;
                documentDir.getDirectory(localDirName,
                    {create: true},
                    function (appDir) {
                        util.log('App Dir Created');
                    },
                    function (error) {
                        util.log('Error getting App Dir', error.code);
                    }
                );
            },
            function (evt) {
                util.log('Error accessing file system', evt.target.error.code);
            }
        );
    }
};