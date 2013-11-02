module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig( {
        pkg: grunt.file.readJSON('package.json'),

        shell: {
            prepareIos: {
                command: 'cordova prepare ios'
            },
            compileIos: {
                command: 'cordova compile ios'
            },
            buildIos: {
                command: 'cordova build ios'
            },
            emulateIos: {
                command: './cordova/emulate',
                options: {
                    execOptions: {
                        cwd: 'platforms/ios'
                    }
                }
            }
        },

        watch: {
            html: {
                files: ['www/src/script/template/**/*.html'],
                tasks: ['jst']
            }
        }

    });

    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('debug-ios', ['shell:buildIos', 'shell:emulateIos']);
    grunt.registerTask('emulate-ios', ['shell:prepareIos', 'shell:emulateIos']);

};