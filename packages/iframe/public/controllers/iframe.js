'use strict';

angular.module('mean.iframe', [])
    .controller('IframeController', ['$scope', '$timeout', 'Iframe', 'IMedia',
        function ($scope, $timeout, Iframe, IMedia) {
            $scope.load = function(){
                new Iframe({_id: window.infographic}).$get(function(infographic){
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
                    parseConfiguration(infographic);
                    $scope.infographic = infographic;
                    $scope.iframe = true;
                    $timeout(function(){
                        angular.element('.dom-element').attr('tabindex', 1);
                        angular.element('.dom-element.text')
                            .attr('aria-label', function(){
                                return angular.element(this).find('>.dom-text').text();
                            });
                        angular.element('.dom-element.media')
                            .attr('aria-label', function(){
                                var $this = angular.element(this),
                                    id = $this.find('>.dom-media').attr('data-media');
                                if(id){
                                    new IMedia({_id: id}).$get(function(resp){
                                        $this.attr('aria-label', resp.alt);
                                    }); 
                                } 
                                return '';
                            });
                        angular.element('.dom-element.chart th, .dom-element.chart td')
                            .attr('tabindex', 1);
                    }, 100);
                });
            };
        }
    ]);