'use strict';

angular.module('mean.template', [])
    .controller('TemplateController', ['$scope', 'Global', 'Template', 'Configuration', 'Dom',
        function ($scope, Global, Template, Configuration, Dom) {
            $scope.global = Global;
            $scope.active = {};
            
            $scope.$watch('global.teamActive.settings', function(){
                if($scope.global.teamActive && $scope.global.teamActive._id){
                    $scope.active_dom = null;
                    $scope.active_template = null;
                    $scope.search_query = '';
                    $scope.template = [];
                    Template.get({teamId: $scope.global.teamActive._id}, function (template) {
                        $scope.template = template;
                        if ($scope.template.length > 0) {
                            $scope.active = $scope.template[0];
                            $scope.active_template = $scope.active;
                        }
                    });
                }
            });

            $scope.select = function(template) {
                $scope.active_dom = null; 
                $scope.active = template;
                $scope.active_template = $scope.active;
            };
            
            $scope.create = function(isValid){
                if (isValid) {
                    new Template({name: $scope.template_name, team: $scope.global.teamActive._id}).$save(function(template){
                        $scope.template.push(template);
                        $scope.active = template;
                        $scope.template_name = '';
                        $scope.active_dom = null;
                        $scope.active_template = null;
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
                new Template(template).$update(function(response){ 
                    $scope.active = response;
                    $scope.active_template = $scope.active;
                });
            };
            $scope.clone = function(template){
                new Template(template).$save({clone: true}, function(new_template){
                    $scope.template.push(new_template);
                });
            };
            $scope.resize = function (evt, ui, dom) {
                console.log(dom.configuration.overwrite);
                dom.configuration.height = ui.size.height + (dom.configuration.overwrite ? dom.configuration.overwrite.padding_top + dom.configuration.overwrite.padding_bottom : 0) + (dom.configuration.border ? dom.configuration.border.border_top_width + dom.configuration.border.border_bottom_width : 0);
                dom.configuration.width = ui.size.width + (dom.configuration.overwrite ? dom.configuration.overwrite.padding_left + dom.configuration.overwrite.padding_right : 0) + (dom.configuration.border ? dom.configuration.border.border_left_width + dom.configuration.border.border_right_width : 0);
            };
            $scope.resizeStop = function (evt, ui, dom) {
                var update_children = function(dom){
                    for(var j = 0; j < $scope.active.doms.length; j = j + 1){
                        if(dom.dom_id === $scope.active.doms[j].parent_dom_id){
                            var changed = false;
                            if(dom.configuration.left + dom.configuration.width < $scope.active.doms[j].configuration.left + $scope.active.doms[j].configuration.width){
                                $scope.active.doms[j].configuration.width = dom.configuration.left + dom.configuration.width - $scope.active.doms[j].configuration.left;
                                changed = true;
                            }
                            if(dom.configuration.top + dom.configuration.height < $scope.active.doms[j].configuration.top + $scope.active.doms[j].configuration.height){
                                $scope.active.doms[j].configuration.height = dom.configuration.top + dom.configuration.height - $scope.active.doms[j].configuration.top;
                                changed = true;
                            }
                            if(changed){
                                $scope.resizeStop(evt, ui, $scope.active.doms[j]);
                            }
                        }
                    }
                };
                new Configuration(dom.configuration).$update(function(){
                    update_children(dom);
                });
            };
            $scope.drag = function (evt, ui, dom) {
                dom.configuration.top = ui.position.top; 
                dom.configuration.left = ui.position.left;
            };
            $scope.dragStop = function (evt, ui, dom) {
                var update_children = function(dom){
                    for(var j = 0; j < $scope.active.doms.length; j = j + 1){
                        if(dom.dom_id === $scope.active.doms[j].parent_dom_id){
                            $scope.active.doms[j].configuration.top = $scope.active.doms[j].configuration.top + (ui.position.top - ui.originalPosition.top); 
                            $scope.active.doms[j].configuration.left = $scope.active.doms[j].configuration.left + (ui.position.left - ui.originalPosition.left);
                            $scope.dragStop(evt, ui, $scope.active.doms[j]);
                        }
                    }
                };
                new Configuration(dom.configuration).$update(function(){
                    update_children(dom);
                });
            };
            $scope.toggle = function(dom){
                if($scope.active_dom && dom._id === $scope.active_dom._id){
                    $scope.active_dom = null;
                    $scope.active_template = $scope.active;
                }
                else{
                    $scope.active_dom = dom;
                    $scope.active_template = null;
                }
            };
            $scope.removeDom = function(dom){
                var find_children = function(dom){
                    for(var j = 0; j < $scope.active.doms.length; j = j + 1){
                        if(dom.dom_id === $scope.active.doms[j].parent_dom_id){
                            $scope.removeDom($scope.active.doms[j]);
                        }
                    }
                }, remove = function(i){
                    new Dom(dom).$remove(function(){
                        $scope.active.doms.splice(i, 1);
                        find_children(dom);
                    });
                };
                for(var i = 0; i < $scope.active.doms.length; i = i + 1){
                    if($scope.active.doms[i] === dom){
                        remove(i);
                    }
                }
                $scope.active_dom = null;
            };
            $scope.toggleTemplateSetting = function(template){
                if($scope.active_template && template._id === $scope.active_template._id){
                    $scope.active_template = null;
                }
                else{
                    $scope.active_template = template;
                }
                $scope.active_dom = null;
            };
        }
    ])
    .controller('DomSettingsController', ['$scope', '$timeout', 'Upload', 'Global', 'Dom', 'Media', 'Template', 'Configuration', 'Background', 
        function ($scope, $timeout, Upload, Global, Dom, Media, Template, Configuration, Background) {
            $scope.global = Global;
            $scope.configuration = null;
            $scope.paddings = Array.apply(null, new Array(11)).map(function(i, j) { return j; });
            
            $scope.$watch('global.teamActive.settings', function(){
                if($scope.global.teamActive && $scope.global.teamActive._id){
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
                            'background_color': $scope.global.teamActive.settings.colours ? $scope.global.teamActive.settings.colours.backgrounds : []
                        },
                        'overwrites': [
                            'padding_top',
                            'padding_right',
                            'padding_bottom',
                            'padding_left'
                        ]
                    };
                    Media.query({teamId: $scope.global.teamActive._id, filetype: 'image'}, function (media_files) {
                        $scope.mediaFiles = media_files;
                    });
                }
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

                    if(key === 'overwritable')
                        background[key] = !background[key];
                    else
                        background[key] = typeof value === 'string' || !value ? value : value._id;
                    
                    background.$update(function(response){
                        $scope.active_dom.configuration.background = response;
                    });
                }
                else if (['logo_position', 'font', 'border', 'overlay', 'overwrite'].indexOf(setting) >= 0) {
                    var configuration = new Configuration($scope.active_dom.configuration);
                    
                    if (setting === 'overwrite'){
                        configuration.overwrite[key] = value;
                    }
                    else{
                        configuration[setting] = typeof value === 'string' || !value ? value : value._id;
                    }
                    configuration.$update(function(response){
                        $scope.active_dom.configuration = response;
                    });
                }
            };
            
            $scope.addDom = function(type, _id){
                var active_temp = $scope.active_dom,
                    dom = new Dom({type: type, parent_dom_id:active_temp.dom_id, order:$scope.active.doms.length}),
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
                            console.log(configuration);
                            $scope.active.doms[$scope.active.doms.length - 1].configuration = configuration;
                            $scope.active_dom = $scope.active.doms[$scope.active.doms.length - 1];
                        });
                    });
                });
            };
            
            $scope.generateThumbnail = function () {
                var dimensions = {width: 0, height: 0},
                    $template = angular.element('#template');
                $scope.generating = true;
                for (var i = 0; i < $scope.active.doms.length; i = i + 1) {
                    if (!$scope.active.doms[i].parent_dom_id) {
                        dimensions.width = $scope.active.doms[i].configuration.width;
                        dimensions.height = $scope.active.doms[i].configuration.height;
                        break;
                    }
                }
                $template.css(dimensions);
                window.html2canvas(document.getElementById('template'), {
                    onrendered: function (canvas) {
                        var mime = 'image/png', 
                            img = canvas.toDataURL(mime), cod = 'data:' + mime + ';base64,',
                            poster = cod + img.replace(cod, '');
                        
                        Upload
                            .upload({
                                url: '/upload',
                                fields: {
                                    'dest': '/upload/' + $scope.global.teamActive._id + '/', 
                                    'delete': $scope.active.poster,
                                    'file': poster
                                }
                            })
                            .success(function(data, status, headers, config){
                                $scope.active.poster = data.file.filename;
                                $scope.update($scope.active);
                                $scope._t = new Date().getTime();
                                $scope.feedback = true;
                                
                                $timeout(function(){
                                    $scope.feedback = false;
                                }, 2500);
                            });
                        $template.css({width: '', height: ''});
                        $scope.generating = false;
                    }
                });
            };
            $scope.un_publish = function(){
                $scope.active_template.ready = !$scope.active_template.ready; 
                $scope.update($scope.active_template);
                
                if($scope.active_template.ready)
                    $scope.generateThumbnail();
            };
        }]);