'use strict';

var border = require('../controllers/border');

// Border authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.border.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Border, app, auth) {
    app.route('/border')
        .get(auth.isMongoId, border.border)
        .post(auth.isMongoId, auth.requiresLogin, border.create);

    app.route('/border/:borderId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, border.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, border.destroy);
    
    // Finish with border up the borderId param
    app.param('borderId', border.border);
};
