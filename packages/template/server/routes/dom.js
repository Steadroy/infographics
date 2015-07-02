'use strict';

var dom = require('../controllers/dom');

// Dom authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.dom.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Dom, app, auth) {

    app.route('/dom')
        .get(auth.isMongoId, dom.dom)
        .post(auth.isMongoId, auth.requiresLogin, dom.create);

    app.route('/dom/:domId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, dom.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, dom.destroy);
    
    // Finish with dom up the domId param
    app.param('domId', dom.dom);
};
