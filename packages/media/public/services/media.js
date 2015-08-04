'use strict';

//Media service used for media REST endpoint
angular.module('mean.media')
        .factory('Media', ['$resource',
            function ($resource) {
                return $resource(
                        '/media/:teamId/:filetype',
                        {teamId: '@_id', filetype: '@_filetype'},
                        {
                            'query': {method: 'GET', isArray: true },
                            'tags': {method: 'GET', url:'media-tags/:team/:query', isArray: true }
                        }
                );
            }
        ]);
