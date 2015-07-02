'use strict';

//Settings service used for template REST endpoint
angular.module('mean.template')
    .factory('Background', ['$resource',
        function ($resource) {
            return $resource('background/:backgroundId', {
                backgroundId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                },
                remove: {
                    method: 'DELETE'
                }
            });
        }
    ]);
