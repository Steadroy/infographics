'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Iframe = new Module('iframe');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Iframe.register(function (app, auth, database) {
    //We enable routing. By default the Package Object is passed to the routes
    Iframe.routes(app, auth, database);
    
    Iframe.aggregateAsset('css', 'iframe.css', {group: 'footer'});
    
    return Iframe;
});
