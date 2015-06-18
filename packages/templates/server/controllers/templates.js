'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Templates = mongoose.model('Templates'),
    _ = require('lodash');

/**
 * Find templates by id
 */
exports.template = function (req, res, next, id) {
    Templates.load(id, function (err, templates) {
        if (err)
            return next(err);
        if (!templates)
            return next(new Error('Failed to load templates ' + id));
        req.templates = templates;
        next();
    });
};

/**
 * Create a templates
 */
exports.create = function (req, res) {
    var template = new Templates(req.body);
    
    template.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the templates'
            });
        }
        res.json(template);
    });
};

/**
 * Update a templates
 */
exports.update = function (req, res) {
    var template = req.templates;
    
    template = _.extend(template, req.body);
    
    template.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the templates'
            });
        }
        res.json(template);
    });
};

/**
 * Delete a tam
 */
exports.destroy = function (req, res) {
    var template = req.templates;
    
    template.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the templates'
            });
        }
        
        res.json(template);
    });
};

/**
 * List of Templatess
 */
exports.get = function (req, res) {
    Templates.find({team: req.team._id}).sort('created').exec(function (err, templates) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the templatess'
            });
        }
        res.json(templates);
    });
};