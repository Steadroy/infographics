'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Setting = mongoose.model('Setting'),
    _ = require('lodash'),
    populate = [
        'colours.backgrounds',
        'colours.fonts',
        'colours.borders',
        'colours.overlays',
        
        'fonts',
        'fonts.color',
        
        'borders',
        'borders.border_color',
        
        'overlays',
        'overlays.color_0',
        'overlays.color_1'
    ];

/**
 * Find setting by id
 */
exports.setting = function (req, res, next, id) {
    Setting
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, setting){
            if (err)
                return next(err);
            if (!setting)
                return next(new Error('Failed to load setting ' + id));
            
            req.setting = setting;
            next();
        });
};

/**
 * Create a setting
 */
exports.create = function (req, res) {
    var setting = new Setting(req.body);
    
    setting.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the setting'
            });
        }
        res.json(setting);
    });
};

/**
 * Update a setting
 */
exports.update = function (req, res) {
    var setting = req.setting;
    
    setting = _.extend(setting, req.body);
    
    setting.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the setting'
            });
        }
        Setting
            .deepPopulate(setting, populate,function(err, setting){
                res.json(setting);
            });
    });
};

/**
 * Show a setting
 */
exports.show = function (req, res) {
    res.json(req.setting);
};

/**
 * List of Settings
 */
exports.get = function (req, res) {
    Setting.find().sort('-created').exec(function (err, settings) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the settings'
            });
        }
        res.json(settings);
    });
};
