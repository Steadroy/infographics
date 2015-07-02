'use strict';

var background = require('../controllers/background');

// Background authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.background.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Background, app, auth) {

    app.route('/background')
        .get(auth.isMongoId, background.background)
        .post(auth.isMongoId, auth.requiresLogin, background.create);

    app.route('/background/:backgroundId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, background.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, background.destroy);
    
    // Finish with background up the backgroundId param
    app.param('backgroundId', background.background);
};
