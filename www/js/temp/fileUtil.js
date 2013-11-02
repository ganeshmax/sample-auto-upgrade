var fileUtil = {
    persistentFs: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fs) {
                util.log('File System Name', fs.name);

                var rootDir = fs.root;
                util.log('Persistent Dir');
                util.log('Is File?', rootDir.isFile);
                util.log('Is Dir?', rootDir.isDirectory);
                util.log('Name', rootDir.name);
                util.log('FullPath', rootDir.fullPath);
            },
            function (evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    },

    temporaryFs: function () {
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
            function (fs) {
                util.log('File System Name', fs.name);

                var rootDir = fs.root;
                util.log('Temporary Dir');
                util.log('Is File?', rootDir.isFile);
                util.log('Is Dir?', rootDir.isDirectory);
                util.log('Name', rootDir.name);
                util.log('FullPath', rootDir.fullPath);
            },
            function (evt) {
                util.log('Error accessing file system', evt.target.error.code);
            }
        );
    },

    attemptLibraryFolder: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fs) {
                util.log('File System Name', fs.name);

                var rootDir = fs.root;
                rootDir.getDirectory('../Library',
                    {create: false, exclusive: false},
                    function (appDir) {
                        util.log('Application Dir');
                        util.log('Is File?', appDir.isFile);
                        util.log('Is Dir?', appDir.isDirectory);
                        util.log('Name', appDir.name);
                        util.log('FullPath', appDir.fullPath);

                        var dirReader = appDir.createReader();
                        dirReader.readEntries(
                            function (entries) {
                                for (var i = 0; i < entries.length; i++) {
                                    util.log("File/Dir Name", entries[i].name);
                                }
                            },
                            function (error) {
                                util.log("Error while reading Library entries", error.code);
                            }
                        )
                    },
                    function (error) {
                        util.log('Error accessing App Dir', error.code);
                    }
                );

            },
            function (evt) {
                util.log('Error accessing file system', evt.target.error.code);
            }
        );
    }
};

function download() {
    var ft = new FileTransfer();
    ft.download(
        url,
        window.rootFS.fullPath + "/" + fileName,
        function(entry) {
            util.log("download complete", entry.fullPath);
        },
        function(error) {
            util.log("download error", error.code);
        }
    );
};