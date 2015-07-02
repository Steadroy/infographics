'use strict';

//Settings service used for template REST endpoint
angular.module('mean.template')
    .factory('Configuration', ['$resource',
        function ($resource) {
            return $resource('configuration/:configurationId', {
                configurationId: '@_id'
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
