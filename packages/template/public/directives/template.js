'use strict';

angular.module('mean.template') 
    .directive('domElement', function (Global, $window, Upload, Media) {
        return {
            restrict: 'E',
            scope: {
                dom: '=dom',
                active: '=active',
                edit: '=edit', 
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
                        scope.iframe = scope.$parent.iframe;
                        
                        if(scope.edit){
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
                                                scope.onDragStop({$evt: $event, $ui: {position: position, originalPosition: original}, dom: scope.$parent.active_dom});
                                            }
                                            $event.stopPropagation();
                                            $event.preventDefault();
                                        });
                                    }
                                }
                            };
                            scope.numbers = function(limit){
                                return new Array(Math.ceil(limit));
                            };
                        } 
                        else{
                            if(scope.dom.type === 'text'){
                                scope.saveChangesNow = function($event){
                                    clearTimeout(scope.timeoutid);
                                    scope.$parent.saveContent(scope.dom, $event.target.innerText);
                                };
                                scope.keydown = function($event){
                                    clearTimeout(scope.timeoutid);
                                    scope.timeoutid = setTimeout(function(){
                                        scope.$parent.saveContent(scope.dom, $event.target.innerText);
                                    }, 2000);
                                };
                            }
                            else if(scope.dom.type === 'chart'){
                                scope.upload = function (files) {
                                    if (files && files.length) {
                                        var load = function (e) {
                                            var contents = e.target.result;
                                            scope.$parent.saveContent(scope.dom, contents);
                                        };
                                        for (var i = 0; i < files.length; i = i + 1) {
                                            var file = files[i],
                                                reader = new FileReader();
                                            reader.onload = load;
                                            reader.readAsText(file);
                                        }
                                    }
                                };
                            }
                            else if(scope.dom.type === 'media'){
                                scope.uploadMedia = function (files) {
                                    if (files && files.length) {
                                        var progress = function (evt) {
                                                scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                                            },
                                            sucess = function (data, status, headers, config) {
                                                new Media({name: data.file.name, path: data.file.src, type: data.file.type, team: scope.global.teamActive._id, poster: data.file.poster})
                                                    .$save(function (resp) {
                                                        scope.progress = 0;
                                                        scope.dom.configuration.background.background_image = resp._id;
                                                        if(!scope.$parent.active_dom){
                                                            scope.$parent.toggle(scope.dom);
                                                        }
                                                        scope.$parent.mediaFiles.push(resp);
                                                        scope.$parent.saveContent(scope.dom, '', scope.dom.configuration.background);
                                                    });
                                            };
                                        for (var i = 0; i < files.length; i = i + 1) {
                                            var file = files[i];
                                            Upload
                                                .upload({
                                                    url: '/upload',
                                                    fields: {'dest': '/upload/' + scope.global.teamActive._id + '/'},
                                                    file: file
                                                })
                                                .progress(progress)
                                                .success(sucess);
                                        }
                                    }
                                };
                            }
                        }
                        scope.localToggle = function(dom){
                            angular.element('.dom-element').removeClass('editing');
                            
                            if(scope.edit || dom.type === 'media' || dom.configuration.background.overwritable){
                                scope.$parent.toggle(dom);
                            }
                            else if(dom.type === 'text'){
                                elem.addClass('editing');
                                if(scope.$parent.active_dom)
                                    scope.$parent.toggle(scope.$parent.active_dom);
                            }
                        };
                        scope.parseInt = function(str){
                            return parseInt(str); 
                        };
                        scope.saveTableContent = function(content_id, dom_id){
                            scope.$parent.saveTableContent(content_id, dom_id);
                        };
                    }
                };
            },
            templateUrl: '/template/views/dom-element.html'
        };
    })
    .directive('domSettings', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'DomSettingsController',
            templateUrl: '/template/views/dom-settings.html'
        };
    })
    .directive('chartContent', function($compile) {
        return function(scope, el, attrs) {
            var result = '', iframe = !!attrs.iframe, editable = (iframe ? '' : ' contenteditable data-ng-blur="saveTableContent(\''), select = 'ngf-select ';
            for(var i = 0; i < scope.active.content.length; i = i + 1){
                if(scope.active.content[i].id === scope.dom._id){
                    var trs = scope.active.content[i].content.split('\n');
                    editable = editable + (iframe ? '' : scope.active.content[i].id + '\', \'' + scope.dom.dom_id + '\')"');
                    for(var j = 0; j < trs.length; j = j + 1){
                        var tds = trs[j].split(',');
                        result = result + '<tr>';
                        for(var k = 0; k < tds.length; k = k + 1){
                            var size = tds[k].split(':'), 
                                width = size[1] ? ('width="' + size[1].trim() + '%"') : '',
                                tag = 'td' + editable;
                        
                            if(!j && trs[j][0] === '='){
                                tag = 'th' + editable;
                                size[j] = size[j].replace('=', '');
                            }
                        
                            result = result + '<' + tag + ' style="{{dom | parseDom:[\'border\',\'font\']}}" ' + width + '>' + size[0].trim() + '</' + tag + '>'; 
                        }
                        result = result + '</tr>';
                    }
                    break;
                }
            }
            if(result) select = '';
            
            result = result || '<tr><td>Upload file</td></tr>';
            
            if(scope.dom.type === 'chart' && !scope.edit)
                el.replaceWith($compile('<table class="dom-chart"><tbody ' + (iframe ? '' : select + 'ngf-drop data-ng-model="files" class="drop-box" ngf-drag-over-class="dragover" ngf-multiple="false" ngf-allow-dir="true" ngf-accept="\'.csv\'" ngf-change="upload(files)"') + '>' + result + '</tbody></table>')(scope));
        };
    });