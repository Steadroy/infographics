'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Templates = new Module('templates');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Templates.register(function (app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Templates.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users

    Templates.menus.add({
        'roles': ['designer'],
        'title': 'Templates',
        'link': 'see templates'
    });
    
    //Templates.aggregateAsset('js', '../../../../../bower_components/ng-resize/ngresize.min.js', {group: 'footer'});
    //Templates.aggregateAsset('js', 'colResizable-1.5.min.js', {group: 'footer'});
    Templates.aggregateAsset('css', 'templates.css', {group: 'footer'});

    return Templates;
});
