'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Configuration = mongoose.model('Configuration'),
    _ = require('lodash'),
    populate = [
        'background', 
        'background.background_color', 
        
        'font', 
        'font.color',
        
        'border', 
        'border.border_color', 
        
        'overlay',
        'overlay.color_0',
        'overlay.color_1'
    ];


/**
 * Find configuration by id
 */
exports.configuration = function (req, res, next, id) {
    Configuration
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, configuration){
            if (err)
                return next(err);
            if (!configuration)
                return next(new Error('Failed to load configuration ' + id));
            
            req.configuration = configuration;
            next();
        });
};

/**
 * Create a configuration
 */
exports.create = function (req, res) {
    var configuration = new Configuration(req.body);
    
    configuration.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the configuration'
            });
        }
        res.json(configuration);
    });
};

/**
 * Update a configuration
 */
exports.update = function (req, res) {
    var configuration = req.configuration;
    
    configuration = _.extend(configuration, req.body);
    
    configuration.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the configuration' 
            });
        }
        Configuration
            .deepPopulate(configuration, populate,function(err, configuration){
                res.json(configuration);
            });
    });
};

/**
 * Delete a configuration
 */
exports.destroy = function (req, res) {
    var configuration = req.configuration;
    
    configuration.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the configuration'
            });
        }
        res.json(configuration);
    });
};