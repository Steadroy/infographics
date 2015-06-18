'use strict';

angular.module('mean.system')
    .filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(new RegExp('([^\W_]+[^\s-]*) *', all ? 'g': ''), function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        };
    })
    .filter('range', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i = i + 1)
                input.push(i);
            return input;
        };
    })
    .filter('fromCharCode', function () {
        return function (code) {
            return String.fromCharCode(parseInt(code));
        };
    })
    .filter('parse', function (toRGBAFilter) {
        return function (style) {
            var output = '';
            for (var i in style) {
                output = output + i + ':' + (typeof style[i] === 'string' ? style[i] : toRGBAFilter(style[i])) + ';';
            }
            return output;
        };
    })
    .filter('clean', function () {
        return function (text, fallback) {
            var _clean = function(text){ 
                return text.toLowerCase().replace(/\[|\-|\||\&|\;|\$|\%|\@|\"|<|>|\(|\)|\+|\,|\]|\s|\#/g, ''); 
            };
            return typeof text === 'string' ? _clean(text) : (fallback ? _clean(fallback) : text); 
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