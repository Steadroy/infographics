'use strict';

angular.module('mean.settings')
        .filter('parseDom', function (parseFilter) {
            return function (input, type) {
                var output = '';
                if(input){
                    if(type){
                        if(typeof type === 'string') type = [type];
                        for(var i = 0; i < type.length; i = i + 1)
                            output += parseFilter(input.configuration[type[i]]);
                    }
                    else{
                        output += parseFilter(input.configuration);
                        output += parseFilter(input.configuration.background);
                        //output += parseFilter(input.configuration.border);
                        //output += parseFilter(input.configuration.font);
                        //output += parseFilter(input.configuration.overwrite);
                    }
                }
                return output;
            };
        });