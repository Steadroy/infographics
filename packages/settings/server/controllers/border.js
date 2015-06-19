'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Border = mongoose.model('Border'),
    _ = require('lodash');


/**
 * Find border by id
 */
exports.border = function (req, res, next, id) {
    Border
        .findById(id)
        .deepPopulate('border_color')
        .exec(function(err, border){
            if (err)
                return next(err);
            if (!border)
                return next(new Error('Failed to load border ' + id));
            
            req.border = border;
            next();
        });
};

/**
 * Create a border
 */
exports.create = function (req, res) {
    var border = new Border(req.body);
    
    border.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the border'
            });
        }
        res.json(border);
    });
};

/**
 * Update a border
 */
exports.update = function (req, res) {
    var border = req.border;
    
    border = _.extend(border, req.body);
    
    border.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the border' 
            });
        }
        res.json(border);
    });
};

/**
 * Delete a team
 */
exports.destroy = function (req, res) {
    var border = req.border;
    
    border.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the border'
            });
        }
        res.json(border);
    });
};