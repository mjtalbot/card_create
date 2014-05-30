var app = angular.module('app');

app.controller('templateListController', ['$scope', 'TemplateListFactory',
function($scope, TemplateList) {
    $scope.data = TemplateList;

    $scope.addTemplate = function() {
        TemplateList.addTemplate();
        $scope.selectTemplate($scope.data.templates.length-1);
    }

    $scope.selectTemplate = function(index) {
        TemplateList.selectTemplate($scope.data.templates[index]);
    }
    return $scope
}]);

app.controller('templateController', ['$scope', 'TemplateListFactory',
function($scope, TemplateList) {
    $scope.data = TemplateList;
    $scope.new_attr_name = "";
    $scope.new_attr_value = "";

    $scope.addLayer = function() {
        $scope.data.selectedTemplate.addLayer();
        $scope.selectLayer($scope.data.selectedTemplate.layers.length-1);
    }

    $scope.removeLayer = function(index) {
        $scope.data.selectedTemplate.removeLayer(index);
    }

    $scope.selectLayer = function(index) {
        $scope.data.selectedLayer = $scope.data.selectedTemplate.layers[index];
    }

    $scope.addAttribute = function() {
        $scope.data.selectedTemplate.addAttribute(
            $scope.new_attr_name, $scope.new_attr_value
        );
        $scope.new_attr_name= '';
        $scope.new_attr_value = '';
    }

    $scope.removeAttribute = function(attribute) {
        $scope.data.selectedTemplate.removeAttribute(attribute);
    }

    $scope.save = function() {
        $scope.data.selectedTemplate.save();
    }

    $scope.delete = function() {
        TemplateList.deleteTemplate($scope.data.selectedTemplate);
        $scope.selectedTempalte = null;
    }

}]);
