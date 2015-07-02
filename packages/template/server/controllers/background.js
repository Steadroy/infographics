'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Background = mongoose.model('Background'),
    _ = require('lodash'),
    populate = ['background_color'];


/**
 * Find background by id
 */
exports.background = function (req, res, next, id) {
    Background
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, background){
            if (err)
                return next(err);
            if (!background)
                return next(new Error('Failed to load background ' + id));
            
            req.background = background;
            next();
        });
};

/**
 * Create a background
 */
exports.create = function (req, res) {
    var background = new Background(req.body);
    
    background.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the background'
            });
        }
        res.json(background);
    });
};

/**
 * Update a background
 */
exports.update = function (req, res) {
    var background = req.background;
    
    background = _.extend(background, req.body);
    
    background.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the background' 
            });
        }
        Background
            .deepPopulate(background, populate,function(err, background){
                res.json(background);
            });
    });
};

/**
 * Delete a background
 */
exports.destroy = function (req, res) {
    var background = req.background;
    
    background.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the background'
            });
        }
        res.json(background);
    });
};