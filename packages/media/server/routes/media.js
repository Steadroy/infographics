'use strict';

var media = require('../controllers/media');

// Media authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.media.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Media, app, auth) {
    app.route('/media/:teamId')
        .get(auth.isMongoId, auth.requiresLogin, media.get);

    app.route('/media')
        .post(auth.requiresLogin, media.create);

    app.route('/media/:mediaId')
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, media.destroy)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, media.update)
        .post(auth.isMongoId, auth.requiresLogin, hasAuthorization, media.update);
    
    app.route('/static')
        .get(media.show);

    app.route('/static/:mediaId')
        .get(media.show);

    app.route('/static/:mediaId/:video')
        .get(media.show);
    
    // Upload
    var multipart = require('connect-multiparty'),
        multipartMiddleware = multipart();

    app.route('/upload')
        .post(multipartMiddleware, media.upload);

    // Tags
    app.route('/tags/:team/:query')
        .get(multipartMiddleware, media.getTags);

    // Finish with media up the mediaId param
    app.param('mediaId', media.media);
};
