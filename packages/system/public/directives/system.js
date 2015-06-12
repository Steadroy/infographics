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
    })
    .directive('scroll', function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind('scroll', function () {
                if (this.pageYOffset >= 50) {
                    angular.element('body > header.navbar').addClass('translucent');
                } else {
                    angular.element('body > header.navbar').removeClass('translucent');
                }
                scope.$apply();
            });
        };
    });