'use strict';

angular.module('mean.template') 
    .directive('domElement', function (Global, $window) {
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
                var grid = 5;
                return {
                    post: function(scope, elem, attributes, controller){
                        scope.global = Global;
                        scope.placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed gravida felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rhoncus rhoncus sapien non tristique. Curabitur in tristique mauris. Mauris libero sapien, auctor at elementum lacinia, finibus nec ligula. Praesent congue lectus eu rhoncus auctor. Praesent congue venenatis sem eu venenatis. Aenean nec lectus et enim tincidunt sagittis. Fusce felis mi, tincidunt non fermentum ac, luctus interdum nisi. Donec rutrum fermentum urna, sit amet cursus lacus ornare id.';

                        elem
                            .resizable({ 
                                grid: grid,
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
                                    grid: [grid, grid],
                                    snap: '.dom-element',
                                    snapTolerance: grid,
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
                        $window.onkeydown = function($event){
                            if(scope.$parent.active_dom && scope.$parent.active_dom.parent_dom_id){
                                var original = {top: scope.$parent.active_dom.configuration.top, left: scope.$parent.active_dom.configuration.left, width: scope.$parent.active_dom.configuration.width, height: scope.$parent.active_dom.configuration.height}, 
                                    position = {top: scope.$parent.active_dom.configuration.top, left: scope.$parent.active_dom.configuration.left}, 
                                    update = false,
                                    code = $event.keyCode || $event.which,
                                    $parent = angular.element(scope.$parent.active_dom.parent_dom_id),
                                    parent = $parent.position();
                                parent.width = $parent.width();
                                parent.height = $parent.height();

                                switch(code){
                                    case 37: //left arrow
                                        if(original.left - grid >= parent.left){
                                            update = true;
                                            position.left =  position.left - grid;
                                        }
                                        break;
                                    case 38: //up arrow
                                        if(original.top - grid >= parent.top){
                                            update = true;
                                            position.top =  position.top - grid;
                                        }
                                        break;
                                    case 39: //right arrow
                                        if(original.left + original.width + grid <= parent.left + parent.width){
                                            update = true;
                                            position.left =  position.left + grid;
                                        }
                                        break;
                                    case 40: //down arrow
                                        if(original.top + original.height + grid <= parent.top + parent.height){
                                            update = true;
                                            position.top =  position.top + grid;
                                        }
                                        break;
                                    case 8: //delete
                                        scope.$apply(function () {
                                            if (scope.$parent.removeDom) {
                                                scope.$parent.removeDom(scope.$parent.active_dom);
                                            }
                                            $event.stopPropagation();
                                            $event.preventDefault();
                                        });
                                        break;
                                }
                                if(update){
                                    scope.$apply(function () {
                                        if (scope.onDrag) {
                                            scope.onDrag({$evt: $event, $ui: {position: position}, dom: scope.$parent.active_dom});
                                        }
                                        if (scope.onDragStop) {
                                            console.log(position);
                                            console.log(original);
                                            scope.onDragStop({$evt: $event, $ui: {position: position, originalPosition: original}, dom: scope.$parent.active_dom});
                                        }
                                        $event.stopPropagation();
                                        $event.preventDefault();
                                    });
                                }
                            }
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