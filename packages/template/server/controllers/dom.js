'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dom = mongoose.model('Dom'),
    Background = mongoose.model('Background'),
    Configuration = mongoose.model('Configuration'),
    _ = require('lodash'),
    populate = [
        'configuration',
        'configuration.background',
        'configuration.background.background_color',
        
        'configuration.font',
        'configuration.font.color',
        
        'configuration.border',
        'configuration.border.border_color',
        
        'configuration.overlay',
        'configuration.overlay.color_0',
        'configuration.overlay.color_1'
    ];


/**
 * Find dom by id
 */
exports.dom = function (req, res, next, id) {
    Dom
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, dom){
            if (err)
                return next(err);
            if (!dom)
                return next(new Error('Failed to load dom ' + id));
            
            req.dom = dom;
            next();
        });
};

/**
 * Create a dom
 */
exports.create = function (req, res) {
    var dom = new Dom(req.body),
        background = new Background(),
        configuration = new Configuration(),
        _err = function(message, res){
            return res.status(500).json({ error: message });
        };

    background.save(function(err){
        if (err)
            return _err('Cannot create a new background element', res);

        configuration.background = background;
        configuration.save(function(err){
            if (err)
                return _err('Cannot create a new configuration', res);

            dom.dom_id = '#dom-' + Date.now();
            dom.configuration = configuration;
            dom.save(function(err){
                if (err)
                    return _err('Cannot create a new node', res);

                Dom
                    .deepPopulate(dom, populate, function(err, dom){
                        res.json(dom);
                    });
            });
        });
    });
};

/**
 * Update a dom
 */
exports.update = function (req, res) {
    var dom = req.dom;
    
    dom = _.extend(dom, req.body);
    
    dom.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the dom' 
            });
        }
        Dom
            .deepPopulate(dom, populate, function(err, dom){
                res.json(dom);
            });
    });
};

/**
 * Delete a dom
 */
exports.destroy = function (req, res) {
    var dom = req.dom;
    
    dom.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the dom'
            });
        }
        res.json(dom);
    });
};