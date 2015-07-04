'use strict';

angular.module('mean.system')
    .controller('HeaderController', ['$scope', 'Upload', '$rootScope', 'Global', 'Menus',
        function ($scope, Upload, $rootScope, Global, Menus) {
            $scope.global = Global;
            $scope.menus = {};
            $rootScope.constants = {
                max: {
                    teams: 3,
                    backgrounds_colours: 6,
                    fonts_colours: 3,
                    borders_colours: 2,
                    overlays_colours: 6,
                    fonts: 6,
                    borders: 6,
                    overlays: 2
                }
            };

            // Default hard coded menu items for main menu
            var defaultMainMenu = [];

            // Query menus added by modules. Only returns menus that user is allowed to see.
            function queryMenu(name, defaultMenu) {
                Menus.query({
                    name: name,
                    defaultMenu: defaultMenu
                }, function (menu) {
                    $scope.menus[name] = menu;
                });
            }

            // Query server for menus and check permissions
            queryMenu('main', defaultMainMenu);
            queryMenu('account', []);

            $scope.isCollapsed = false;

            $rootScope.$on('loggedin', function () {

                queryMenu('main', defaultMainMenu);

                $scope.global = {
                    authenticated: !!$rootScope.user,
                    user: $rootScope.user
                };
            });
            
            $scope.upload = function (files) {
                if (files && files.length) {
                    var sucess = function(data, status, headers, config){
                            $scope.global.teamActive.logo = data.file.filename;
                            $scope.global.teamActive.$update();
                        };
                    for (var i = 0; i < files.length; i = i + 1) {
                        var file = files[i];
                        Upload
                            .upload({
                                url: '/upload',
                                fields: {'dest': '/upload/' + $scope.global.teamActive._id + '/', delete: $scope.global.teamActive.logo},
                                file: file
                            })
                            .success(sucess);
                    }
                }
            };
        }
    ])
    .controller('TeamsController', ['$scope', '$rootScope', '$location', 'Global', 'Teams', 'Settings',
        function ($scope, $rootScope, $location, Global, Teams, Settings) {
            $scope.global = Global;
            $rootScope.teams = [];
            $scope.team = {};
            
            $scope.init = function () {
                Teams.query(function (teams) {
                    $rootScope.teams = teams;
                    if($scope.teams.length && !$scope.global.user.lastTeamAccessed){
                        $scope.changeTeamActive($scope.teams[0]);
                    }
                    else{
                        for (var i in $scope.teams) {
                            if($scope.teams[i] === $scope.global.user.lastTeamAccessed){
                                $scope.changeTeamActive($scope.teams[i]);
                            }
                        }
                    }
                });
            };
            
            $scope.remove = function (team) {
                if (team) {
                    team.$remove(function (response) {
                        for (var i in $scope.teams) {
                            if ($scope.teams[i] === team) {
                                $scope.teams.splice(i, 1);
                                if($scope.teams.length){
                                    if(team === $scope.global.teamActive){
                                        $scope.changeTeamActive($scope.teams[0]);
                                    }
                                }
                                else{
                                    delete $scope.global.teamActive;
                                    $location.url('/');
                                    $scope.$apply();
                                }
                            }
                        }
                    });
                }
            };
            
            $scope.create = function (isValid) {
                if (isValid && $scope.teams.length < $scope.constants.max.teams) {
                    new Settings().$save(function(response){
                        var team = new Teams({
                            name: $scope.team.name,
                            settings: response._id
                        });
                        team.$save(function (response) { 
                            $scope.teams.push(response);
                            $scope.changeTeamActive(response);
                            $scope.team.name = ''; 
                        });
                    });
                } else {
                    $scope.submitted = true;
                }
            };
            
            $rootScope.changeTeamActive = function (team){
                $scope.global.teamActive = team;
                Settings.get({
                    settingId: typeof team.settings === 'object' ? team.settings._id : team.settings
                }, function (settings) {
                    $scope.global.teamActive.settings = settings;
                });
            };
        }
    ]);
