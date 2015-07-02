'use strict';

angular.module('mean.template') 
    .directive('domElement', function (Global, $timeout, $compile) {
        return {
            restrict: 'E',
            scope: {
                dom: '=dom',
                onResize: '&onResize',
                onResizeStop: '&onResizeStop',
                onDrag: '&onDrag',
                onDragStop: '&onDragStop'
            },
            replace: true,
            compile: function(elem, attributes){
                return {
                    post: function(scope, elem, attributes, controller){
                        scope.global = Global;
                        scope.placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed gravida felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rhoncus rhoncus sapien non tristique. Curabitur in tristique mauris. Mauris libero sapien, auctor at elementum lacinia, finibus nec ligula. Praesent congue lectus eu rhoncus auctor. Praesent congue venenatis sem eu venenatis. Aenean nec lectus et enim tincidunt sagittis. Fusce felis mi, tincidunt non fermentum ac, luctus interdum nisi. Donec rutrum fermentum urna, sit amet cursus lacus ornare id.';

                        elem
                            .resizable({ 
                                grid: 5,
                                handles: scope.dom.parent_dom_id ? 'all' : 'e, s, se',
                                containment: scope.dom.parent_dom_id ? scope.dom.parent_dom_id : '.template'
                            })
                            .on('resize', function (evt, ui) {
                                scope.$apply(function () {
                                    if (scope.onResize) {
                                        scope.onResize({$evt: evt, $ui: ui, dom: scope.dom});
                                    }
                                });
                            }) 
                            .on('resizestop', function (evt, ui) {
                                scope.$apply(function () {
                                    if (scope.onResizeStop) {
                                        scope.onResizeStop({$evt: evt, $ui: ui, dom: scope.dom});
                                    }
                                });
                            });

                        if(scope.dom.parent_dom_id){
                            elem
                                .draggable({ 
                                    grid: [5, 5],
                                    snap: '.dom-element',
                                    snapTolerance: 5,
                                    containment: scope.dom.parent_dom_id
                                })
                                .on('drag', function(evt, ui){
                                    scope.$apply(function () {
                                        if (scope.onDrag) {
                                            scope.onDrag({$evt: evt, $ui: ui, dom: scope.dom});
                                        }
                                    });
                                })
                                .on('dragstop', function(evt, ui){
                                    scope.$apply(function () {
                                        if (scope.onDragStop) {
                                            scope.onDragStop({$evt: evt, $ui: ui, dom: scope.dom});
                                        }
                                    });
                                });
                        }

                        scope.localResizeStop = function(){
                            scope.onResizeStop({$evt: null, $ui: null, dom: scope.dom});
                        };
                        scope.localToggle = function(){
                            scope.$parent.toggle(scope.dom);
                        };
                        scope.parseInt = function(str){
                            return parseInt(str);
                        };
                    }
                };
            },
            templateUrl: 'template/views/dom-element.html'
        };
    })
    .directive('domSettings', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'DomSettingsController',
            templateUrl: 'template/views/dom-settings.html'
        };
    });