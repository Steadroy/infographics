'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Setting = mongoose.model('Setting'),
    //Templates = mongoose.model('Templates'),
    _ = require('lodash');


/**
 * Find setting by id
 */
exports.setting = function (req, res, next, id) {
    Setting.load(id, function (err, setting) {
        if (err)
            return next(err);
        if (!setting)
            return next(new Error('Failed to load setting ' + id));
        req.setting = setting;
        next();
    });
};

/**
 * Create a setting
 */
exports.create = function (req, res) {
    var setting = new Setting(req.body);
    
    setting.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the setting'
            });
        }
        res.json(setting);
    });
};

/*
function updateTemplate(req, res, colour_old, colour_new){
    Templates.update(
            {'config.background.background_color.hex': colour_old.hex, 'config.background.background_color.alpha': colour_old.alpha}, 
            {$set: {config: {background: {background_color: {hex: colour_new.hex, alpha: colour_new.alpha}}}}}, 
        function(err, resp){
            console.log(err);
            console.log(resp);
        });
}
*/

/**
 * Update a setting
 */
exports.update = function (req, res) {
    var setting = req.setting;
    
    for(var i in setting.colours){
        for (var j = 0; j < setting.colours[i].length; j = j + 1) {
            if(setting.colours[i][j].hex !== req.body.colours[i][j].hex || +setting.colours[i][j].alpha !== +req.body.colours[i][j].alpha){
                if(req.body[i]){
                    for (var k = 0; k < req.body[i].length; k = k + 1){
                        switch(i){
                            case 'fonts':
                                if(req.body[i][k].style.color.hex === setting.colours[i][j].hex && +req.body[i][k].style.color.alpha === +setting.colours[i][j].alpha){
                                    req.body[i][k].style.color = req.body.colours[i][j];
                                }
                                break;
                            case 'borders':
                                if(req.body[i][k].style['border-color'].hex === setting.colours[i][j].hex && +req.body[i][k].style['border-color'].alpha === +setting.colours[i][j].alpha){
                                    req.body[i][k].style['border-color'] = req.body.colours[i][j];
                                }
                                break;
                            case 'overlays':
                                if(req.body[i][k].style.color0.hex === setting.colours[i][j].hex && +req.body[i][k].style.color0.alpha === +setting.colours[i][j].alpha){
                                    req.body[i][k].style.color0 = req.body.colours[i][j];
                                }
                                else{
                                    req.body[i][k].style.color1 = req.body.colours[i][j];
                                }
                                break;

                        }
                    }
                }
                //updateTemplate(req, res, setting.colours[i][j], req.body.colours[i][j]);
            }
        }
    }
    
    setting = _.extend(setting, req.body);
    
    setting.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the setting'
            });
        }
        res.json(setting);
    });
};

/**
 * Show a setting
 */
exports.show = function (req, res) {
    res.json(req.setting);
};

/**
 * List of Settings
 */
exports.get = function (req, res) {
    Setting.find().sort('-created').exec(function (err, settings) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the settings'
            });
        }
        res.json(settings);
    });
};
