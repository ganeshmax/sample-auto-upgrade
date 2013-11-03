var localDb = {
    KEY_APP_NAME: 'manifest.name',
    KEY_APP_VERSION: 'manifest.version.web',

    reset: function() {
        localStorage.removeItem(localDb.KEY_APP_NAME);
        localStorage.removeItem(localDb.KEY_APP_VERSION);
    },

    getAppName: function() {
        return localStorage.getItem(localDb.KEY_APP_NAME);
    },

    getAppVersion: function() {
        return localStorage.getItem(localDb.KEY_APP_VERSION);
    },

    getAppDirectoryName: function() {
        var appName = localDb.getAppName();
        var appVersion = localDb.getAppVersion();

        if(!(appName || appVersion)) {
            throw 'AppName or AppVersion not available'
        }
        return appName + '-' + appVersion;
    },

    getAppDirectoryNameFromManifest: function(manifest) {
        var appName = manifest.name;
        var appVersion = manifest.version.web;

        if(!(appName || appVersion)) {
            throw 'AppName or AppVersion not available'
        }
        return appName + '-' + appVersion;
    },

    setAppName: function(appName) {
        localStorage.setItem(localDb.KEY_APP_NAME, appName);
    },

    setAppVersion: function(appVersion) {
        localStorage.setItem(localDb.KEY_APP_VERSION, appVersion);
    },

    isServerAndClientVersionSame: function(manifest) {
        var clientVersion = localDb.getAppVersion();
        var serverVersion = manifest.version.web;
        return clientVersion == serverVersion;
    },

    saveManifestDetails: function(manifest) {
        localDb.setAppName(manifest.name);
        localDb.setAppVersion(manifest.version.web);
    }

};
