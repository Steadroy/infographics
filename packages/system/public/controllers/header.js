'use strict';

angular.module('mean.system')
    .controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
        function ($scope, $rootScope, Global, Menus) {
            $scope.global = Global;
            $scope.menus = {};
            $rootScope.constants = {
                max: {
                    teams: 3,
                    backgrounds_colours: 6,
                    fonts_colours: 6,
                    borders_colours: 3,
                    overlays_colours: 4,
                    fonts: 5,
                    borders: 4,
                    overlays: 4
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
        }
    ])
    .controller('TeamsController', ['$scope', '$rootScope', '$location', 'Global', 'Teams', 'Settings',
        function ($scope, $rootScope, $location, Global, Teams, Settings) {
            $scope.global = Global;
            $rootScope.teams = [];
            $scope.team = {};
            
            $scope.find = function () {
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
                /*
                var user = new Users($scope.global.user);
                user.lastTeamAccessed = team;
                user.$update(function(response){
                    $scope.global.user = response;
                    $scope.global.teamActive = team;
                    console.log($scope.global.user.lastTeamAccessed);
                });*/
                
                $scope.global.teamActive = team;
                Settings.get({
                    settingId: typeof team.settings === 'object' ? team.settings._id : team.settings
                }, function (settings) {
                    $scope.global.teamActive.settings = settings;
                });
            };
        }
    ]);
