var twitterServices = angular.module('TwitterFactory',[]);

twitterServices.factory('TwitterFactory', function(){
    var TwitterFactory = function(profile, timeline) {
        this.location = profile.location;
        this.name = profile.name;
        this.favourites_count = profile.favourites_count;
        this.followers_count = profile.followers_count;
        this.friends_count = profile.friends_count;
        this.image = profile.high_profile_image_url;

        this.avg_retweets = function() {
            var retweet_count = 0;
            for (var i =0; i < timeline.length; i ++) {
                retweet_count += timeline[i].retweet_count;
            }
            return retweet_count/timeline.length;
        }()

        this.avg_hashtags = function() {
            var hashtag_count = 0;
            for (var i =0; i < timeline.length; i ++) {
                if (timeline[i].entities.hashtags)
                    hashtag_count += timeline[i].entities.hashtags.length;
            }
            return hashtag_count/timeline.length;
        }()

        this.avg_words = function() {
            var word_count = 0;
            for (var i =0; i < timeline.length; i ++) {
                word_count += timeline[i].text.split(' ').length
            }
            return word_count/timeline.length;
        }()

        this.avg_user_mentions = function() {
            var user_mentions = 0;
            for (var i =0; i < timeline.length; i ++) {
                if (timeline[i].entities.user_mentions)
                    user_mentions += timeline[i].entities.user_mentions.length;
            }
            return user_mentions/timeline.length;
        }()
    }
    return TwitterFactory;
});

twitterServices.service('TwitterService', ['TwitterFactory', '$http', '$q', function(TwitterFactory, $http, $q){
    var TwitterService = {};
    TwitterService.search = function(name) {
        var def = $q.defer();
        $http.get('/profile/'+name).then(
            function(data){
                var profile = data.data.profile;
                $http.get('/timeline/'+name).then(
                    function(data) {
                        var timeline = data.data.timeline;
                        var new_account = new TwitterFactory(profile, timeline);
                        def.resolve(new_account);
                    },
                    def.reject
                )
            },
            def.reject
        )
        return def.promise;
    }
    return TwitterService;
}]);
