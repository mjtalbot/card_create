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


templateModule.service('TemplateService', ['$http', '$q', function($http, $q) {
    return {
        storeTemplate: function(template) {
            var url ='/template/'
            if (template.id) url += template.id

            var http = $http.post(url, data = template)
            http.then(
                function(data){
                    template.id = data.uuid;
                },
                function(data){
                    alert('oops error');
                }
            );
            return http
        },
        getTemplates: function() {
            var defer = $q.defer();
            $http.get('/template/').then(
                function(data) {
                    defer.resolve(data.data.list);
                },
                defer.reject
            )
            return defer.promise;
        },
        getTemplateDetails: function(id) {
            var defer = $q.defer();
            $http.get('/template/'+id).then(
                function(data) {
                    defer.resolve(data.data);
                },
                defer.reject
            )
            return defer.promise;
        },
        deleteTemplate: function(id) {
            if (id) {
                $http.delete('/template/'+id);
            }
        }
    }
}]);

templateModule.factory('TemplateFactory', ['LayerFactory', 'TemplateService', function(LayerFactory, TemplateService){
    var TemplateFactory = function(data) {
        angular.extend(this, {
            name: 'unnamed',
            id: null,
            saved:false,
            css: {
                width: 300,
                height: 450,
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
            },
            save: function() {
                TemplateService.storeTemplate(this).then(
                    (function(){
                        this.saved = true;
                    }).bind(this)
                );
            }
        });
        if (data)
            angular.extend(this,data);
    }
    return TemplateFactory;
}]);


templateModule.factory('TemplateListFactory', ['TemplateFactory', 'TemplateService',
function(TemplateFactory, TemplateService){
    var TemplateListFactory = {};
    TemplateListFactory.templates = [];
    TemplateListFactory.selectedTemplate = null;
    TemplateListFactory.selectedLayer = null;

    TemplateListFactory.addTemplate = function(template) {
        TemplateListFactory.templates.push(new TemplateFactory(template));
    }
    TemplateListFactory.deleteTemplate = function(template) {
        var index = TemplateListFactory.templates.indexOf(template);
        TemplateListFactory.templates.splice(index,1);
        TemplateService.deleteTemplate(template.id);
        TemplateListFactory.selectedTemplate = null;
        TemplateListFactory.selectedLayer = null;

    }
    TemplateListFactory.selectTemplate = function(template) {
        TemplateListFactory.selectedTemplate = template;
        TemplateListFactory.selectedLayer = null;
    }

    TemplateListFactory.loadTemplates = function() {
        TemplateService.getTemplates().then(
            function(data) {
                for (var i=0; i<data.length; i++) {
                    TemplateService.getTemplateDetails(data[i]).then(
                        function(template) {
                            template.saved = true;
                            TemplateListFactory.addTemplate(template);
                        }
                    )
                }
            }
        )
    }

    TemplateListFactory.delete = function(template) {
        var index = TemplateListFactory.templates.indexOf(template);
        var delete_me = TemplateListFactory.templates.splice(index,1)[0];
        TemplateService.deleteTemplate(delete_me.id);
    }
    return TemplateListFactory;
}]);
