'use strict';

angular.module('mean.template', [])
    .controller('TemplateController', ['$scope', 'Global', 'Template', 'Configuration', 'Dom',
        function ($scope, Global, Template, Configuration, Dom) {
            $scope.global = Global;
            $scope.active = {};
            
            $scope.$watch('global.teamActive._id', function(){
                $scope.active_dom = null;
                $scope.search_query = '';
                $scope.template = [];
                
                Template.get({teamId: $scope.global.teamActive._id}, function (template) {
                    $scope.template = template;
                    if ($scope.template.length > 0) {
                        $scope.active = $scope.template[0];
                    }
                });
            });

            $scope.select = function(template) {
                $scope.active = template;
                $scope.active_dom = null;
            };
            
            $scope.create = function(isValid){
                if (isValid) {
                    new Template({name: $scope.template_name, team: $scope.global.teamActive._id}).$save(function(template){
                        $scope.template.push(template);
                        $scope.active = template;
                        $scope.template_name = '';
                        $scope.active_dom = null;
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $scope.remove = function(template){
                template.$remove(function(response){
                    for(var i = 0; i < $scope.template.length; i = i + 1){
                        if($scope.template[i] === response){
                            $scope.template.splice(i, 1);
                        }
                    }
                    if(response === $scope.active && $scope.template.length){
                        $scope.active = $scope.template[0];
                    }
                    if(!$scope.template.length){
                        $scope.active = {};
                    }
                });
            };
            $scope.update = function(template){ 
                new Template(template).$update(function(){ });
            };
            $scope.clone = function(template){
                new Template(template).$save({clone: true}, function(new_template){
                    $scope.template.push(new_template);
                });
            };
            $scope.resize = function (evt, ui, dom) {
                dom.configuration.height = ui.size.height;
                dom.configuration.width = ui.size.width;
            };
            $scope.resizeStop = function (evt, ui, dom) {
                new Configuration(dom.configuration).$update(function(){});
            };
            $scope.drag = function (evt, ui, dom) {
                dom.configuration.top = ui.position.top; 
                dom.configuration.left = ui.position.left;
            };
            $scope.dragStop = function (evt, ui, dom) {
                new Configuration(dom.configuration).$update(function(){});
            };
            $scope.toggle = function(dom){
                if(!$scope.active_dom){
                    $scope.active_dom = dom;
                }
                else{
                    $scope.active_dom = null;
                }
            };
            $scope.toggle = function(dom){
                if($scope.active_dom && dom._id === $scope.active_dom._id){
                    $scope.active_dom = null;
                }
                else{
                    $scope.active_dom = dom;
                }
            };
            $scope.removeDom = function(dom){
                for(var i = 0; i < $scope.active.doms.length; i = i + 1){
                    if($scope.active.doms[i] === dom){
                        new Dom(dom).$remove();
                        $scope.active.doms.splice(i, 1);
                    }
                }
                $scope.active_dom = null;
            };
        }
    ])
    .controller('DomSettingsController', ['$scope', 'Global', 'Dom', 'Media', 'Template', 'Configuration', 'Background', 
        function ($scope, Global, Dom, Media, Template, Configuration, Background) {
            $scope.global = Global;
            $scope.configuration = null;
            
            $scope.$watch('global.teamActive._id', function(){
                $scope.search_query_media = '';
                $scope.mediaFiles = [];
                $scope.config = {
                    'logo_position': [
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right'
                    ],
                    'background_settings': {
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
                            ],
                        'background_repeat': ['no-repeat', 'repeat-x', 'repeat-y', 'repeat'],
                        'background_size': ['contain', 'cover', 'inherit', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                        'background_color': $scope.global.teamActive.settings.colours.backgrounds
                    }
                };
                Media.query({teamId: $scope.global.teamActive._id, filetype: 'image'}, function (media_files) {
                    $scope.mediaFiles = media_files;
                });
            });
            $scope.selectImage = function(image){ 
                var background = new Background($scope.active_dom.configuration.background);
                
                if(background.background_image === image._id){
                    background.background_image = 'none';
                    background.background_repeat = 'no-repeat';
                    background.background_position = 'center center';
                    background.background_size = 'inherit';
                }
                else{
                    background.background_image = image._id;
                }
                background.$update(function(response){
                    $scope.active_dom.configuration.background = response;
                });
            };
            $scope.changeSetting = function(setting, key, value){
                if(setting === 'background'){
                    var background = new Background($scope.active_dom.configuration.background);
                    
                    background[key] = typeof value === 'string' || !value ? value : value._id;
                    
                    background.$update(function(response){
                        $scope.active_dom.configuration.background = response;
                    });
                }
                else if(['logo_position', 'font', 'border', 'overlay'].indexOf(setting) >= 0){
                    var configuration = new Configuration($scope.active_dom.configuration);
                    
                    configuration[setting] = typeof value === 'string' || !value ? value : value._id;
                    configuration.$update(function(response){
                        $scope.active_dom.configuration = response;
                    });
                }
            };
            
            $scope.addDom = function(type, _id){
                var active_temp = $scope.active_dom,
                    dom = new Dom({type: type, parent_dom_id:active_temp.dom_id}),
                    getDimension = function (number) {
                        var grid = 5.0, value;
                        if (number > 0)
                            value = Math.ceil(number / grid) * grid;
                        else if (number < 0)
                            value = Math.floor(number / grid) * grid;
                        else
                            value = grid;
                        return parseInt(value);
                    };
                
                
                dom.$save(function(dom){
                    $scope.active.doms.push(dom);
                    new Template($scope.active).$update(function(template){ 
                        $scope.active = template;
                        var configuration = new Configuration(dom.configuration);
                        configuration.height = getDimension(active_temp.configuration.height / 2);
                        configuration.width = getDimension(active_temp.configuration.width / 2);
                        configuration.top = active_temp.configuration.top;
                        configuration.left = active_temp.configuration.left;
                        
                        if(type === 'text' && _id)
                            configuration.font = _id;
                        
                        configuration.$update(function(configuration){
                            $scope.active.doms[$scope.active.doms.length - 1].configuration = configuration;
                        });
                    });
                });
            };
        }]);