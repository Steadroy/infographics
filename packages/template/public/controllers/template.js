'use strict';

angular.module('mean.template', [])
    .controller('TemplateController', ['$scope', '$rootScope', 'Global', 'Template', 'Configuration', 'Dom', '$modal',
        function ($scope, $rootScope, Global, Template, Configuration, Dom, $modal) {
            $scope.global = Global;
            $scope.active = {};
            
            $scope.$watch('global.teamActive.settings', function(){
                if($scope.global.teamActive && $scope.global.teamActive._id){
                    $scope.active_dom = null;
                    $scope.active_template = null;
                    $scope.search = {};
                    $scope.templates = [];
                    Template.get({teamId: $scope.global.teamActive._id}, function (template) {
                        $scope.templates = template;
                        if ($scope.templates.length > 0) {
                            $scope.active = $scope.templates[0];
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
                        $scope.templates.push(template);
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
                    for(var i = 0; i < $scope.templates.length; i = i + 1){
                        if($scope.templates[i] === response){
                            $scope.templates.splice(i, 1);
                        }
                    }
                    if(response === $scope.active && $scope.templates.length){
                        $scope.active = $scope.templates[0];
                    }
                    if(!$scope.templates.length){
                        $scope.active = {};
                    }
                });
            };
            $scope.openModal = function(template){
                $rootScope.modal = {
                    title: 'Remove template',
                    body: 'Removing this template would cause unpredicted behaviour in the already created infographics.',
                    buttons: [{
                        class: 'btn-danger',
                        fn: 'remove',
                        txt: 'Remove',
                        obj: template
                    },{
                        class: 'btn-success',
                        fn: 'cancel',
                        txt: 'Cancel',
                        obj: template
                    }]
                };

                $modal
                    .open({
                        templateUrl: 'modal.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'sm'
                    })
                    .result.then(function (btn) {
                        $scope[btn.fn](btn.obj);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
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
                    $scope.templates.push(new_template);
                });
            };
            $scope.resize = function (evt, ui, dom) {
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
            $scope._removeDom = function(dom){
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
                    if($scope.active.doms[i]._id === dom._id){
                        remove(i);
                    }
                }
                $scope.active_dom = null;
                $scope.active_template = $scope.active;
            };
            
            $scope.removeDom = function(dom){
                $rootScope.modal = {
                    title: 'Remove element from template',
                    body: 'Removing this element from the template would cause unpredicted behaviour in the already created infographics.',
                    buttons: [{
                        class: 'btn-danger',
                        fn: '_removeDom',
                        txt: 'Remove',
                        obj: dom
                    },{
                        class: 'btn-success',
                        fn: 'cancel',
                        txt: 'Cancel',
                        obj: dom
                    }]
                };

                $modal
                    .open({
                        templateUrl: 'modal.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'sm'
                    })
                    .result.then(function (btn) {
                        $scope[btn.fn](btn.obj);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
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
            $scope.is_infographic = !!$scope.$parent.infographic;
            
            $scope.$watch('$parent.active', function(){
                $scope.inf_active_template = {};
            });
            $scope.$watch('global.teamActive.settings', function(){
                if($scope.global.teamActive && $scope.global.teamActive._id){
                    $scope.search = {};
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
                            'background_size': ['contain', 'cover', 'inherit', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']
                        },
                        'overwrites': [
                            'padding_top',
                            'padding_right',
                            'padding_bottom',
                            'padding_left'
                        ]
                    };
                    if(!$scope.is_infographic){
                        $scope.config.background_settings.background_color = $scope.global.teamActive.settings.colours ? $scope.global.teamActive.settings.colours.backgrounds : [];
                    }
                    
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
                $scope.$parent.active_dom.configuration.background = background;
                if($scope.is_infographic){
                    $scope.$parent.saveContent($scope.$parent.active_dom, '', background);
                }
                else{
                    background.$update(function(){ });
                }
            };
            $scope.updateInfographic = function(){
                $scope.$parent.update($scope.$parent.active);
            };
            $scope.loadTags = function(query){
                return $scope.$parent.loadTags(query);
            };
            $scope.changeSetting = function(setting, key, value){
                if(setting === 'background'){
                    var background = new Background($scope.$parent.active_dom.configuration.background);

                    if(key === 'overwritable')
                        background[key] = !background[key];
                    else
                        background[key] = typeof value === 'string' || !value ? value : value._id;
                    
                    background.$update(function(response){
                        $scope.$parent.active_dom.configuration.background = response;
                        if($scope.is_infographic){
                            $scope.$parent.parseConfigurations($scope.$parent.active, $scope.$parent.active_dom.configuration);
                        }
                    });
                }
                else if (['logo_position', 'font', 'border', 'overlay', 'overwrite'].indexOf(setting) >= 0) {
                    var configuration = new Configuration($scope.$parent.active_dom.configuration);
                    
                    if (setting === 'overwrite'){
                        configuration.overwrite[key] = value;
                    }
                    else{
                        configuration[setting] = typeof value === 'string' || !value ? value : value._id;
                    }
                    configuration.$update(function(response){
                        $scope.$parent.active_dom.configuration = response;
                    });
                }
            };
            
            $scope.addDom = function(type, _id){
                var active_temp = $scope.$parent.active_dom,
                    dom = new Dom({type: type, parent_dom_id:active_temp.dom_id, order:$scope.$parent.active.doms.length}),
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
                    $scope.$parent.active.doms.push(dom);
                    new Template($scope.$parent.active).$update(function(template){ 
                        $scope.$parent.active = template;
                        var configuration = new Configuration(dom.configuration);
                        configuration.height = getDimension(active_temp.configuration.height / 2);
                        configuration.width = getDimension(active_temp.configuration.width / 2);
                        configuration.top = active_temp.configuration.top;
                        configuration.left = active_temp.configuration.left;
                        
                        if(type === 'text' && _id)
                            configuration.font = _id;
                        
                        configuration.$update(function(configuration){
                            $scope.$parent.active.doms[$scope.$parent.active.doms.length - 1].configuration = configuration;
                            $scope.$parent.active_dom = $scope.$parent.active.doms[$scope.$parent.active.doms.length - 1];
                        });
                    });
                });
            };
            
            $scope.generateThumbnail = function (obj) {
                var dimensions = {width: 0, height: 0},
                    $obj = angular.element('#' + obj + '-section'),
                    //template or infographic
                    doms = obj === 'template' ? $scope.$parent.active.doms : $scope.$parent.active.template.doms;
                
                $scope.generating = true;
                for (var i = 0; i < doms.length; i = i + 1) {
                    if (!doms[i].parent_dom_id) {
                        dimensions.width = doms[i].configuration.width;
                        dimensions.height = doms[i].configuration.height;
                        break;
                    }
                }
                $obj.css(dimensions);
                window.html2canvas(document.getElementById(obj + '-section'), {
                    onrendered: function (canvas) {
                        var mime = 'image/png', 
                            img = canvas.toDataURL(mime), cod = 'data:' + mime + ';base64,',
                            poster = cod + img.replace(cod, '');
                        
                        Upload
                            .upload({
                                url: '/upload',
                                fields: {
                                    'dest': '/upload/' + $scope.global.teamActive._id + '/', 
                                    'delete': $scope.$parent.active.poster,
                                    'file': poster
                                }
                            })
                            .success(function(data, status, headers, config){
                                $scope.$parent.active.poster = data.file.filename;
                                $scope.update($scope.$parent.active);
                                $scope._t = Date.now();
                                $scope.feedback = true;
                                
                                $timeout(function(){
                                    $scope.feedback = false;
                                }, 2500);
                            });
                        $obj.css({width: '', height: ''});
                        $scope.generating = false;
                    }
                });
            };
            $scope.un_publish = function(obj){
                $scope['active_' + obj].ready = !$scope['active_' + obj].ready; 
                $scope.update($scope['active_' + obj]);

                if($scope['active_' + obj].ready)
                    $scope.generateThumbnail(obj);
            };
            $scope.select = function(template){
                $scope.inf_active_template = template;
                $timeout(function(){
                    angular.element('html').trigger('click');
                }, 0);
            };
            $scope.save = function(template){
                //infographic save method
                $scope.$parent.save(template);
            };
        }]);