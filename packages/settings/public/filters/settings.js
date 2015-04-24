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
                    case 'borders_frames':
                        output = 'Borders and Frames';
                        break;
                    default:
                        return input;
                }
                return output + ' Colours';
            };
        })
        .filter('toRGBA', function () {
            return function (colour) { //hex, alpha
                if(typeof colour === 'string' || !colour){
                    return colour;
                }
                try{
                    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, 
                        hex = colour.hex;
                    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                        return r + r + g + g + b + b;
                    });
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

                    if(result && colour.alpha >=0 && colour.alpha <= 1){
                        return 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ',' + colour.alpha + ')';
                    }
                    else{
                        return colour.hex;
                    }
                } catch(e){
                    return colour;
                }
            };
        });