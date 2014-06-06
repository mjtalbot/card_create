var app = angular.module('app');

app.controller('PreviewController', ['$scope', 'TemplateListFactory', 'CardListFactory',
function ($scope, TemplateList, CardList) {
    $scope.cards = CardList.cards;
    $scope.templates = TemplateList.templates;

    $scope.selectedTemplate = "";
    $scope.selectedCard = "";

    $scope.current_layout = {};
    $scope.current_layout.convertedLayers = [];



    var regex = /#([^ :.?!]*)/g;

    var generatePreview = function() {
        if ((!$scope.selectedTemplate) || (!$scope.selectedCard)) {
            return;
        }

        $scope.current_layout.width = $scope.selectedTemplate.css.width;
        $scope.current_layout.height = $scope.selectedTemplate.css.height;

        $scope.current_layout.convertedLayers = [];
        var tmp = $scope.selectedTemplate.layers;
        for (var i=0; i<tmp.length; i++) {
            var _tmp = {
                style_sheet: tmp[i].style_sheet,
                background_image: tmp[i].background_image,
                text: tmp[i].text
            };
            if (_tmp.text) {
                matched = _tmp.text.match(regex);
                if (matched) {
                    for (var j=0; j<matched.length; j++){
                        var __tmp = matched[j].slice(1,matched[j].length);
                        if (__tmp == 'name') {
                            _tmp.text = _tmp.text.replace(
                                matched[j],
                                $scope.selectedCard[__tmp]
                            );
                        }
                        else if ($scope.selectedCard.attributes[__tmp]){
                            _tmp.text = _tmp.text.replace(
                                matched[j],
                                $scope.selectedCard.attributes[__tmp]
                            );
                        }
                        else if ($scope.selectedTemplate.attributes[__tmp]){
                            _tmp.text = _tmp.text.replace(
                                matched[j],
                                $scope.selectedTemplate.attributes[__tmp]
                            );
                        }
                    }
                }
            }

            if (_tmp.background_image) {
                matched = _tmp.background_image.match(regex);
                if (matched) {
                    for (var j=0; j<matched.length; j++){
                        var __tmp = matched[j].slice(1,matched[j].length);
                        if ($scope.selectedCard.attributes[__tmp]) {
                            _tmp.background_image = _tmp.background_image.replace(
                                matched[j],
                                $scope.selectedCard.attributes[__tmp]
                            )
                        }
                        else if($scope.selectedTemplate.attributes[__tmp]) {
                            _tmp.background_image = _tmp.background_image.replace(
                                matched[j],
                                $scope.selectedTemplate.attributes[__tmp]
                            )
                        }
                    }
                }
            }
            $scope.current_layout.convertedLayers.push(_tmp);
        }
    }

    $scope.$watch(function() {return $scope.selectedTemplate}, generatePreview, true);
    $scope.$watch(function() {return $scope.selectedCard}, generatePreview, true);

}]);
