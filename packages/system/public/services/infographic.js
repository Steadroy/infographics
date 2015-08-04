'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.system')
    .factory('Infographic', ['$resource',
        function ($resource) {
            return $resource('infographic/:infographicId', {
                infographicId: '@_id'
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
                },
                tags: {
                    method: 'GET', 
                    url: 'infographic-tags/:team/:query', 
                    isArray: true 
                }
            });
        }
    ]);