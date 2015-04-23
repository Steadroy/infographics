'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Template = mongoose.model('Template'),
    _ = require('lodash');


/**
 * Find template by id
 */
exports.template = function (req, res, next, id) {
    Template.load(id, function (err, template) {
        if (err)
            return next(err);
        if (!template)
            return next(new Error('Failed to load template ' + id));
        req.template = template;
        next();
    });
};

/**
 * Create a template
 */
exports.create = function (req, res) {
    var template = new Template(req.body);
    template.user = req.user;

    template.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the template'
            });
        }
        res.json(template);
    });
};

/**
 * Update a template
 */
exports.update = function (req, res) {
    var template = req.template;

    template = _.extend(template, req.body);

    template.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the template'
            });
        }
        res.json(template);
    });
};

/**
 * Delete a template
 */
exports.destroy = function (req, res) {
    var template = req.template;

    template.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the template'
            });
        }
        res.json(template);
    });
};

/**
 * Show a template
 */
exports.show = function (req, res) {
    res.json(req.template);
};

/**
 * List of Templates
 */
exports.all = function (req, res) {
    Template.find().sort('-created').populate('user', 'name username').exec(function (err, templates) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the templates'
            });
        }
        res.json(templates);
    });
};
