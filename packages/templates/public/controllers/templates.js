'use strict';

angular.module('mean.templates').controller('TemplatesController', ['$scope', '$stateParams', '$location', 'Global', 'Templates',
    function ($scope, $stateParams, $location, Global, Templates) {
        $scope.global = Global;
        $scope.hasAuthorization = function (template) {
            if (!template || !template.user)
                return false;
            return $scope.global.isAdmin || template.user._id === $scope.global.user._id;
        };

        $scope.create = function (isValid) {
            if (isValid) {
                var template = new Templates({
                    title: this.title,
                    content: this.content
                });
                template.$save(function (response) {
                    $location.path('templates/' + response._id);
                });

                this.title = '';
                this.content = '';
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function (template) {
            if (template) {
                template.$remove(function (response) {
                    for (var i in $scope.templates) {
                        if ($scope.templates[i] === template) {
                            $scope.templates.splice(i, 1);
                        }
                    }
                    $location.path('templates');
                });
            } else {
                $scope.template.$remove(function (response) {
                    $location.path('templates');
                });
            }
        };

        $scope.update = function (isValid) {
            if (isValid) {
                var template = $scope.template;
                if (!template.updated) {
                    template.updated = [];
                }
                template.updated.push(new Date().getTime());

                template.$update(function () {
                    $location.path('templates/' + template._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function () {
            Templates.query(function (templates) {
                $scope.templates = templates;
            });
        };

        $scope.findOne = function () {
            Templates.get({
                templateId: $stateParams.templateId
            }, function (template) {
                $scope.template = template;
            });
        };
    }
]);
