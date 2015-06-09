'use strict';

var settings = require('../controllers/settings');

// Setting authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.setting.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Settings, app, auth) {

    app.route('/settings')
        .post(auth.requiresLogin, settings.create);

    app.route('/settings/:settingId')
        .get(auth.isMongoId, settings.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.update);
    
    // Finish with setting up the settingId param
    app.param('settingId', settings.setting);
};
