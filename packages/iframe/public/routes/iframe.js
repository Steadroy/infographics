'use strict';

//Setting up route
angular.module('mean.iframe').config(['$stateProvider',
    function ($stateProvider) {
        // states for my app
        $stateProvider
            .state('see iframe', {
                url: '/iframe/:id',
                templateUrl: 'iframe/views/iframe.html'
            })
            .state('see infographic content', {
                url: '/iframe/system/views/index.html',
                templateUrl: 'iframe/views/content.html'
            });
    }
]);
