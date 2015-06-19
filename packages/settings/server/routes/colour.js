'use strict';

var colour = require('../controllers/colour');

// Colour authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin && req.colour.team.creator.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (Colour, app, auth) {

    app.route('/colour')
        .get(auth.isMongoId, colour.colour)
        .post(auth.isMongoId, auth.requiresLogin, colour.create);

    app.route('/colour/:colourId')
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, colour.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, colour.destroy);
    
    // Finish with colour up the colourId param
    app.param('colourId', colour.colour);
};
