'use strict';

var iframe = require('../controller/iframe');

module.exports = function (Iframe, app, auth, database) {
    app.route('/iframe/:id')
        .get(iframe.render);
    app.route('/imedia/:id')
        .get(iframe.getMedia);
};
