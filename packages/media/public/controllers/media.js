'use strict';

angular.module('mean.media', [
    'ngFileUpload', 
    'ngTagsInput', 
    'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'])
        .controller('MediaController', ['$scope', 'Upload', '$timeout', '$location', 'Global', 'Media',
            function ($scope, Upload, $timeout, $location, Global, Media) {
                $scope.global = Global;
                $scope.theme = '/bower_components/videogular-themes-default/videogular.css';
                
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
                    $scope.mediaFiles = [];
                    $scope.progress = 0;
                    
                    Media.query({teamId: $scope.global.teamActive._id}, function (media_files) {
                        $scope.mediaFiles = media_files;
                        if($scope.mediaFiles.length > 0){
                            $scope.selected = $scope.mediaFiles[0];
                        }
                    });
                });

                $scope.select = function(media) {
                    $scope.selected = media;
                };

                $scope.upload = function (files) {
                    if (files && files.length) {
                        var progress = function (evt) {
                                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                            },
                            sucess = function (data, status, headers, config) {
                                new Media({name: data.file.name, path: data.file.src, type: data.file.type, team: $scope.global.teamActive._id, poster: data.file.poster})
                                    .$save(function (resp) {
                                        $scope.progress = 0;
                                        $scope.mediaFiles.push(resp); //unshift
                                        $scope.selected = $scope.mediaFiles[$scope.mediaFiles.length - 1];
                                    });
                            };
                        for (var i = 0; i < files.length; i = i + 1) {
                            var file = files[i];
                            Upload
                                .upload({
                                    url: '/upload',
                                    fields: {'dest': '/upload/' + $scope.global.teamActive._id + '/'},
                                    file: file
                                })
                                .progress(progress)
                                .success(sucess);
                        }
                    }
                };
                
                $scope.removeMedia = function(media){
                    media.$remove(function(resp){
                        for(var i = 0; i < $scope.mediaFiles.length; i = i + 1){
                            if($scope.mediaFiles[i]._id === resp._id){
                                $scope.mediaFiles.splice(i, 1);
                            }
                        }
                        if(resp._id === $scope.selected._id && $scope.mediaFiles.length > 0){
                            $scope.selected = $scope.mediaFiles[0];
                        }
                    });
                };
                
                $scope.getSrc = function(id){
                    return '/upload/' + id;
                };
                
                $scope.update = function(){
                    $scope.selected.$save();
                };
                $scope.loadTags = function(query){
                    return Media.tags({query: query, team: $scope.global.teamActive._id}, function(resp){ }).$promise;
                };
            }
        ]);