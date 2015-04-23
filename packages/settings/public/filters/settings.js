'use strict';

angular.module('mean.settings')
    .filter('pretify', function () {
        return function (input) {
            var output = '';
            switch (input){
                case 'backgrounds': output = 'Plain Backgrounds'; break;
                case 'fonts': output = 'Fonts'; break;
                case 'borders_frames': output = 'Borders and Frames'; break;
                default: return input;
            }
            return output + ' Colours';
        };
    });