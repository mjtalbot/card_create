var app = angular.module('app');

app.controller('CardController', ['$scope', 'CardListFactory', 'TwitterService',
function ($scope, CardList, Twitter) {
    $scope.twitter ={
        search: null,
        error: false,
        searching: false
    };

    $scope.currentCard = null;
    $scope.cards = CardList.cards;
    CardList.loadCards();

    $scope.new_attr_name = '';
    $scope.new_attr_value = '';

    var addTwitterAccount = function(data) {
        $scope.twitter.searching = false;
        $scope.twitter.error = false;

        CardList.addCard({
            name:data.name,
            attributes: {
                location: data.location,
                favourites_count: data.favourites_count,
                followers_count: data.followers_count,
                friends_count: data.friends_count,
                image: data.image,
                avg_retweets: data.avg_retweets,
                avg_hashtags: data.avg_hashtags,
                avg_words: data.avg_words,
                avg_user_mentions: data.avg_user_mentions
            }
        });
        $scope.twitter.search = '';
    };


    var twitterError = function() {
        $scope.twitter.searching = false;
        $scope.twitter.error = true;
    };

    $scope.searchTwitter = function() {
        $scope.twitter.searching = true;
        $scope.twitter.error = false;
        Twitter.search($scope.twitter.search).then(addTwitterAccount, twitterError);
    };

    $scope.selectCard = function(index) {
        $scope.currentCard = $scope.cards[index];
    };

    $scope.addCard = function(){
        $scope.currentCard = CardList.addCard();
    };

    $scope.addAttribute = function() {
        $scope.currentCard.addAttribute(
            $scope.new_attr_name, $scope.new_attr_value
        );
        $scope.new_attr_name= '';
        $scope.new_attr_value = '';
    };

    $scope.removeAttribute = function(attribute) {
        $scope.currentCard.removeAttribute(attribute);
    };

    $scope.save = function() {
        $scope.currentCard.save();
    };

    $scope.delete = function() {
        CardList.delete($scope.currentCard);
        $scope.currentCard = null;
    };

    $scope.successUpload = function(input) {
        $scope.new_attr_value = input.data.url;
    };
}]);
