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
        if ($scope.selectedTemplate == "") {
            return
        }

        $scope.current_layout.width = $scope.selectedTemplate.css.width;
        $scope.current_layout.height = $scope.selectedTemplate.css.height;

        $scope.current_layout.convertedLayers = [];
        var tmp = $scope.selectedTemplate.layers;
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

                        if (__tmp == '#name') {
                            _tmp.text = _tmp.text.replace(
                                __tmp,
                                $scope.selectedCard[__tmp.slice(1,__tmp.length)]
                            );
                        }
                        else {
                            _tmp.text = _tmp.text.replace(
                                __tmp,
                                $scope.selectedCard.attributes[__tmp.slice(1,__tmp.length)]
                            );
                        }
                    }
                }
            }

            if (_tmp.background_image) {
                matched = _tmp.background_image.match(regex);
                if (matched) {
                    for (var j=0; j<matched.length; j++){
                        var __tmp = matched[j];
                        _tmp.background_image = _tmp.background_image.replace(
                            __tmp,
                            $scope.selectedCard.attributes[__tmp.slice(1,__tmp.length)]
                        )
                    }
                }
            }

            $scope.current_layout.convertedLayers.push(_tmp);
        }
    }

    $scope.$watch(function() {return $scope.selectedTemplate}, generatePreview, true);
    $scope.$watch(function() {return $scope.selectedCard}, generatePreview, true);

}]);
