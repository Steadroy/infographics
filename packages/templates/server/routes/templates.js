'use strict';

var templates = require('../controllers/templates');

// Template authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.template.user.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Templates, app, auth) {

    app.route('/templates')
        .get(templates.all)
        .post(auth.requiresLogin, templates.create);
    
    app.route('/templates/:templateId')
        .get(auth.isMongoId, templates.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, templates.destroy);

    // Finish with setting up the templateId param
    app.param('templateId', templates.template);
};
