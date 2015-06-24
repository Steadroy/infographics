'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Font = mongoose.model('Font'),
    _ = require('lodash');


/**
 * Find font by id
 */
exports.font = function (req, res, next, id) {
    Font
        .findById(id)
        .deepPopulate('color')
        .exec(function(err, font){
            if (err)
                return next(err);
            if (!font)
                return next(new Error('Failed to load font ' + id));
            
            req.font = font;
            next();
        });
};

/**
 * Create a font
 */
exports.create = function (req, res) {
    var font = new Font(req.body);
    
    font.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the font'
            });
        }
        res.json(font);
    });
};

/**
 * Update a font
 */
exports.update = function (req, res) {
    var font = req.font;
    
    font = _.extend(font, req.body);
    
    font.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the font' 
            });
        }
        res.json(font);
    });
};

/**
 * Delete a team
 */
exports.destroy = function (req, res) {
    var font = req.font;
    
    font.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the font'
            });
        }
        res.json(font);
    });
};