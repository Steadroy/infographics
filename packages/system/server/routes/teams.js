'use strict';

var teams = require('../controllers/teams');

// Team authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};
//belong to the team: find designer and find journalists

module.exports = function (Teams, app, auth) {
    app.route('/teams')
        .get(teams.get)
        .post(auth.requiresLogin, teams.create);
    
    app.route('/teams/:teamId')
        .get(auth.isMongoId, teams.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, teams.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, teams.destroy);
    
    // Finish with setting up the teamId param
    app.param('teamId', teams.team);
};
