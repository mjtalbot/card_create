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
    var TemplateFactory = function(data) {
        angular.extend(this, {
            name: 'unnamed',
            id: null,
            saved:false,
            css: {
                width: 400,
                height: 600,
            },
            layers: [],
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
            addLayer: function() {
                this.layers.push(new LayerFactory());
            },
            removeLayer: function(index){
                this.layers.splice(index,1);
            }
        });
        angular.extend(this,data);
    }
    return TemplateFactory;
}]);


templateModule.factory('TemplateListFactory', ['TemplateFactory', function(TemplateFactory){
    var TemplateListFactory = {};
    TemplateListFactory.templates = [];
    TemplateListFactory.selectedTemplate = null;
    TemplateListFactory.selectedLayer = null;

    TemplateListFactory.addTemplate = function() {
        TemplateListFactory.templates.push(new TemplateFactory());
        console.log(TemplateListFactory.templates)
    }
    TemplateListFactory.deleteTemplate = function(template) {
        var index = TemplateListFactory.indexOf(template);
        TemplateListFactory.templates.splice(index,1);
    }
    TemplateListFactory.selectTemplate = function(template) {
        TemplateListFactory.selectedTemplate = template;
        TemplateListFactory.selectedLayer = null;
    }
    return TemplateListFactory;
}]);
