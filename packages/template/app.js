'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Template = new Module('template');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Template.register(function (app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Template.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users

    Template.menus.add({
        'roles': ['designer'],
        'title': 'Template',
        'link': 'see template'
    });
    
    Template.aggregateAsset('js', '../../../../../bower_components/html2canvas/dist/html2canvas.min.js', {group: 'footer'});
    //Template.aggregateAsset('js', 'colResizable-1.5.min.js', {group: 'footer'});
    Template.aggregateAsset('css', 'template.css', {group: 'footer'});
    
    return Template;
});
