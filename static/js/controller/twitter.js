var module = angular.module('app', ['TwitterFactory', 'TemplateModule', 'CardModule', 'selectionModel']);

module.controller('twitterAccountController', ['$scope', 'TwitterService', 'CardListFactory',
function ($scope, TwitterService, CardList) {
    $scope.search = '';
    $scope.error = false;
    $scope.searching = false;


    $scope.getSearch = function() {
        $scope.searching = true;
        $scope.error = false;
        TwitterService.search($scope.search).then($scope.update, $scope.error_func);
        $scope.search = '';
    }

    $scope.update = function(data) {
        $scope.searching = false;
        $scope.error = false;

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
        })
    }
    $scope.error_func = function() {
        $scope.searching = false;
        $scope.error = true;
    }
}]);
