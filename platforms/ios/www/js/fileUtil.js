var fileUtil = {
    persistentFs: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fs) {
                log('File System Name', fs.name);

                var rootDir = fs.root;
                log('Persistent Dir');
                log('Is File?', rootDir.isFile);
                log('Is Dir?', rootDir.isDirectory);
                log('Name', rootDir.name);
                log('FullPath', rootDir.fullPath);
            },
            function (evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    },

    temporaryFs: function () {
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
            function (fs) {
                log('File System Name', fs.name);

                var rootDir = fs.root;
                log('Temporary Dir');
                log('Is File?', rootDir.isFile);
                log('Is Dir?', rootDir.isDirectory);
                log('Name', rootDir.name);
                log('FullPath', rootDir.fullPath);
            },
            function (evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    },

    attemptLibraryFolder: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fs) {
                log('File System Name', fs.name);

                var rootDir = fs.root;
                rootDir.getDirectory('../Library',
                    {create: false, exclusive: false},
                    function (appDir) {
                        log('Application Dir');
                        log('Is File?', appDir.isFile);
                        log('Is Dir?', appDir.isDirectory);
                        log('Name', appDir.name);
                        log('FullPath', appDir.fullPath);

                        var dirReader = appDir.createReader();
                        dirReader.readEntries(
                            function (entries) {
                                for (var i = 0; i < entries.length; i++) {
                                    log("File/Dir Name", entries[i].name);
                                }
                            },
                            function (error) {
                                log("Error while reading Library entries", error.code);
                            }
                        )
                    },
                    function (error) {
                        log('Error accessing App Dir', error.code);
                    }
                );

            },
            function (evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    }
}