'use strict';

angular.module('mean.system')
    .directive('overlayStyle', function ($compile, toRGBAFilter) {
        return {
            restrict: 'E',
            link: function ($scope, element, attrs) {
                var html = '<style>.' + attrs.overlay + '.overlay.type_' + attrs.type + ':before,.' + attrs.overlay + '.overlay.type_' + attrs.type + ':after{background:' + toRGBAFilter(angular.fromJson(attrs.colour0)) + '}.' + attrs.overlay + ' .inner-overlay.type_' + attrs.type + ':before,.' + attrs.overlay + ' .inner-overlay.type_' + attrs.type + ':after{background:' + toRGBAFilter(angular.fromJson(attrs.colour1)) + '}</style>';
                $compile(html)($scope);
                element.html(html);
            }
        };
    });