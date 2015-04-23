'use strict';

//Setting up route
angular.module('mean.templates').config(['$stateProvider',
    function ($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function ($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function (user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('all templates', {
                url: '/templates',
                templateUrl: 'templates/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create template', {
                url: '/templates/create',
                templateUrl: 'templates/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit template', {
                url: '/templates/:templateId/edit',
                templateUrl: 'templates/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('template by id', {
                url: '/templates/:templateId',
                templateUrl: 'templates/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
