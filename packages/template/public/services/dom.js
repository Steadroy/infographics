'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings')
    .factory('Overlay', ['$resource',
        function ($resource) {
            return $resource('overlay/:overlayId', {
                overlayId: '@_id'
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
