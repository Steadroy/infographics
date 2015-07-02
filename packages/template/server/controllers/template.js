'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Template = mongoose.model('Template'),
    Dom = mongoose.model('Dom'),
    Background = mongoose.model('Background'),
    Configuration = mongoose.model('Configuration'),
    _ = require('lodash'),
    populate = [
        'doms',
        'doms.configuration',
        'doms.configuration.background',
        'doms.configuration.background.background_color',
        
        'doms.configuration.font',
        'doms.configuration.font.color',
        
        'doms.configuration.border',
        'doms.configuration.border.border_color',
        
        'doms.configuration.overlay',
        'doms.configuration.overlay.color_0',
        'doms.configuration.overlay.color_1'
    ];

/**
 * Find template by id
 */
exports.template = function (req, res, next, id) {
    Template
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, template){
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
    var template = new Template(req.body),
        background = new Background(),
        configuration = new Configuration(),
        dom = new Dom(), send = false, 
        _err = function(message, res){
            return res.status(500).json({ error: message });
        },
        save_tree = function(background, configuration, dom, template, res){
            background.save(function(err){
                if (err)
                    return _err('Cannot create a new background element', res);
                
                configuration.background = background;
                configuration.save(function(err){
                    if (err)
                        return _err('Cannot create a new configuration', res);
                    
                    dom.configuration = configuration;
                    dom.save(function(err){
                        if (err)
                            return _err('Cannot create a new node', res);
                        
                        template.doms.push(dom);
                            
                        template.save(function (err) {
                            if (err)
                                return _err('Cannot create a new template', res);
                            
                            Template
                                .deepPopulate(template, populate, function(err, template){
                                    if(send)
                                        res.json(template);
                                });
                        });
                    });
                });
            });
        };
    
    if(req.query.clone){
        var exec_background = function(err, _background){
                if (err || !_background)
                    return _err('Failed to load dom background', res);

                _background._id = mongoose.Types.ObjectId();
                _background.isNew = true;
                
                save_tree(_background, configuration, dom, template, res); 
            },
            exec_configuration = function(err, _configuration){
                if (err || !_configuration)
                    return _err('Failed to load dom configuration', res);

                _configuration._id = mongoose.Types.ObjectId();
                _configuration.isNew = true;
                
                configuration = _configuration;
                
                Background
                    .findById(_configuration.background)
                    .exec(exec_background);
            },
            exec_dom = function(err, _dom){
                if (err || !_dom)
                    return _err('Failed to load dom element', res);

                _dom.dom_id = '#dom_' + Date.now();
                _dom._id = mongoose.Types.ObjectId();
                _dom.isNew = true;
                
                dom = _dom;
                
                Configuration
                    .findById(_dom.configuration)
                    .exec(exec_configuration);
            },
            exec_template = function(err, _template){
                var temporal_doms = _template.doms;
                if (err || !_template)
                    return _err('Failed to load dom template', res);
                
                _template.name = _template.name + ' [Clone]';
                _template._id = mongoose.Types.ObjectId();
                _template.isNew = true;
                
                template = _template;
                template.doms = [];
                
                console.log(temporal_doms.length);
                
                for(var i = 0; i < temporal_doms.length; i = i + 1){
                    if(i === temporal_doms.length - 1)
                        send = true;
                    Dom
                        .findById(temporal_doms[i])
                        .exec(exec_dom);
                }
            };
            
        Template
            .findById(template._id)
            .exec(exec_template);
    }
    else{
        send = true;
        save_tree(background, configuration, dom, template, res);
    }
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
        Template
            .deepPopulate(template, populate,function(err, template){
                res.json(template);
            });
    });
};

/**
 * Show a template
 */
exports.show = function (req, res) {
    res.json(req.template);
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
 * List of Template
 */
exports.get = function (req, res) {
    Template.find({team: req.query.teamId}).deepPopulate(populate).sort('-created').exec(function (err, template) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the template'
            });
        }
        res.json(template);
    });
};
