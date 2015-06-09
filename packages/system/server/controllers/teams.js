'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Team = mongoose.model('Team'),
    _ = require('lodash');


/**
 * Find team by id
 */
exports.team = function (req, res, next, id) {
    Team.load(id, function (err, team) {
        if (err)
            return next(err);
        if (!team)
            return next(new Error('Failed to load team ' + id));
        req.team = team;
        next();
    });
};

/**
 * Create a team
 */
exports.create = function (req, res) {
    var team = new Team(req.body);
    team.creator = req.user;
    
    team.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the team'
            });
        }
        res.json(team);
    });
};


/**
 * Delete a team
 */
exports.destroy = function (req, res) {
    var team = req.team;
    
    team.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the team'
            });
        }
        res.json(team);
    });
};

/**
 * Update a team
 */
exports.update = function (req, res) {
    var team = req.team;
    req.body.settings = (typeof req.body.settings === 'object' ? req.body.settings._id : req.body.settings);
    team = _.extend(team, req.body);
    
    team.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the team'
            });
        }
        res.json(team);
    });
};

/**
 * Show a team
 */
exports.show = function (req, res) {
    res.json(req.team);
};

/**
 * List of Teams
 */
exports.get = function (req, res) {
    Team.find().sort('-created').exec(function (err, teams) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the teams'
            });
        }
        res.json(teams);
    });
};
