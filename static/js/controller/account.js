var module = angular.module('app', ['TwitterFactory', 'TemplateModule', 'CardModule', 'selectionModel']);

module.controller('twitterAccountController', ['$scope', 'AccountListFactory',
function ($scope, AccountListFactory) {
    $scope.search = '';
    $scope.error = false;
    $scope.searching = false;
    $scope.attributes = [
        'location', 'name', 'image', 'favourites_count','followers_count','friends_count',
        'avg_retweets', 'avg_hashtags', 'avg_words', 'avg_user_mentions'
    ];

    $scope.accounts = AccountListFactory.accounts;

    $scope.getSearch = function() {
        $scope.searching = true;
        $scope.error = false;
        AccountListFactory.addAccount($scope.search).then($scope.update, $scope.error_func);
        $scope.search = '';
    }

    $scope.update = function() {
        $scope.searching = false;
        $scope.error = false;
    }
    $scope.error_func = function() {
        $scope.searching = false;
        $scope.error = true;
    }
}]);
