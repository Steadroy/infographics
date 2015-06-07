'use strict';

//Settings service used for settings REST endpoint
angular.module('mean.settings').factory('Settings', ['$resource',
    function ($resource) {
        return $resource('settings/:settingId', {
            settingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
