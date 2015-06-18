'use strict';

var templates = require('../controllers/templates');

// Media authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.templates.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Media, app, auth) {
    app.route('/templates/:teamId')
        .get(auth.isMongoId, auth.requiresLogin, templates.get);

    app.route('/templates')
        .post(auth.requiresLogin, hasAuthorization, templates.create);

    app.route('/templates/:templatesId')
        .get(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.get)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.destroy)
        .post(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.update)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.update);
    
    // Finish with templates up the templatesId param
    app.param('templatesId', templates.template);
};
