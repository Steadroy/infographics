'use strict';

angular.module('mean.settings')
        .filter('parseDom', function (parseFilter) {
            return function (input) {
                var output = '';
                if(input){
                    output += parseFilter(input.configuration);
                    output += parseFilter(input.configuration.background);
                    /*
                    output += parseFilter(input.configuration.font);
                    output += parseFilter(input.configuration.border);
                    */
                }
                return output;
            };
        });