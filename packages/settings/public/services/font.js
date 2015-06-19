'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings')
    .factory('Font', ['$resource',
        function ($resource) {
            return $resource('font/:fontId', {
                fontId: '@_id'
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
