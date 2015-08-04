'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.system')
    .factory('Iframe', ['$resource',
        function ($resource) {
            return $resource('/get/:id', {
                id: '@_id'
            }, {
                get: {
                    method: 'GET'
                }
            });
        }
    ])
    .factory('IMedia', ['$resource',
        function ($resource) {
            return $resource('/imedia/:id', {
                id: '@_id'
            });
        }
    ]);