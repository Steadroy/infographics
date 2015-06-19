'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Overlay = mongoose.model('Overlay'),
    _ = require('lodash');


/**
 * Find overlay by id
 */
exports.overlay = function (req, res, next, id) {
    Overlay
        .findById(id)
        .deepPopulate(['color_0', 'color_1'])
        .exec(function(err, overlay){
            if (err)
                return next(err);
            if (!overlay)
                return next(new Error('Failed to load overlay ' + id));
            
            req.overlay = overlay;
            next();
        });
};

/**
 * Create a overlay
 */
exports.create = function (req, res) {
    var overlay = new Overlay(req.body);
    
    overlay.save(function (err) {
        console.log(err);
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the overlay'
            });
        }
        res.json(overlay);
    });
};

/**
 * Update a overlay
 */
exports.update = function (req, res) {
    var overlay = req.overlay;
    
    overlay = _.extend(overlay, req.body);
    
    overlay.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the overlay' 
            });
        }
        res.json(overlay);
    });
};

/**
 * Delete a team
 */
exports.destroy = function (req, res) {
    var overlay = req.overlay;
    
    overlay.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the overlay'
            });
        }
        res.json(overlay);
    });
};