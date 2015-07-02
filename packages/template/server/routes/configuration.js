'use strict';

var configuration = require('../controllers/configuration');

// Configuration authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.configuration.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Configuration, app, auth) {

    app.route('/configuration')
        .get(auth.isMongoId, configuration.configuration)
        .post(auth.isMongoId, auth.requiresLogin, configuration.create);

    app.route('/configuration/:configurationId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, configuration.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, configuration.destroy);
    
    // Finish with configuration up the configurationId param
    app.param('configurationId', configuration.configuration);
};
