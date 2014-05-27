var cardModule = angular.module('CardModule',[]);


cardModule.service('CardService', ['$http', '$q', function($http, $q) {
    return {
        storeCard: function(card) {
            var url ='/card/'
            if (card.id) url += card.id

            var http = $http.post(url, data = card)
            http.then(
                function(data){
                    card.id = data.uuid;
                },
                function(data){
                    alert('oops error');
                }
            );
            return http
        },
        getCards: function() {
            var defer = $q.defer();
            $http.get('/card/').then(
                function(data) {
                    defer.resolve(data.data.list);
                },
                defer.reject
            )
            return defer.promise;
        },
        getCardDetails: function(id) {
            var defer = $q.defer();
            $http.get('/card/'+id).then(
                function(data) {
                    defer.resolve(data.data);
                },
                defer.reject
            )
            return defer.promise;
        },
        deleteCard: function(id) {
            if (id) {
                console.log(id)
                $http.delete('/card/'+id);
            }
        }
    }
}]);
cardModule.factory('CardFactory', ['CardService', function(CardService){
    var CardFactory = function(data) {
        angular.extend(this, {
            name: "unnamed",
            id : null,
            saved: false,
            attributes: {},
            addAttribute: function(key,value){
                if(key) {
                    this.attributes[key] = value;
                    this.saved = false;
                    return true;
                }
                return false;
            },
            removeAttribute: function(key) {
                delete this.attributes[key];
                this.saved = false;
            },
            save: function() {
                CardService.storeCard(this).then(
                    (function(){
                        this.saved = true;
                    }).bind(this)
                );
            }
        });
        if (data)
            angular.extend(this, data);
    };
    return CardFactory;
}]);


cardModule.factory('CardListFactory', ['CardFactory', 'CardService', function(CardFactory, CardService){
    var CardListFactory = {};
    CardListFactory.cards =  [];

    CardListFactory.addCard = function(data) {
        var new_card = new CardFactory(data)
        CardListFactory.cards.push(new_card);
        return new_card
    }

    CardListFactory.loadCards = function() {
        CardService.getCards().then(
            function(data) {
                for (var i=0; i<data.length; i++) {
                    CardService.getCardDetails(data[i]).then(
                        function(card) {
                            card.saved = true;
                            CardListFactory.addCard(card);
                        }
                    )
                }
            }
        )
    }

    CardListFactory.delete = function(card) {
        console.log(CardListFactory.cards.indexOf(card));
        var index = CardListFactory.cards.indexOf(card);
        var delete_me = CardListFactory.cards.splice(index,1)[0];
        console.log(delete_me)
        CardService.deleteCard(delete_me.id);
    }

    return CardListFactory;
}]);
