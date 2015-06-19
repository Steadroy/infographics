'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings')
    .factory('Border', ['$resource',
        function ($resource) {
            return $resource('border/:borderId', {
                borderId: '@_id'
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
