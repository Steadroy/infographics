'use strict';

//Media service used for media REST endpoint
angular.module('mean.media')
        .factory('Media', ['$resource',
            function ($resource) {
                return $resource('media/:mediaId', {
                    mediaId: '@_id'
                }, {
                    update: {
                        method: 'POST'
                    }
                });
            }
        ])
        .factory('Media', ['$resource',
            function ($resource) {
                return $resource(
                        'media/:teamId',
                        {teamId: '@_id'},
                        {
                            'query': {method: 'GET', isArray: true },
                            'tags': {method: 'GET', url:'tags/:query', isArray: true }
                        }
                );
            }
        ]);
