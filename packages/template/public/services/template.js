'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings')
    .factory('Template', ['$resource',
        function ($resource) {
            return $resource('template/:templateId', {
                templateId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                },
                remove: {
                    method: 'DELETE'
                },
                get: {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);