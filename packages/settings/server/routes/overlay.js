'use strict';

var overlay = require('../controllers/overlay');

// Overlay authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.overlay.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Overlay, app, auth) {

    app.route('/overlay')
        .get(auth.isMongoId, overlay.overlay)
        .post(auth.isMongoId, auth.requiresLogin, overlay.create);

    app.route('/overlay/:overlayId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, overlay.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, overlay.destroy);
    
    // Finish with overlay up the overlayId param
    app.param('overlayId', overlay.overlay);
};
