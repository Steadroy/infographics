'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    config = require('meanio').loadConfig(),
    Infographic = mongoose.model('Infographic'),
    _ = require('lodash'),
    populate = [
        'team',
        
        'template',
        'template.doms',
        'template.doms.configuration',
        'template.doms.configuration.background',
        'template.doms.configuration.background.background_color',
        
        'template.doms.configuration.font',
        'template.doms.configuration.font.color',
        
        'template.doms.configuration.border',
        'template.doms.configuration.border.border_color',
        
        'template.doms.configuration.overlay',
        'template.doms.configuration.overlay.color_0',
        'template.doms.configuration.overlay.color_1',
        
        'content.background',
        'content.background.background_color'
    ];

/**
 * Find infographic by id
 */
exports.infographic = function (req, res, next, id) {
    Infographic
        .findById(id)
        .deepPopulate(populate)
        .exec(function(err, infographic){
            if (err)
                return next(err);

            if (!infographic)
                return next(new Error('Failed to load infographic ' + id));
            req.infographic = infographic;
            next();
        });
};

/**
 * Create a infographic
 */
exports.create = function (req, res) {
    var infographic = new Infographic(req.body);
    
    infographic.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the infographic'
            });
        }
        
        Infographic
            .deepPopulate(infographic, populate, function(err, infographic){
                res.json(infographic);
            });
    });
};

/**
 * Update a infographic
 */
exports.update = function (req, res) {
    var infographic = req.infographic;
    
    infographic = _.extend(infographic, req.body);
    
    infographic.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the infographic'
            });
        }
        Infographic
            .deepPopulate(infographic, populate, function(err, infographic){
                res.json(infographic);
            });
    });
};

/**
 * Show a infographic
 */
exports.show = function (req, res) {
    res.json(req.infographic);
};


/**
 * Delete a infographic
 */
exports.destroy = function (req, res) {
    var infographic = req.infographic;
    
    infographic.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the infographic'
            });
        }
        res.json(infographic);
    });
};

/**
 * List of Infographic
 */
exports.get = function (req, res) {
    Infographic.find({team: req.query.teamId}).deepPopulate(populate).sort('-created').exec(function (err, infographic) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the infographic'
            });
        }
        res.json(infographic);
    });
};

exports.poster = function (req, res) {
    var fallback = function(res){
        var img = fs.readFileSync(config.root + '/upload/transparent.png');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(img, 'binary');
    };
    if (req.infographic) {
        var intervalID = setInterval(function () {
            try {
                var img = fs.readFileSync(config.root + '/upload/' + req.team._id + '/' + req.infographic.poster);
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(img, 'binary');
            } catch (err) {
                fallback(res);
            }
            clearInterval(intervalID);
        }, 750);
    }
    else {
        fallback(res);
    }
};

/**
 * List of Medias
 */
exports.getTags = function (req, res) {
    var reg_exp = new RegExp('.*' + req.params.query + '.*', 'i');
    Infographic.find({'tags.text': reg_exp, team: req.params.team}, {'tags': true}).exec(function (err, medias) {
        var _tags = {}, tags = [];
        for (var i = 0; i < medias.length; i = i + 1) {
            for (var j = 0; j < medias[i].tags.length; j = j + 1) {
                if (reg_exp.test(medias[i].tags[j].text)) {
                    //to avoid duplicates
                    _tags[medias[i].tags[j].text] = true;
                }
            }
        }
        for (i in _tags) {
            tags.push(i);
        }
        
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the medias'
            });
        }
        res.json(tags);
    });
};