'use strict';

angular.module('mean.settings')
        .filter('pretify', function () {
            return function (input) {
                var output = '';
                switch (input) {
                    case 'backgrounds':
                        output = 'Plain Backgrounds';
                        break;
                    case 'fonts':
                        output = 'Fonts';
                        break;
                    case 'borders':
                        output = 'Borders';
                        break;
                    case 'overlays':
                        output = 'Overlays';
                        break;
                    default:
                        return input;
                }
                return output + ' Colours';
            };
        })
        .filter('mapOverlayTypes', function () {
            return function (input) {
                switch(+input){
                    case 0: return 'Slash 1';
                    case 1: return 'Slash 2';
                    case 2: return 'Slash 1 & 2';
                    case 3: return 'Horizontal';
                    case 4: return 'Vertical';
                    default: return 'Horizontal & Vertical';
                }
            };
        });