'use strict';

//Templates service used for templates REST endpoint
angular.module('mean.templates')
        .factory('Templates', ['$resource',
            function ($resource) {
                return $resource('templates/:templatesId', {
                    templatesId: '@_id'
                }, {
                    update: {
                        method: 'POST'
                    }
                });
            }
        ])
        .factory('Templates', ['$resource',
            function ($resource) {
                return $resource(
                        'templates/:teamId',
                        {teamId: '@_id'},
                        {
                            'query': {method: 'GET', isArray: true }
                        }
                );
            }
        ]);
