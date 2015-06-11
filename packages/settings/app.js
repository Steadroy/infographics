'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Settings = new Module('settings');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Settings.register(function (app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Settings.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users

    Settings.menus.add({
        'roles': ['designer'],
        'title': 'Settings',
        'link': 'see settings'
    });
    /*
     Settings.menus.add({
     'roles': ['authenticated'],
     'title': 'Create New Setting',
     'link': 'create setting'
     });
     */

    //Settings.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
    //Settings.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

    /*
     //Uncomment to use. Requires meanio@0.3.7 or above
     // Save settings with callback
     // Use this for saving data from administration pages
     Settings.settings({'someSetting':'some value'},function (err, settings) {
     //you now have the settings object
     });
     
     // Another save settings example this time with no callback
     // This writes over the last settings.
     Settings.settings({'anotherSettings':'some value'});
     
     // Get settings. Retrieves latest saved settings
     Settings.settings(function (err, settings) {
     //you now have the settings object
     });
     */
    Settings.aggregateAsset('css', '../../../../../bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css', {group: 'footer'});
    Settings.aggregateAsset('js', '../../../../../bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js', {group: 'footer'});
    Settings.aggregateAsset('css', 'settings.css', {group: 'footer'});

    return Settings;
});
