/**
 * Represents the AppDirectory in the native file system.
 * E.g. In IOS, <APP_HOME>/Documents/appName-appVersion (<APP_HOME>/Documents/sample-auto-upgrade-1)
 * @param name
 * @param fileSystemType
 * @param cwd
 * @constructor
 */
var AppDirectory = function(name) {
    util.log('AppDirectory()');
    this.name = name;

    this.path = null; // Will be filled by init
    this.directoryEntry = null; // Will be filled by init
};

AppDirectory.prototype = {
    /**
     * If directory with the given name already exists, we will start representing that
     * If directory with the given name didn't exist, we will create the same and start representing that
     * @returns {*}
     */
    init: function() {
        util.log('AppDirectory.init()');
        var deferred = $.Deferred();
        var self = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                var documentDirectory = fileSystem.root;
                documentDirectory.getDirectory(self.name,
                    { create: true },
                    function (appDirectory) {
                        self.directoryEntry = appDirectory;

                        util.log('App Directory Created', self.getPath());
                        deferred.resolve(self);
                    },
                    function (error) {
                        util.log('Error getting App Directory', error);
                        deferred.reject('Error getting App Directory');
                    }
                );
            },
            function (evt) {
                util.log('Error accessing file system', evt.target.error.code);
                deferred.reject('Error accessing file system');
            }
        );
        return deferred.promise();
    },

    getDirectoryEntry: function() {
        if(!this.directoryEntry) {
            throw new Error('App Directory Entry is not initialized');
        }

        return this.directoryEntry;
    },

    getPath: function() {
        return this.getDirectoryEntry().fullPath + '/';
    },

    getIndexPath: function() {
        return this.getPath() + 'index.html';
    },

    remove: function() {
        this.getDirectoryEntry().removeRecursively(
            function() {
                util.log('Directory Entry deletion successful. TODO: incorporate into async');
            },
            function(error) {
                util.log('Directory Entry deletion FAILURE', error);
            }
        );
    }
};

