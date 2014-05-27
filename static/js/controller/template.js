var app = angular.module('app');

app.controller('templateController', ['$scope', 'TemplateFactory',
function($scope, TemplateFactory) {
    $scope.layers = TemplateFactory.layers;
    $scope.selectedIndex = null;
    $scope.selectedLayer = null;
    $scope.maxWidth = TemplateFactory.width;
    $scope.maxHeight = TemplateFactory.height;

    $scope.addLayer = function() {
        TemplateFactory.addLayer();
        $scope.selectLayer($scope.layers.length-1);
    }

    $scope.removeLayer = function(index) {
        TemplateFactory.removeLayer(index);
    }

    $scope.selectLayer = function(index) {
        $scope.selectedIndex = index;
        $scope.selectedLayer = $scope.layers[index];
    }

}]);
