var templateModule = angular.module('TemplateModule',[]);

templateModule.factory('LayerFactory', function(){
    var LayerFactory = function() {
        angular.extend(this, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: 0,
            left: 0,
            text: null,
            background_image: null
        });
    };
    return LayerFactory;
});

templateModule.factory('TemplateFactory', ['LayerFactory', function(LayerFactory){
    var TemplateFactory = {};
    TemplateFactory.layers =  [];
    TemplateFactory.width = 400;
    TemplateFactory.height = 600;
    TemplateFactory.addLayer = function() {
        TemplateFactory.layers.push(new LayerFactory());
    }
    TemplateFactory.removeLayer = function(index) {
        TemplateFactory.layers.splice(index,1);
    }
    return TemplateFactory;
}]);
