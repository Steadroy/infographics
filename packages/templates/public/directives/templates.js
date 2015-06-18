'use strict';

angular.module('mean.templates')
    .directive('templateStep', function () {
        return {
            restrict: 'E',
            scope: {
                template: '=template',
                callback: '&onResize'
            },
            templateUrl: function (elem, attr) {
                return 'templates/views/templates-step-' + attr.step + '.html';
            }
        };
    })
    .directive('elementSettings', function () {
        return {
            restrict: 'E',
            scope: {
                active: '=active'
            },
            templateUrl: function (elem, attr) {
                return 'templates/views/element-settings.html';
            }
        };
    })
    .directive('resizable', function () {
        return {
            restrict: 'A',
            scope: {
                onResize: '&onResize',
                onResizeStop: '&onResizeStop'
            },
            link: function postLink(scope, elem, attrs) {
                var handles = [];
                if(attrs.handlerEast === 'true'){
                    handles.push('e');
                }
                if(attrs.handlerSouth === 'true'){
                    handles.push('s');
                }
                if(attrs.handlerEast === 'true' && attrs.handlerSouth === 'true' && attrs.handlerSouthEast === 'true'){
                    handles.push('se');
                }
                if(handles.length){
                    elem
                        .resizable({ grid: (attrs.grid ? attrs.grid : 10), handles: handles.join(',')})
                        .on('resize', function (evt, ui) {
                            scope.$apply(function () {
                                if (scope.onResize) {
                                    scope.onResize({$evt: evt, $ui: ui});
                                }
                            });
                        })
                        .on('resizestop', function (evt, ui) {
                            if (scope.onResizeStop) {
                                scope.onResizeStop({$evt: evt, $ui: ui});
                            }
                        });
                }
            }
        };
    })/*
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $timeout(function () {
                    elem.resizable({ 
                        grid: 10, 
                        autoHide: true,
                        handles: 'e, s'// + scope.$last === false
                    });
                });
            }
        };
    })*/;