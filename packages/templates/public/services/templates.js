'use strict';

//Templates service used for templates REST endpoint
angular.module('mean.templates').factory('Templates', ['$resource',
    function ($resource) {
        return $resource('templates/:templateId', {
            templateId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
