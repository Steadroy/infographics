'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Colour = mongoose.model('Colour'),
    //Settings = mongoose.model('Setting'),
    _ = require('lodash');


/**
 * Find colour by id
 */
exports.colour = function (req, res, next, id) {
    Colour.load(id, function (err, colour) {
        if (err)
            return next(err);
        if (!colour)
            return next(new Error('Failed to load colour ' + id));
        req.colour = colour;
        next();
    });
};

/**
 * Create a colour
 */
exports.create = function (req, res) {
    var colour = new Colour(req.body);
    
    colour.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the colour'
            });
        }
        res.json(colour);
    });
};

/**
 * Update a colour
 */
exports.update = function (req, res) {
    var colour = req.colour;
    
    colour = _.extend(colour, req.body);
    
    colour.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the colour' 
            });
        }
    });
};

/**
 * Delete a team
 */
exports.destroy = function (req, res) {
    var colour = req.colour;
    
    colour.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the team'
            });
        }
        res.json(colour);
    });
};