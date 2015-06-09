'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Media = mongoose.model('Media'),
    _ = require('lodash'),
    fs = require('fs'),
    config = require('meanio').loadConfig(),
    mkdirOrig = fs.mkdir,
    osSep = '/';

/**
 * Find media by id
 */
exports.media = function (req, res, next, id) {
    Media.load(id, function (err, media) {
        if (err)
            return next(err);
        if (!media)
            return next(new Error('Failed to load media ' + id));
        req.media = media;
        next();
    });
};

/**
 * Create a media
 */
exports.create = function (req, res) {
    var media = new Media(req.body)/*,
        ffmpeg = require('fluent-ffmpeg')*/;
    
    media.filetype = req.body.type.indexOf('image')>=0 ? 'image' : 'video';
    media.type = req.body.type;
    media.creator = req.user;
    media.alt = req.body.name + ' [alt text]';
    /*
    if(media.filetype === 'video'){
        ffmpeg(config.root + media.path)
            .thumbnail({
                count: 1,
                timemarks: ['1'],
                filename: config.root + media.path + '.png',
                size: '100x100' 
            });
        media.poster = media.path + '.png';
    }
    */
    media.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the media'
            });
        }
        res.json(media);
    });
};

/**
 * Update a media
 */
exports.update = function (req, res) {
    var media = req.media;
    
    media = _.extend(media, req.body);
    
    media.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the media'
            });
        }
        res.json(media);
    });
};

/**
 * Show a media
 */
exports.show = function (req, res) {
    var img = fs.readFileSync(config.root + req.media.path);
    res.writeHead(200, {'Content-Type': req.media.type });
    res.end(img, 'binary');
};


/**
 * Delete a tam
 */
exports.destroy = function (req, res) {
    var media = req.media;
    
    media.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the media'
            });
        }
        fs.unlink(config.root + media.path);
        res.json(media);
    });
};

/**
 * List of Medias
 */
exports.get = function (req, res) {
    Media.find({team: req.team._id}).sort('created').exec(function (err, medias) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the medias'
            });
        }
        res.json(medias);
    });
};

/**
 * List of Medias
 */
exports.getTags = function (req, res) {
    res.json([[{ text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }, { text: 'Tag4' }]]);
};



/* Upload */
function rename(file, dest, user, callback) {
    fs.rename(file.path, config.root + dest + file.name, function(err) {
        if (err) throw err;
        else
            callback({
                success: true,
                file: {
                    src: dest + file.name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    created: Date.now(),
                    createor: (user) ? {
                        id: user.id,
                        name: user.name
                    } : {}
                }
            });
    });
}

function mkdir_p(path, callback, position) {
    var parts = require('path').normalize(path).split(osSep);

    position = position || 0;

    if (position >= parts.length) {
        return callback();
    }

    var directory = parts.slice(0, position + 1).join(osSep) || osSep;
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, callback, position + 1);
        } else {
            mkdirOrig(directory, function(err) {
                if (err && err.code !== 'EEXIST') {
                    return callback(err);
                } else {
                    mkdir_p(path, callback, position + 1);
                }
            });
        }
    });
}

exports.upload = function(req, res) {
    var path = config.root + req.body.dest;
    if (!fs.existsSync(path)) {
        mkdir_p(path, function(err) {
            rename(req.files.file, req.body.dest, req.user, function(data) {
                res.jsonp(data);
            });
        });
    } else {
        rename(req.files.file, req.body.dest, req.user, function(data) {
            res.jsonp(data);
        });
    }
};