'use strict';

var mongoose = require('mongoose'),
    Infographic = mongoose.model('Infographic'),
    Media = mongoose.model('Media'),
    populate = [
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

exports.render = function (req, res) {
    Infographic
        .findById(req.params.id)
        .where({ready: true})
        .deepPopulate(populate)
        .exec(function (err, infographic) {
            if (err){
                res.render('500', {error: 'Oops something went wrong'});
            }
            else if (!infographic){
                res.render('404', {error: 'Not found'});
            }    
            else{
                res.render('iframe', {
                    infographic: infographic,
                    id: infographic._id
                });
            }
        });
};
exports.getMedia = function (req, res) {
    console.log(req.params);
    Media
        .findById(req.params.id)
        .exec(function(err, media){
            res.json(media); 
        });
};