'use strict';

var mean = require('meanio');

module.exports = function (System, app, auth, database) {

    // Home route
    var index = require('../controllers/index');
    app.route('/')
            .get(index.render);

    app.route('/logo/:teamId/:logoId')
            .get(index.logo);
    app.route('/logo/:teamId')
            .get(index.logo);

    app.get('/*', function (req, res, next) {
        res.header('workerID', JSON.stringify(mean.options.workerid));
        next(); // http://expressjs.com/guide.html#passing-route control
    });
};
