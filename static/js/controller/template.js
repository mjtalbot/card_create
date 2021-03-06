var app = angular.module('app');

app.controller('templateListController', ['$scope', 'TemplateListFactory',
function($scope, TemplateList) {
    $scope.data = TemplateList;
    TemplateList.loadTemplates();

    $scope.addTemplate = function() {
        TemplateList.addTemplate();
        $scope.selectTemplate($scope.data.templates.length-1);
    };

    $scope.selectTemplate = function(index) {
        TemplateList.selectTemplate($scope.data.templates[index]);
    };
    return $scope;
}]);

app.controller('templateController', ['$scope', 'TemplateListFactory',
function($scope, TemplateList) {
    $scope.data = TemplateList;
    $scope.new_attr_name = "";
    $scope.new_attr_value = "";

    $scope.selectLayer = function(index) {
        $scope.data.selectedLayer = $scope.data.selectedTemplate.layers[index];
    };

    $scope.addLayer = function() {
        $scope.data.selectedTemplate.addLayer();
        $scope.selectLayer($scope.data.selectedTemplate.layers.length-1);
    };

    $scope.removeLayer = function(layer) {
        var index = $scope.data.selectedTemplate.layers.indexOf(layer);
        $scope.data.selectedTemplate.removeLayer(layer);
        $scope.selectLayer(null);
    };

    $scope.cloneLayer = function(layer) {
        var index = $scope.data.selectedTemplate.layers.indexOf(layer);
        $scope.data.selectedTemplate.cloneLayer(index);
        $scope.selectLayer($scope.data.selectedTemplate.layers.length-1);
    };

    $scope.moveLayerUp = function(layer) {
        var index = $scope.data.selectedTemplate.layers.indexOf(layer);
        if (index > 0)
            $scope.data.selectedTemplate.switchPlaces(index, index-1);
    };

    $scope.moveLayerDown = function(layer) {
        // [1], can't switch index 0 in length 1 array
        var index = $scope.data.selectedTemplate.layers.indexOf(layer);
        if (index +1 < $scope.data.selectedTemplate.layers.length)
            $scope.data.selectedTemplate.switchPlaces(index, index+1);
    };


    $scope.addAttribute = function() {
        $scope.data.selectedTemplate.addAttribute(
            $scope.new_attr_name, $scope.new_attr_value
        );
        $scope.new_attr_name= '';
        $scope.new_attr_value = '';
    };

    $scope.removeAttribute = function(attribute) {
        $scope.data.selectedTemplate.removeAttribute(attribute);
    };

    $scope.save = function() {
        $scope.data.selectedTemplate.save();
    };

    $scope.delete = function() {
        TemplateList.deleteTemplate($scope.data.selectedTemplate);
        $scope.selectedTempalte = null;
    };

    $scope.successUpload = function(input) {
        $scope.new_attr_value = input.data.url;
    };

    var calcStyleHelper = function () {
        if ($scope.data.selectedLayer)
            $scope.data.selectedLayer.calculateStyle();
    };

    $scope.$watch( 'data.selectedLayer.css' , calcStyleHelper, true);

}]);
