'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Media = new Module('media');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Media.register(function (app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Media.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users

    Media.menus.add({
        'roles': ['designer'],
        'title': 'Library',
        'link': 'see media'
    });
    
    Media.aggregateAsset('js', '../../../../../bower_components/ng-file-upload/ng-file-upload-shim.min.js');
    Media.aggregateAsset('js', '../../../../../bower_components/ng-file-upload/ng-file-upload.min.js');
    
    Media.aggregateAsset('js', '../../../../../bower_components/ng-tags-input/ng-tags-input.min.js');
    Media.aggregateAsset('css', '../../../../../bower_components/ng-tags-input/ng-tags-input.min.css');
    
    Media.aggregateAsset('css', 'media.css');

    return Media;
});
