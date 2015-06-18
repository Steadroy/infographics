'use strict';

angular.module('mean.templates', [])
    .controller('TemplatesController', ['$scope', '$timeout', '$location', 'Global', 'Templates',
        function ($scope, $timeout, $location, Global, Templates) {
            $scope.global = Global;
            $scope.global.togglePanel = false;
            
            $scope.init = function () {
                $timeout(function () {
                    if (!$scope.global.teamActive) {
                        $location.url('/');
                        $scope.$apply();                            
                    }
                }, 0, false);
            };

            $scope.$watch('global.teamActive._id', function(){
                $scope.search_query = '';
                $scope.templates = [];
                
                $scope.currentStep = 1;
                $scope.totalSteps = 3;
                
                Templates.query({teamId: $scope.global.teamActive._id}, function (templates) {
                    $scope.templates = templates;
                    if ($scope.templates.length > 0) {
                        $scope.active = $scope.templates[0];
                    }
                });
            });

            $scope.select = function(template) {
                $scope.active = template;
            };
            
            $scope.create = function(isValid){
                if (isValid) {
                    new Templates({name: $scope.template_name, team: $scope.global.teamActive._id}).$save(function(response){
                        $scope.templates.push(response);
                        $scope.active = response;
                        $scope.template_name = '';
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.remove = function(template){
                template.$remove(function(response){
                    for(var i = 0; i < $scope.templates.length; i = i + 1){
                        if($scope.templates[i] === response){
                            $scope.templates.splice(i, 1);
                        }
                    }
                    if(response === $scope.active && $scope.templates.length){
                        $scope.active = $scope.templates[0];
                    }
                    if(!$scope.templates.length){
                        $scope.active = null;
                    }
                });
            };
            
            $scope.pageChanged = function(){
                $scope.global.togglePanel = false;
            };
        }
    ])
    .controller('ElementSettingsController', ['$scope', '$timeout', '$location', 'Global', 'Media',
        function ($scope, $timeout, $location, Global, Media) {
            $scope.global = Global;
            
            $scope.$watch('global.teamActive._id', function(){
                $scope.search_query_media = '';
                $scope.mediaFiles = [];
                $scope.config = {
                    'background_settings': {
                        'background_repeat': ['no-repeat', 'repeat-x', 'repeat-y', 'repeat'],
                        'background_size': ['contain', 'cover', 'inherit', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                        'background_position': [
                                'left top',
                                'center top',
                                'right top',

                                'left center',
                                'center center',
                                'right center',

                                'left bottom',
                                'center bottom',
                                'right bottom'
                            ]
                    }
                };
                Media.query({teamId: $scope.global.teamActive._id, filetype: 'image'}, function (media_files) {
                    $scope.mediaFiles = media_files;
                });
            });
            $scope.selectColour = function(colour){ 
                if($scope.active.config.background.background_color.hex === colour.hex && $scope.active.config.background.background_color.alpha === colour.alpha){
                    $scope.active.config.background.background_color.hex = 'inherit';
                    $scope.active.config.background.background_color.alpha = 1;
                }
                else{
                    $scope.active.config.background.background_color = colour;
                }
                $scope.active.$save();
            };
            $scope.selectImage = function(image){ 
                if($scope.active.config.background.background_image === image._id){
                    $scope.active.config.background.background_image = 'none';
                    $scope.active.config.background.background_repeat = 'none';
                    $scope.active.config.background.background_position = 'center center';
                }
                else{
                    $scope.active.config.background.background_image = image._id;
                }
                $scope.active.$save();
            };
            $scope.changeSetting = function(setting, key, value){
                if(setting === 'border' || setting === 'overlay'){ 
                    $scope.active.config[setting] = value;
                }
                else{
                    $scope.active.config[setting][key] = value;
                }
                $scope.active.$save();
            };
        }])
    .controller('TemplatesStep1Controller', ['$scope', '$timeout', '$location', 'Global', 'Templates',
        function ($scope, $timeout, $location, Global, Templates) {
            $scope.global = Global;
            $scope.global.togglePanel = false;
            
            $scope.toggle = function($event){
                $scope.global.togglePanel = !$scope.global.togglePanel;
            };
            $scope.resize = function (evt, ui) {
                var template = $scope.template;
                
                template.config.height = ui.size.height + 2;
                template.config.width = ui.size.width + 2;
            };
            $scope.resizeStop = function (evt, ui) {
                $scope.template.$save(function(){ });
            };
        }
    ])
    .controller('TemplatesStep2Controller', ['$scope', '$timeout', '$location', 'Global', 'Templates',
        function ($scope, $timeout, $location, Global, Templates) {
            $scope.global = Global;
            $scope.global.togglePanel = false;
            
            $scope.$watch('template', function(){
                $timeout(function () {
                    $scope.grid_width = $scope.template.config.grid_horizontal.length;
                    $scope.grid_height = $scope.template.config.grid_vertical.length;
                }, 500, false);
            });
            $scope.resize = function (evt, ui, i, j) {
                var template = $scope.template, diff, perc; 
                if(ui.originalSize.width !== ui.size.width){
                    perc = 100 * ui.size.width / template.config.width;
                    diff = template.config.grid_horizontal[i] - perc;
                    template.config.grid_horizontal[i] = perc;
                    template.config.grid_horizontal[i+1] = template.config.grid_horizontal[i+1] + diff;
                }
                if(ui.originalSize.height !== ui.size.height){
                    perc = 100 * ui.size.height / template.config.height;
                    diff = template.config.grid_vertical[j] - perc;
                    template.config.grid_vertical[j] = perc;
                    template.config.grid_vertical[j+1] = template.config.grid_vertical[j+1] + diff;
                }
            };
            $scope.resizeStop = function (evt, ui) {
                $scope.template.$save(function(){ });
            };
            $scope.changeGrid = function(){
                if($scope.grid_width !== $scope.template.config.grid_horizontal.length){
                    $scope.template.config.grid_horizontal = Array.apply(null, new Array(+$scope.grid_width)).map(function(i, j) { return 100/$scope.grid_width; });
                }
                if($scope.grid_height !== $scope.template.config.grid_vertical.length){
                    $scope.template.config.grid_vertical = Array.apply(null, new Array(+$scope.grid_height)).map(function(i, j) { return 100/$scope.grid_height; });
                }
                $scope.template.$save(function(){ });
            };
        }
    ])
    .controller('TemplatesStep3Controller', ['$scope', '$timeout', '$location', 'Global', 'Templates',
        function ($scope, $timeout, $location, Global, Templates) {

        }
    ]);