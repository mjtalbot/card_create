var app = angular.module('app');

app.controller('CardController', ['$scope', 'CardListFactory',
function ($scope, CardList) {
    $scope.current_card = null;
    $scope.cards = CardList.cards;

    $scope.new_attr_name = '';
    $scope.new_attr_value = '';
    $scope.selectedCardIndex = "";

    $scope.selectCard = function(index) {
        $scope.current_card = $scope.cards[index];
        $scope.selectedCardIndex = index;
    }

    $scope.addCard = function(){
        $scope.current_card = CardList.addCard();
    }

    $scope.addAttribute = function() {
        $scope.current_card.addAttribute(
            $scope.new_attr_name, $scope.new_attr_value
        );
        $scope.new_attr_name= '';
        $scope.new_attr_value = '';
    }

    $scope.removeAttribute = function(attribute) {
        $scope.current_card.removeAttribute(attribute);
    }
}]);
