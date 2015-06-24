'use strict';

var mean = require('meanio'),
    fs = require('fs'),
    config = require('meanio').loadConfig();

exports.render = function (req, res) {

    var modules = [];
    // Preparing angular modules list with dependencies
    for (var name in mean.modules) {
        modules.push({
            name: name,
            module: 'mean.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }

    function isAdmin() {
        return req.user && req.user.roles.indexOf('admin') !== -1;
    }

    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? {
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            profile: req.user.profile,
            roles: req.user.roles
        } : {},
        modules: modules,
        isAdmin: isAdmin,
        adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
    });
};

exports.logo = function (req, res) {
    if (req.team) {
        var intervalID = setInterval(function () {
            try {
                var img = fs.readFileSync(config.root + '/upload/' + req.team._id + '/' + req.team.logo);
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