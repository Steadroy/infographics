'use strict';

var template = require('../controllers/template');

// Element authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.template.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Element, app, auth) {
    
    app.route('/template')
        .get(auth.isMongoId, template.get)
        .post(auth.isMongoId, auth.requiresLogin, template.create);

    app.route('/template/:templateId')
        .post(auth.isMongoId, auth.requiresLogin, template.create) //clone
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, template.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, template.destroy);

    app.route('/poster/:teamId/:templateId')
            .get(template.poster);

    // Finish with template up the templateId param
    app.param('templateId', template.template);
};