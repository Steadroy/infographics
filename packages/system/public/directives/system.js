'use strict';

angular.module('mean.system')
    .directive('overlayStyle', function ($compile, toRGBAFilter) {
        return {
            replace: true,   
            restrict: 'E',
            transclude: true,
            scope: {
                overlay: '=overlay'
            },
            templateUrl: '/system/views/overlay-style.html'
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