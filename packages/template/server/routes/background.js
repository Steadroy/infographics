'use strict';

var font = require('../controllers/font');

// Font authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.font.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Font, app, auth) {

    app.route('/font')
        .get(auth.isMongoId, font.font)
        .post(auth.isMongoId, auth.requiresLogin, font.create);

    app.route('/font/:fontId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, font.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, font.destroy);
    
    // Finish with font up the fontId param
    app.param('fontId', font.font);
};
