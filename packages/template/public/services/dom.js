'use strict';

//Settings service used for template REST endpoint
angular.module('mean.template')
    .factory('Dom', ['$resource',
        function ($resource) {
            return $resource('dom/:domId', {
                domId: '@_id'
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
