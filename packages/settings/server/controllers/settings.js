'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Setting = mongoose.model('Setting'),
    _ = require('lodash'),
    populate = [
        { path: 'colours.backgrounds' },
        { path: 'colours.fonts' }
    ];

/**
 * Find setting by id
 */
exports.setting = function (req, res, next, id) {
    Setting
        .findById(id)
        .populate(populate)
        .exec(function(err, setting){
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
            .populate(setting, populate,function(err, setting){
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
