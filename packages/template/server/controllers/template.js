'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    config = require('meanio').loadConfig(),
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
    var template = new Template(req.body), temporal_doms,
        background = new Background(),
        configuration = new Configuration(),
        dom = new Dom(), 
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
                        
                        if(!req.query.clone || (req.query.clone && template.doms.length === temporal_doms.length)){
                            template.save(function (err) {
                                if (err)
                                    return _err('Cannot create a new template', res);

                                Template
                                    .deepPopulate(template, populate, function(err, template){
                                        res.json(template);
                                    });
                            });
                        }
                    });
                });
            });
        };
    
    if(req.query.clone){
        var clone_dom = function(id, i){
                Dom
                    .findById(id)
                    .exec(function(err, _dom){
                        if (err || !_dom)
                            return _err('Failed to load dom element', res);

                        if(_dom.dom_id !== '#infographic-container'){
                            _dom.dom_id = _dom.dom_id + i;
                        }
                        if(_dom.parent_dom_id && _dom.parent_dom_id !== '#infographic-container'){
                            _dom.parent_dom_id = _dom.parent_dom_id + (i-1);
                        }
                        _dom._id = new mongoose.Types.ObjectId();
                        _dom.isNew = true;

                        Configuration
                            .findById(_dom.configuration)
                            .exec(function(err, _configuration){
                                if (err || !_configuration)
                                    return _err('Failed to load dom configuration', res);

                                _configuration._id = new mongoose.Types.ObjectId();
                                _configuration.isNew = true;

                                Background
                                    .findById(_configuration.background)
                                    .exec(function(err, _background){
                                        if (err || !_background)
                                            return _err('Failed to load dom background', res);

                                        _background._id = new mongoose.Types.ObjectId();
                                        _background.isNew = true;

                                        save_tree(_background, _configuration, _dom, template, res); 
                                    });
                            });
                    });
            };
            
        Template
            .findById(template._id)
            .exec(function(err, _template){
                temporal_doms = _template.doms;
                if (err || !_template)
                    return _err('Failed to load dom template', res);
                
                _template.name = _template.name + ' [Clone]';
                _template._id = new mongoose.Types.ObjectId();
                _template.poster = '';
                _template.ready = false;
                _template.isNew = true;
                
                template = _template;
                template.doms = [];
                
                for(var i = 0; i < temporal_doms.length; i = i + 1){
                    clone_dom(temporal_doms[i], i);
                }
            });
    }
    else{
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

exports.poster = function (req, res) {
    if (req.template) {
        var intervalID = setInterval(function () {
            try {
                var img = fs.readFileSync(config.root + '/upload/' + req.team._id + '/' + req.template.poster);
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(img, 'binary');
                clearInterval(intervalID);
            } catch (err) {
            }
        }, 750);
    }
    else {
        var img = fs.readFileSync(config.root + '/upload/transparent.png');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(img, 'binary');
    }
};