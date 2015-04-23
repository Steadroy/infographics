'use strict';

angular.module('mean.settings', ['colorpicker.module'])
    .controller('SettingsController', ['$scope', '$stateParams', '$timeout', '$location', 'Global', 'Teams', 'Settings',
        function ($scope, $stateParams, $timeout, $location, Global, Teams, Settings) { 
            $scope.global = Global;
            
            $scope.update = function (isValid, newName) {
                if (isValid) {
                    var settings = $scope.global.teamActive.settings;
                    $scope.global.teamActive.$update(function(team){ 
                        $scope.global.teamActive.settings = settings;
                        angular.element('#team_name').blur();
                    });
                } else {
                    $scope.submitted = true;
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
        }
    ])
    .controller('ColoursController', ['$scope', '$stateParams', 'Global',
        function ($scope, $stateParams, Global) {
            $scope.global = Global;
            $scope.coloursUsage = ['backgrounds', 'texts', 'borders_frames'];
            $scope.newColour = '';
            $scope.coloursActive = $scope.coloursUsage[0];
            
            $scope.addNewColour = function(usage, newColour){
                if(newColour){
                    $scope.global.teamActive.settings.colours[usage].push(newColour.toUpperCase());
                    $scope.global.teamActive.settings.$update(function(a){ });
                }
            };
            
            $scope.editColour = function(usage, index, newColour){ 
                $scope.global.teamActive.settings.colours[usage][index] = newColour;
                $scope.global.teamActive.settings.$update(function(a){  });
            };
            
            $scope.removeColour = function(usage, index, colour){ 
                $scope.global.teamActive.settings.colours[usage].splice(index, 1);
                $scope.global.teamActive.settings.$update(function(a){ });
            };
            
            $scope.changeColoursActive = function(usage){
                $scope.coloursActive = usage;
            };
        }
    ])
    .controller('TextsController', ['$scope', '$stateParams', '$timeout', '$location', 'Global',
        function ($scope, $stateParams, $timeout, $location, Global) {
            var sizes = Array.apply(null, new Array(21)).map(function(i, j) { return 10 + j + 'px'; });
            $scope.global = Global;
            $scope.text = {};
            $scope.textActive = '';

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
                    options: 'colours.texts'
            }];
            };
            
            $scope.create = function (isValid) {
                if (isValid) {
                    var name = $scope.text.name;
                    $scope.text.name = '';
                    $scope.global.teamActive.settings.texts.push({name: name, style: {color: $scope.global.teamActive.settings.colours.texts[0]}});
                    $scope.global.teamActive.settings.$update(function(a){ 
                        $scope.loadButtonGroup2();
                        $scope.changeTextActive(name);
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $scope.remove = function (text) {
                if (text) {
                    var found = -1, refocus = false;
                    
                    for(var i in $scope.global.teamActive.settings.texts){
                        if($scope.global.teamActive.settings.texts[i] === text){
                            $scope.global.teamActive.settings.texts.splice(i, 1);
                            refocus = text.name === $scope.textActive;
                            found = i;
                        }
                    }
                    if(found >= 0){
                        $scope.global.teamActive.settings.$update(function(a){ 
                            if(refocus && $scope.global.teamActive.settings.texts.length){
                                $scope.changeTextActive($scope.global.teamActive.settings.texts[found].name);
                            }
                        });
                    }
                }
            };
            
            $scope.update = function (isValid, newName, index) {
                if (isValid) {
                    $scope.global.teamActive.settings.texts[index].name = newName;
                    $scope.textActive = newName;
                    $scope.global.teamActive.settings.$update(function(a){ 
                        angular.element('#text_name' + index).blur();
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.changeTextActive = function (text){
                $scope.textActive = text;
            };
            
            $scope.toggleValue = function(style, text_idx, group_idx, style_idx, state, active){
                var value = 0;
                if(state){
                    value = $scope.buttonGroups[group_idx][style_idx].default;
                }
                else{
                    value = $scope.buttonGroups[group_idx][style_idx].highlight;
                }
                $scope.global.teamActive.settings.texts[text_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeTextActive(active);
                });
            };
            
            $scope.change = function(value, style, text_idx, active){ 
                $scope.global.teamActive.settings.texts[text_idx].style[style] = value;
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeTextActive(active);
                });
            };
            
            $scope.scroll = function(id, anchor){
                $timeout(function () {
                    var container = angular.element('#' + id), scrollTo = angular.element('#' + anchor);
                    container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
                }, 0, false);
            };
            
            $scope.clone = function(i){
                var new_text = angular.copy($scope.global.teamActive.settings.texts[i]);
                new_text.name = new_text.name + ' [Clone]';
                delete new_text._id; 
                
                $scope.global.teamActive.settings.texts.push(new_text);
                $scope.global.teamActive.settings.$update(function(a){ 
                    $scope.changeTextActive(new_text.name);
                });
            };
            
            $scope.init = function(){
                $timeout(function () {
                    if($scope.global.teamActive){
                        if($scope.global.teamActive.settings.texts.length){
                            $scope.changeTextActive($scope.global.teamActive.settings.texts[0].name); 
                            $scope.loadButtonGroup2();
                        }
                    } else{
                        $location.url('/');
                        $scope.$apply();
                    }
                }, 500, false);
            };
        }
    ]);
