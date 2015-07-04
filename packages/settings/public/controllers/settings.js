'use strict';

angular.module('mean.settings', ['colorpicker.module'])
    .controller('SettingsController', ['$scope', '$rootScope', '$timeout', '$location', 'Global', 'Teams', 'Settings',
        function ($scope, $rootScope, $timeout, $location, Global, Teams, Settings) { 
            $scope.global = Global;
            $rootScope.tabs = {colours:false, fonts:false, borders:false, overlays: false, members:false};
            $rootScope.actives = {colours: '', fonts:'', borders:'', overlays:'', members: ''};
            
            $scope.update = function (isValid, newName) {
                if (isValid) {
                    var settings = $scope.global.teamActive.settings;
                    $scope.global.teamActive.$update(function(team){ 
                        $scope.global.teamActive.settings = settings;
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.clone = function(){
                if ($scope.teams.length < $scope.constants.max.teams) {
                    var new_team = angular.copy($scope.global.teamActive);
                    new_team.name = new_team.name + ' [Clone]';
                    delete new_team._id; 
                    delete new_team.settings._id; 
                    
                    new_team.settings.$save(function(settings){
                        new_team.settings = settings._id;
                        new_team.$save(function(response){
                            $scope.teams.push(response);
                            $scope.changeTeamActive(response);
                        });
                    });
                }
            };
            
            /* Used in the other controllers */
            $rootScope.scroll = function(id, anchor){
                $timeout(function () {
                    var container = angular.element('#' + id), scrollTo = angular.element('#' + anchor);
                    if(container.length && scrollTo.length)
                        container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
                }, 0, false);
            };
            
            $rootScope.open = function(tab, subtab){
                for(var i in $rootScope.tabs){
                    $rootScope.tabs[i] = (tab === i);
                }
                if(subtab){
                    $rootScope.changeSubtabActive('colours', subtab);
                }
            };
            
            $rootScope.changeSubtabActive = function(tab, active){
                $rootScope.actives[tab] = active;
            };
            
            $rootScope.open('colours');
        }
    ])
    .controller('ColoursController', ['$scope', '$rootScope', 'Global', 'Colour',
        function ($scope, $rootScope, Global, Colour) {
            $scope.global = Global;
            $scope.coloursUsage = ['backgrounds', 'fonts', 'borders', 'overlays'];
            $scope.newColour = '';
            
            $scope.create = function(usage, newColour){
                if(newColour){
                    new Colour({hex: newColour}).$save(function(colour){
                        $scope.global.teamActive.settings.colours[usage].push(colour._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                        });
                    });
                }
            };
            
            $scope.update = function(colour){ 
                new Colour(colour).$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            
            $scope.remove = function(colour){ 
                new Colour(colour).$remove(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            
            $scope.$watch('global.teamActive.settings', function(){
                if($scope.global.teamActive && $scope.global.teamActive._id){
                    $scope.changeSubtabActive('colours', $scope.coloursUsage[0]);
                }
            });
        }
    ])
    .controller('FontsController', ['$scope', '$rootScope', '$stateParams', '$timeout', '$location', 'Global', 'Font',
        function ($scope, $rootScope, $stateParams, $timeout, $location, Global, Font) {
            var sizes = Array.apply(null, new Array(21)).map(function(i, j) { return 10 + j + 'px'; });
            
            $scope.global = Global;
            $scope.font = {};

            $scope.buttonGroups = [[{
                    style: 'font_weight',
                    default: 'normal',
                    highlight: 'bold',
                    icon: 'fa-bold'
                }, {
                    style: 'font_style',
                    default: 'normal',
                    highlight: 'italic',
                    icon: 'fa-italic'
                }, {
                    style: 'text_decoration',
                    default: 'none',
                    highlight: 'underline',
                    icon: 'fa-underline'
                }, {
                    style: 'text_transform',
                    default: 'none',
                    highlight: 'uppercase',
                    icon: 'fa-text-height'
                }
            ], [{
                    style: 'text_align',
                    default: 'left',
                    highlight: 'left',
                    icon: 'fa-align-left'
                }, {
                    style: 'text_align',
                    default: 'left',
                    highlight: 'center',
                    icon: 'fa-align-center'
                }, {
                    style: 'text_align',
                    default: 'left',
                    highlight: 'right',
                    icon: 'fa-align-right'
                }, {
                    style: 'text_align',
                    default: 'left',
                    highlight: 'justify',
                    icon: 'fa-align-justify'
                }
            ], [{
                    style: 'vertical_align',
                    default: 'top',
                    highlight: 'top',
                    extra: 'top',
                    icon: 'fa-minus'
                }, {
                    style: 'vertical_align',
                    default: 'top',
                    highlight: 'middle',
                    extra: 'middle',
                    icon: 'fa-minus'
                }, {
                    style: 'vertical_align',
                    default: 'top',
                    highlight: 'bottom',
                    extra: 'bottom',
                    icon: 'fa-minus'
                }
            ]]; 
            $scope.buttonGroup2 = [{
                style: 'font_family',
                    options: [
                        'Arial, Helvetica, sans-serif',
                        '"Arial Black", Gadget, sans-serif',
                        'Impact, Charcoal, sans-serif',
                        '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                        'Tahoma, Geneva, sans-serif',
                        'Verdana, Geneva, sans-serif',
                        '"Courier New", Courier, monospace',
                        '"Lucida Console", Monaco, monospace',
                        'Georgia, serif',
                        '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        '"Times New Roman", Times, serif'
                    ]
                }, {
                    style: 'font_size',
                    options: sizes
                }, {
                    style: 'color',
                    options: 'colours.fonts'
            }];
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.fonts.length < $scope.constants.max.fonts) {
                    var name = $scope.font.name;
                    $scope.font.name = '';
                    
                    new Font({name: name, color: $scope.global.teamActive.settings.colours.fonts[0]._id}).$save(function(font){
                        $scope.global.teamActive.settings.fonts.push(font._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('fonts', font._id);
                        });
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $scope.remove = function(font){ 
                new Font(font).$remove(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                    if(font._id === $scope.actives.fonts && $scope.global.teamActive.settings.fonts.length){
                        $scope.changeSubtabActive('fonts', $scope.global.teamActive.settings.fonts[0]._id);
                    }
                });
            };
            $scope.update = function(font){ 
                new Font(font).$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $scope.clone = function(font){
                if($scope.global.teamActive.settings.fonts.length < $scope.constants.max.fonts){
                    var _new = angular.extend({}, font);
                    delete _new._id;
                    _new.color = font.color._id;
                    _new.name = font.name + ' [Clone]';
                    
                    new Font(_new).$save(function(_new){
                        $scope.global.teamActive.settings.fonts.push(_new._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('fonts', _new._id);
                        });
                    });
                }
            };
            $scope.toggleValue = function(_font, button, state){
                var font = new Font(_font);
                
                font[button.style] = state ? button.default : button.highlight;
                font.$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $scope.change = function(_font, style, option){
                var font = new Font(_font);

                font[style] = (style === 'color' ? option._id : option);
                
                font.$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $timeout(function () {
                if($scope.global.teamActive.settings.fonts.length)
                    $scope.changeSubtabActive('fonts', $scope.global.teamActive.settings.fonts[0]._id);
            }, 500, false);
        }
    ])
    .controller('BordersController', ['$scope', '$rootScope', '$stateParams', '$timeout', '$location', 'Global', 'Border',
        function ($scope, $rootScope, $stateParams, $timeout, $location, Global, Border) {
            var widths = Array.apply(null, new Array(6)).map(function(i, j) { return j; }),
                radius = Array.apply(null, new Array(11)).map(function(i, j) { return (10*j); });
            $scope.global = Global;
            $scope.border = {};
            $scope.buttonGroup = [{
                    style: 'border_style',
                    options: ['dashed', 'dotted', 'solid', 'none']
                }, {
                    style: 'border_top_width',
                    options: widths
                }, {
                    style: 'border_right_width',
                    options: widths
                }, {
                    style: 'border_bottom_width',
                    options: widths
                }, {
                    style: 'border_left_width',
                    options: widths
                }, {
                    style: 'border_color',
                    options: 'colours.borders'
                }, {
                    style: 'border_radius',
                    options: radius
                }];
            
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.borders.length < $scope.constants.max.borders) {
                    var name = $scope.border.name;
                    $scope.border.name = '';
                    
                    new Border({name: name, border_color: $scope.global.teamActive.settings.colours.borders[0]._id}).$save(function(border){
                        $scope.global.teamActive.settings.borders.push(border._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('borders', border._id);
                        });
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $scope.remove = function(border){ 
                new Border(border).$remove(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                    if(border._id === $scope.actives.borders && $scope.global.teamActive.settings.borders.length){
                        $scope.changeSubtabActive('borders', $scope.global.teamActive.settings.borders[0]._id);
                    }
                });
            };
            $scope.update = function(border){ 
                new Border(border).$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $scope.clone = function(border){
                if($scope.global.teamActive.settings.borders.length < $scope.constants.max.borders){
                    var _new = angular.extend({}, border);
                    delete _new._id;
                    _new.border_color = border.border_color._id;
                    _new.name = border.name + ' [Clone]';
                    
                    new Border(_new).$save(function(_new){
                        $scope.global.teamActive.settings.borders.push(_new._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('borders', _new._id);
                        });
                    });
                }
            };
            $scope.change = function(_border, style, option){
                var border = new Border(_border);
                
                border[style] = (style === 'border_color' ? option._id : option);
                
                border.$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $timeout(function () {
                if($scope.global.teamActive.settings.borders.length)
                    $scope.changeSubtabActive('borders', $scope.global.teamActive.settings.borders[0]._id);
            }, 500, false);
        }
    ])
    .controller('OverlaysController', ['$scope', '$rootScope', '$stateParams', '$timeout', '$location', 'Global', 'Overlay',
        function ($scope, $rootScope, $stateParams, $timeout, $location, Global, Overlay) {
            $scope.global = Global;
            $scope.overlay = {};
            
            $scope.buttonGroup = [{
                style: 'type',
                options: [0, 1, 2, 3, 4, 5]
            }, {
                style: 'color_0',
                options: 'colours.overlays'
            }, {
                style: 'color_1', 
                options: 'colours.overlays'
            }];
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.overlays.length < $scope.constants.max.overlays) {
                    var name = $scope.overlay.name;
                    $scope.overlay.name = '';

                    new Overlay({name: name, color_0: $scope.global.teamActive.settings.colours.overlays[0]._id, color_1: $scope.global.teamActive.settings.colours.overlays.length > 1 ? $scope.global.teamActive.settings.colours.overlays[1]._id: $scope.global.teamActive.settings.colours.overlays[0]._id}).$save(function(overlay){
                        $scope.global.teamActive.settings.overlays.push(overlay._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('overlays', overlay._id);
                        });
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $scope.remove = function(overlay){ 
                new Overlay(overlay).$remove(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                    if(overlay._id === $scope.actives.overlays && $scope.global.teamActive.settings.overlays.length){
                        $scope.changeSubtabActive('overlays', $scope.global.teamActive.settings.overlays[0]._id);
                    }
                });
            };
            $scope.update = function(overlay){ 
                new Overlay(overlay).$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $scope.clone = function(overlay){
                if($scope.global.teamActive.settings.overlays.length < $scope.constants.max.overlays){
                    var _new = angular.extend({}, overlay);
                    delete _new._id;
                    _new.color_0 = overlay.color_0._id;
                    _new.color_1 = overlay.color_1._id;
                    _new.name = overlay.name + ' [Clone]';
                    
                    new Overlay(_new).$save(function(_new){
                        $scope.global.teamActive.settings.overlays.push(_new._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                            $scope.changeSubtabActive('overlays', _new._id);
                        });
                    });
                }
            };
            $scope.change = function(_overlay, style, option){
                var overlay = new Overlay(_overlay);
                
                overlay[style] = (style === 'overlay_0' || style === 'overlay_1' ? option._id : option);
                
                overlay.$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            $timeout(function () {
                if($scope.global.teamActive.settings.overlays.length)
                    $scope.changeSubtabActive('overlays', $scope.global.teamActive.settings.overlays[0]._id);
            }, 500, false);
        }
    ]);