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
    var media = new Media(req.body);
    
    media.poster = req.body.poster;
    media.type = req.body.type;
    media.creator = req.user;
    media.alt = req.body.name + ' [alt text]';
    media.filetype = req.body.type.indexOf('image')>=0 ? 'image' : 'video';
    
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
    if(req.media){
        var intervalID = setInterval(function(){
            try{
                var img = fs.readFileSync(config.root + ((req.media.filetype === 'video' && req.params.video) || (req.media.filetype === 'image')? req.media.path : req.media.poster));
                res.writeHead(200, {'Content-Type': req.media.type});
                res.end(img, 'binary');
                clearInterval(intervalID);
            } catch(err){ }
        }, 750);
    }
    else{
        var img = fs.readFileSync(config.root + '/upload/transparent.png');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(img, 'binary');
    }
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
        
        if(media.filetype === 'video'){
            fs.unlink(config.root + media.poster);
        }
        res.json(media);
    });
};

/**
 * List of Medias
 */
exports.get = function (req, res) {
    var query = {team: req.team._id};
    
    if(req.params.filetype !== 'all'){
        query.filetype = req.params.filetype;
    }
    
    Media.find(query).sort('created').exec(function (err, medias) {
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
    var reg_exp = new RegExp('.*' + req.params.query + '.*', 'i');
    Media.find({'tags.text': reg_exp, team: req.params.team}, {'tags': true}).exec(function (err, medias) {
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



/* Upload */
function rename(req, file, dest, user, callback) {
    var file_name = new Date().getTime();
    fs.rename(file.path, config.root + dest + file_name, function(err) {
        if (err) throw err;
        else{
            var poster = '';
            
            if(file.type.indexOf('video') >= 0){
                var ffmpeg = require('fluent-ffmpeg'),
                    poster_name = file_name + '.png';

                ffmpeg(config.root + dest + file_name)
                    .thumbnail({count: 1, timemarks: ['1'], filename: poster_name}, config.root + dest);
            
                poster = dest + poster_name;
            }
            
            if(req.body.delete){
                var previous_path = config.root + dest + req.body.delete;
                
                fs.exists(previous_path, function (exists) {
                    if (exists) {
                        fs.unlink(previous_path);
                    }
                });
            }
            
            callback({
                success: true,
                file: {
                    filename: file_name,
                    src: dest + file_name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    poster: poster,
                    created: Date.now(),
                    createor: (user) ? {
                        id: user.id,
                        name: user.name
                    } : {}
                }
            });
        }
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
            rename(req, req.files.file, req.body.dest, req.user, function(data) {
                res.jsonp(data);
            });
        });
    } else {
        rename(req, req.files.file, req.body.dest, req.user, function(data) {
            res.jsonp(data);
        });
    }
};