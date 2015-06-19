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
            
            $scope.init = function(){
                $timeout(function () {
                    if(!$scope.global.teamActive){
                        $location.url('/');
                        $scope.$apply();
                    }
                }, 0, false);
            }; 
            
            /* Used in the other controllers */
            $rootScope.scroll = function(id, anchor){
                $timeout(function () {
                    var container = angular.element('#' + id), scrollTo = angular.element('#' + anchor);
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
            
            $rootScope.remove = function (element, key) {
                if (element) {
                    var found = -1, refocus = false;
                    
                    for(var i in $scope.global.teamActive.settings[key]){
                        if($scope.global.teamActive.settings[key][i] === element){
                            $scope.global.teamActive.settings[key].splice(i, 1);
                            refocus = element.name === $scope.actives[key];
                            found = i;
                        }
                    }
                    if(found >= 0){
                        $scope.global.teamActive.settings.$update(function(a){ 
                            if(refocus && $scope.global.teamActive.settings[key].length){
                                $scope.changeSubtabActive(key, $scope.global.teamActive.settings[key][found > $scope.global.teamActive.settings[key].length - 1 ? found - 1: found].name);
                            }
                        });
                    }
                }
            };
            
            $rootScope.updateElementName = function (key, isValid, newName, index) {
                if (isValid) {
                    $scope.global.teamActive.settings[key][index].name = newName;
                    $scope.changeSubtabActive(key, newName);
                    $scope.global.teamActive.settings.$update(function(a){ 
                        angular.element('#' + key + '_name' + index).blur();
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $rootScope.cloneElement = function(key, i){
                if($scope.global.teamActive.settings[key].length < $scope.constants.max[key]){
                    var new_element = angular.copy($scope.global.teamActive.settings[key][i]);
                    new_element.name = new_element.name + ' [Clone]';
                    delete new_element._id; 

                    $scope.global.teamActive.settings[key].push(new_element);
                    $scope.global.teamActive.settings.$update(function(a){ 
                        $scope.changeSubtabActive(key, new_element.name);
                    });
                }
            };
            $rootScope.changeElementStyle = function(key, value, style, border_idx, active){ 
                $scope.global.teamActive.settings[key][border_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeSubtabActive(key, active);
                });
            };
            
            $rootScope.open('colours');
        }
    ])
    .controller('ColoursController', ['$scope', '$rootScope', 'Global', 'Colour',
        function ($scope, $rootScope, Global, Colour) {
            $scope.global = Global;
            $scope.coloursUsage = ['backgrounds', 'fonts', 'borders', 'overlays'];
            $scope.newColour = '';
            
            $scope.addNewColour = function(usage, newColour){
                if(newColour){
                    new Colour({hex: newColour}).$save(function(colour){
                        $scope.global.teamActive.settings.colours[usage].push(colour._id);
                        $scope.global.teamActive.settings.$update(function(settings){ 
                            $scope.global.teamActive.settings = settings;
                        });
                    });
                }
            };
            
            $scope.editColour = function(colour){ 
                new Colour(colour).$update(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            
            $scope.removeColour = function(usage, colour){ 
                new Colour(colour).$remove(function(){ 
                    $rootScope.changeTeamActive($scope.global.teamActive);
                });
            };
            
            $scope.init = function(){
                $scope.changeSubtabActive('colours', $scope.coloursUsage[0]);
            };
        }
    ])
    .controller('FontsController', ['$scope', '$stateParams', '$timeout', '$location', 'Global',
        function ($scope, $stateParams, $timeout, $location, Global) {
            var sizes = Array.apply(null, new Array(21)).map(function(i, j) { return 10 + j + 'px'; });
            $scope.global = Global;
            $scope.font = {};

            $scope.buttonGroups = [[{
                    style: 'font-weight',
                    default: 'normal',
                    highlight: 'bold',
                    icon: 'fa-bold'
                }, {
                    style: 'font-style',
                    default: 'normal',
                    highlight: 'italic',
                    icon: 'fa-italic'
                }, {
                    style: 'text-decoration',
                    default: 'none',
                    highlight: 'underline',
                    icon: 'fa-underline'
                }, {
                    style: 'text-transform',
                    default: 'none',
                    highlight: 'uppercase',
                    icon: 'fa-text-height'
                }
            ], [{
                    style: 'text-align',
                    default: 'left',
                    highlight: 'left',
                    icon: 'fa-align-left'
                }, {
                    style: 'text-align',
                    default: 'left',
                    highlight: 'center',
                    icon: 'fa-align-center'
                }, {
                    style: 'text-align',
                    default: 'left',
                    highlight: 'right',
                    icon: 'fa-align-right'
                }, {
                    style: 'text-align',
                    default: 'left',
                    highlight: 'justify',
                    icon: 'fa-align-justify'
                }
            ]]; 
        
            $scope.loadButtonGroup2 = function(){
                $scope.buttonGroup2 = [{
                        style: 'font-family',
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
                        style: 'font-size',
                        options: sizes
                    }, {
                        style: 'color',
                        //it's here because of this
                        options: 'colours.fonts'
                }];
            };
            
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.fonts.length < $scope.constants.max.fonts) {
                    var name = $scope.font.name;
                    $scope.font.name = '';
                    $scope.global.teamActive.settings.fonts.push({name: name, style: {color: $scope.global.teamActive.settings.colours.fonts[0]}});
                    $scope.global.teamActive.settings.$update(function(a){ 
                        $scope.loadButtonGroup2();
                        $scope.changeSubtabActive('fonts', name);
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.update = function (isValid, newName, index) {
                if (isValid) {
                    $scope.global.teamActive.settings.fonts[index].name = newName;
                    $scope.changeSubtabActive('fonts', newName);
                    $scope.global.teamActive.settings.$update(function(a){ 
                        angular.element('#font_name' + index).blur();
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.toggleValue = function(style, font_idx, group_idx, style_idx, state, active){
                var value = 0;
                if(state){
                    value = $scope.buttonGroups[group_idx][style_idx].default;
                }
                else{
                    value = $scope.buttonGroups[group_idx][style_idx].highlight;
                }
                $scope.global.teamActive.settings.fonts[font_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeSubtabActive('fonts', active);
                });
            };
            
            $scope.init = function(){
                $timeout(function () {
                    if($scope.global.teamActive.settings.fonts.length){
                        $scope.changeSubtabActive('fonts', $scope.global.teamActive.settings.fonts[0].name);
                        $scope.loadButtonGroup2();
                    }
                }, 500, false);
            };
        }
    ])
    .controller('BordersController', ['$scope', '$stateParams', '$timeout', '$location', 'Global',
        function ($scope, $stateParams, $timeout, $location, Global) {
            var widths = Array.apply(null, new Array(6)).map(function(i, j) { return j + 'px'; }),
                radius = Array.apply(null, new Array(11)).map(function(i, j) { return (10*j) + '%'; });
            $scope.global = Global;
            $scope.border = {};
            
            $scope.loadButtonGroup = function(){
                $scope.buttonGroup = [{
                    style: 'border-style',
                    options: ['dashed', 'dotted', 'solid', 'none']
                }, {
                    style: 'border-width',
                    options: widths
                }, {
                    style: 'border-color',
                    //it's here because of this
                    options: 'colours.borders'
                }, {
                    style: 'border-radius',
                    options: radius
                }];
            };
            
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.borders.length < $scope.constants.max.borders) {
                    var name = $scope.border.name;
                    $scope.border.name = '';
                    $scope.global.teamActive.settings.borders.push({name: name, style: {'border-color': $scope.global.teamActive.settings.colours.borders[0]}});
                    $scope.global.teamActive.settings.$update(function(a){ 
                        $scope.loadButtonGroup();
                        $scope.changeSubtabActive('borders', name);
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.toggleValue = function(style, border_idx, group_idx, style_idx, state, active){
                var value = 0;
                if(state){
                    value = $scope.buttonGroups[group_idx][style_idx].default;
                }
                else{
                    value = $scope.buttonGroups[group_idx][style_idx].highlight;
                }
                $scope.global.teamActive.settings.borders[border_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeSubtabActive('borders', active);
                });
            };
            
            $scope.init = function(){
                $timeout(function () {
                    if($scope.global.teamActive.settings.borders.length){
                        $scope.changeSubtabActive('borders', $scope.global.teamActive.settings.borders[0].name); 
                        $scope.loadButtonGroup();
                    }
                }, 500, false);
            };
        }
    ])
    .controller('OverlaysController', ['$scope', '$stateParams', '$timeout', '$location', 'Global',
        function ($scope, $stateParams, $timeout, $location, Global) {
            $scope.global = Global;
            $scope.overlay = {};
            
            $scope.loadButtonGroup = function(){
                $scope.buttonGroup = [{
                    style: 'type',
                    options: [0, 1, 2, 3, 4, 5]
                }, {
                    style: 'color0',
                    options: 'colours.overlays'
                }, {
                    style: 'color1', 
                    options: 'colours.overlays'
                }];
            };
            
            $scope.create = function (isValid) { 
                if (isValid && $scope.global.teamActive.settings.overlays.length < $scope.constants.max.overlays) {
                    var name = $scope.overlay.name;
                    $scope.overlay.name = '';
                    $scope.global.teamActive.settings.overlays.push({name: name, style: {'color0': $scope.global.teamActive.settings.colours.overlays[0], 'color1': $scope.global.teamActive.settings.colours.overlays.length > 0 ? $scope.global.teamActive.settings.colours.overlays[1]: $scope.global.teamActive.settings.colours.overlays[0]}});
                    $scope.global.teamActive.settings.$update(function(a){ 
                        $scope.loadButtonGroup();
                        $scope.changeSubtabActive('overlays', name);
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.toggleValue = function(style, overlay_idx, group_idx, style_idx, state, active){
                var value = 0;
                if(state){
                    value = $scope.buttonGroups[group_idx][style_idx].default;
                }
                else{
                    value = $scope.buttonGroups[group_idx][style_idx].highlight;
                }
                $scope.global.teamActive.settings.overlays[overlay_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeSubtabActive('overlays', active);
                });
            };
            
            $scope.init = function(){
                $timeout(function () {
                    if($scope.global.teamActive.settings.overlays.length){
                        $scope.changeSubtabActive('overlays', $scope.global.teamActive.settings.overlays[0].name); 
                        $scope.loadButtonGroup();
                    }
                }, 500, false);
            };
        }
    ]);