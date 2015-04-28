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
    });