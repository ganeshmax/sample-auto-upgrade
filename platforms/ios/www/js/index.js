function log(name, value) {
    if(value === undefined) {
        value = '--';
    }
    $('#log').append(name + ': ' + value + '<br>');
    console.log('---------- ' + name + ': ' + value);
}

var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        log('Device is ready');
        app.persistentFs();
        app.temporaryFs();
    },

    persistentFs: function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs) {
                log('File System Name', fs.name);

                var rootDir = fs.root;
                log('Root Dir');
                log('Is File?', rootDir.isFile);
                log('Is Dir?', rootDir.isDirectory);
                log('Name', rootDir.name);
                log('FullPath', rootDir.fullPath);
            },
            function(evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    },

    temporaryFs: function() {
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
            function(fs) {
                log('File System Name', fs.name);

                var rootDir = fs.root;
                log('Root Dir');
                log('Is File?', rootDir.isFile);
                log('Is Dir?', rootDir.isDirectory);
                log('Name', rootDir.name);
                log('FullPath', rootDir.fullPath);
            },
            function(evt) {
                log('Error accessing file system', evt.target.error.code);
            }
        );
    }
};

