'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings')
    .factory('Colour', ['$resource',
        function ($resource) {
            return $resource('colour/:colourId', {
                colourId: '@_id'
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
