'use strict';

angular.module('mean.system').factory('Teams', ['$resource',
    function ($resource) {
        return $resource('teams/:teamId', {
            teamId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
