'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global',
    function ($scope, Global) {
        $scope.global = Global;
        $scope.samples = [];
        for (var i = 0; i < 2; i = i + 1) {
            $scope.samples[i] = [];
            for (var j = 0; j < 4; j = j + 1) {
                $scope.samples[i].push(new Date().getTime());
            }
        }
    }
]);
