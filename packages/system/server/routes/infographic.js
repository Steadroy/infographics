'use strict';

var infographic = require('../controllers/infographic');

// Element authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.infographic.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Element, app, auth) {
    
    app.route('/infographic')
        .get(auth.isMongoId, infographic.get)
        .post(auth.isMongoId, auth.requiresLogin, infographic.create);

    app.route('/infographic/:infographicId') 
        .post(auth.isMongoId, auth.requiresLogin, infographic.create) //clone
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, infographic.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, infographic.destroy);

    app.route('/infographic/poster/:teamId/:infographicId')
        .get(infographic.poster);

    app.route('/get/:infographicId') 
        .get(auth.isMongoId, infographic.show);

    // Tags
    app.route('/infographic-tags/:team/:query')
        .get(auth.requiresLogin, hasAuthorization, infographic.getTags); 

    // Finish with infographic up the infographicId param
    app.param('infographicId', infographic.infographic);
};