var app = angular.module('app');

app.controller('previewController', ['$scope', 'TemplateFactory', 'TwitterService',
function ($scope, TemplateFactory, TwitterService) {
    $scope.selectedAccount = "";
    $scope.accounts = TwitterService.accounts;
    $scope.current_layout = {};

    $scope.current_layout.width = TemplateFactory.width;
    $scope.current_layout.height = TemplateFactory.height;
    $scope.current_layout.layers = TemplateFactory.layers;
    $scope.current_layout.layers_converted = [];



    var regex = /#([^ :.?!]*)/g;

    var generatePreview = function() {
        $scope.current_layout.layers_converted = [];
        var tmp = $scope.current_layout.layers;
        for (var i=0; i<tmp.length; i++) {
            var _tmp = {
                width: tmp[i].width,
                height: tmp[i].height,
                top: tmp[i].top,
                left: tmp[i].left,
                text: tmp[i].text,
                position: tmp[i].position,
                background_image: tmp[i].background_image,
            }
            if (_tmp.text) {
                matched = _tmp.text.match(regex);
                if (matched) {
                    for (var j=0; j<matched.length; j++){
                        var __tmp = matched[j];
                        _tmp.text = _tmp.text.replace(__tmp, $scope.selectedAccount[__tmp.slice(1,__tmp.length)]);
                    }
                }
            }

            if (_tmp.background_image) {
                matched = _tmp.background_image.match(regex);
                if (matched) {
                    for (var j=0; j<matched.length; j++){
                        var __tmp = matched[j];
                        _tmp.background_image = _tmp.background_image.replace(__tmp, $scope.selectedAccount[__tmp.slice(1,__tmp.length)])
                    }
                }
            }

            $scope.current_layout.layers_converted.push(_tmp);
        }
    }

    $scope.$watch(function() {return $scope.current_layout.layers}, generatePreview, true);
    $scope.$watch(function() {return $scope.selectedAccount}, generatePreview, true);

}]);
