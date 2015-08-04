'use strict';

angular.module('mean.system')
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
        $scope.execute = function (btn) {
            if(btn.button.fn === 'cancel'){
                $modalInstance.dismiss('cancel');
            }
            else{
                $modalInstance.close(btn.button);
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('IndexController', ['$scope', '$rootScope', 'Global', 'Infographic', 'Template', 'Background', '$modal',
        function ($scope, $rootScope, Global, Infographic, Template, Background, $modal) {
            $scope.global = Global;
            $scope.active = {};
            $scope._t = Date.now();
            $scope.infographic = true;
            
            $scope.$watch('global.teamActive.settings', function(){
                if(typeof $scope.global.teamActive.settings !== 'string' && $scope.global.teamActive && $scope.global.teamActive._id){
                    $scope.search = {};
                    $scope.new = {};
                    $scope.active_infographic = null;
                    $scope.active_dom = null;
                    $scope.infographics = [];
                    Infographic.get({teamId: $scope.global.teamActive._id}, function (infographic) { 
                        $scope.infographics = infographic;
                        if ($scope.infographics.length > 0) {
                            $scope.active = $scope.infographics[0];
                            $scope.active_infographic = $scope.active;
                        }
                        Template.get({teamId: $scope.global.teamActive._id, ready: true}, function (template) {
                            $scope.templates = template;
                        
                        });
                        if($scope.infographics.length)
                            $scope.parseConfigurations($scope.infographics);
                    }); 
                    setInterval(function(){
                        $scope._t = Date.now();
                    }, 250);
                }
            });
            $rootScope.parseConfigurations = function(infographics, conf){
                //any change here, sync with iframe/public/controller/iframe.js
                var parseConfiguration = function(infographic){
                    for(var i = 0; i < infographic.content.length; i = i + 1){
                        if(infographic.content[i].background){
                            for(var j = 0; j < infographic.template.doms.length; j = j + 1){
                                if(infographic.content[i].id === infographic.template.doms[j]._id){
                                    infographic.template.doms[j].configuration.background = infographic.content[i].background;
                                }
                            }
                        }
                    }
                };
                if(conf){
                    for(var j = 0; j < infographics.template.doms.length; j = j + 1){
                        if(infographics.template.doms[j].configuration._id === conf._id){
                            infographics.template.doms[j].configuration.background = conf.background;
                        }
                    }
                }
                else{
                    if(infographics.length){
                        for(var i = 0; i < infographics.length; i = i + 1){
                            parseConfiguration(infographics[i]);
                        }
                    }
                    else{
                        parseConfiguration(infographics);
                    }
                }
            };
            $scope.select = function(infographic){
                $scope.active = infographic;
                $scope.active_dom = null;
                $scope.active_infographic = $scope.active;
                $scope._t = Date.now();
            };
            $scope.create = function(isValid, form){
                if (isValid) {
                    //This view works different than the others (why? don't know), that's why the form is sent as parameter
                    new Infographic({name: form.new_infographic.$viewValue, team: $scope.global.teamActive._id}).$save(function(infographic){
                        $scope.infographics.push(infographic);
                        $scope.active = infographic;
                        $scope.active_dom = null;
                        $scope.new.infographic_name = '';
                        form.new_infographic.$viewValue = '';
                        form.new_infographic.$modelValue = '';
                        angular.element('input[name="new_infographic"]').val(''); 
                        $scope.active_infographic = $scope.active;
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            $scope.remove = function(infographic){
                infographic.$remove(function(response){
                    for(var i = 0; i < $scope.infographics.length; i = i + 1){
                        if($scope.infographics[i] === response){
                            $scope.infographics.splice(i, 1);
                        }
                    }
                    if(response === $scope.active && $scope.infographics.length){
                        $scope.active = $scope.infographics[0];
                    }
                    if(!$scope.infographics.length){
                        $scope.active = {};
                    }
                });
            };
            $scope.update = function(infographic){ 
                new Infographic(infographic).$update(function(response){ 
                    if(!$scope.active_dom){
                        $scope.active_infographic = $scope.active;
                    }
                    $scope.active = response;
                    $scope.parseConfigurations($scope.active);
                });
            };
            $scope.loadTags = function(query){
                return Infographic.tags({query: query, team: $scope.global.teamActive._id}, function(resp){ }).$promise;
            };
            $scope.clone = function(infographic){
                new Infographic(infographic).$save({clone: true}, function(new_infographic){
                    $scope.infographics.push(new_infographic);
                });
            };
            $scope.toggleTemplateSetting = function(infographic){
                if($scope.active_infographic && infographic._id === $scope.active_infographic._id){
                    $scope.active_infographic = null;
                }
                else{
                    $scope.active_infographic = infographic;
                }
                $scope.active_dom = null;
            };
            $scope.toggle = function(dom){
                if($scope.active_dom && dom._id === $scope.active_dom._id){
                    $scope.active_dom = null;
                    $scope.active_infographic = $scope.active;
                }
                else{
                    $scope.active_dom = dom;
                    $scope.active_infographic = null;
                }
            };
            $scope.save = function(template){
                $scope.active_infographic.template = template._id;
                new Infographic($scope.active_infographic).$update(function (response) {
                    $scope.active_infographic = response;
                    $scope.active = response;
                    for (var i = 0; i < $scope.infographics.length; i = i + 1) {
                        if ($scope.infographics[i]._id === $scope.active_infographic._id) {
                            $scope.infographics[i] = $scope.active_infographic;
                        }
                    }
                });
            };
            $scope.saveContent = function(dom, content, background){
                var found = false,
                    _save = function(dom_id){
                        $scope.update($scope.active);
                        angular.element(dom_id).find('.dom-text').focus();
                    };
                
                if(content){
                    for(var i = 0; i < $scope.active.content.length; i = i + 1){
                        if($scope.active.content[i].id === dom._id){
                            found = true;
                            $scope.active.content[i].content = content;
                            _save(dom.dom_id);
                        }
                    }
                    if(!found){
                        $scope.active.content.push({ 
                            id: dom._id,
                            content: content
                        });
                        _save(dom.dom_id);
                    }
                }
                if(background){
                    var save_background = function(background, j, callback){
                        new Background(background).$update(function(background){
                            $scope.active_dom.configuration.background = background;
                            callback(background, j);
                        });
                    }, _callback = function(background, j){
                        $scope.active.content[j].background = background;
                        _save(dom.dom_id); 
                    };
                    
                    for(var j = 0; j < $scope.active.content.length; j = j + 1){
                        if($scope.active.content[j].id === dom._id){
                            found = true; 
                            save_background(background, j, _callback);
                        }
                    }
                    if(!found){
                        delete background._id;  
                        
                        new Background(background).$save(function(background){
                            $scope.active.content.push({ 
                                id: dom._id,
                                background: background 
                            });
                            $scope.active_dom.configuration.background = background;
                            _save(dom.dom_id);
                        });
                    }
                }
            };
            $scope.saveTableContent = function(content_id, dom_id){
                var i, j, k;
                for(j = 0; j < $scope.active.content.length; j = j + 1){
                    if($scope.active.content[j].id === content_id){
                        var new_content = '',
                            $table = angular.element(dom_id).find('.dom-chart'),
                            th = $table.find('th'),
                            tr = $table.find('tr');
                        if(th.length){
                            new_content = '=';
                            for(i = 0; i < th.length; i = i + 1){
                                new_content = new_content + th.eq(i).text() + (th.eq(i).attr('width') ? ':' + th.eq(i).attr('width').replace('%', '') : '') + (i < th.length - 1 ? ',' : String.fromCharCode(10));
                            }
                        }
                        for(i = 0; i < tr.length; i = i + 1){
                            var td = tr.eq(i).find('td');
                            
                            for(k = 0; k < td.length; k = k + 1){
                                new_content = new_content + td.eq(k).text() + (k < td.length - 1 ? ',' : (i < tr.length - 1 ? String.fromCharCode(10) : ''));
                            }
                        }
                        $scope.active.content[j].content = new_content;
                        $scope.update($scope.active);
                    }
                }
            };
            $scope.openModal = function(infographic){
                    $rootScope.modal = {
                        title: 'Remove infographic',
                        body: 'Removing this infographic would cause unpredicted behaviour in the already published stories.',
                        buttons: [{
                            class: 'btn-danger',
                            fn: 'remove',
                            txt: 'Remove',
                            obj: infographic
                        },{
                            class: 'btn-success',
                            fn: 'cancel',
                            txt: 'Cancel',
                            obj: infographic
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
        }
    ]);
