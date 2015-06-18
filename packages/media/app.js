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
        'roles': ['designer', 'journalist'],
        'title': 'Media Library',
        'link': 'see media'
    });
    
    Media.aggregateAsset('js', '../../../../../bower_components/ng-file-upload/ng-file-upload-shim.min.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/ng-file-upload/ng-file-upload.min.js', {group: 'footer'});
    
    Media.aggregateAsset('js', '../../../../../bower_components/ng-tags-input/ng-tags-input.min.js', {group: 'footer'});
    Media.aggregateAsset('css', '../../../../../bower_components/ng-tags-input/ng-tags-input.min.css', {group: 'footer'});
    
    Media.aggregateAsset('js', '../../../../../bower_components/angular-sanitize/angular-sanitize.min.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/videogular/videogular.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/videogular-controls/vg-controls.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/videogular-overlay-play/vg-overlay-play.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/videogular-poster/vg-poster.js', {group: 'footer'});
    Media.aggregateAsset('js', '../../../../../bower_components/videogular-buffering/vg-buffering.js', {group: 'footer'});
    
    Media.aggregateAsset('css', 'media.css', {group: 'footer'});

    return Media;
});
