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
Templates.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Templates.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  /*
  Templates.menus.add({
    'roles': ['authenticated'],
    'title': 'Templates',
    'link': 'all templates'
  });
  Templates.menus.add({
    'roles': ['authenticated'],
    'title': 'Create New Template',
    'link': 'create template'
  });
  */

  //Templates.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Templates.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Templates.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Templates.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Templates.settings(function (err, settings) {
      //you now have the settings object
    });
    */
    Templates.aggregateAsset('css', 'templates.css');

  return Templates;
});
