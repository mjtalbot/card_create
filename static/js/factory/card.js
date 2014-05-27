var cardModule = angular.module('CardModule',[]);

cardModule.factory('CardFactory', function(){
    var CardFactory = function(data) {
        angular.extend(this, {
            name: "unnamed",
            attributes: {},
            addAttribute: function(key,value){
                if(key) {
                    this.attributes[key] = value;
                    return true
                }
                return false
            },
            removeAttribute: function(key) {
                delete this.attributes[key]
            }
        });
        if (data)
            angular.extend(this, data);
    };
    return CardFactory;
});

cardModule.factory('CardListFactory', ['CardFactory', function(CardFactory){
    var CardListFactory = {};
    CardListFactory.cards =  [];
    CardListFactory.addCard = function(data) {
        var new_card = new CardFactory(data)
        CardListFactory.cards.push(new_card);
        return new_card
    }
    return CardListFactory;
}]);
