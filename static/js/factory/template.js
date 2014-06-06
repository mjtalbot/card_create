var templateModule = angular.module('TemplateModule',[]);

templateModule.factory('LayerFactory', function(){
    var LayerFactory = function(data) {
        angular.extend(this, {
            name: null,
            text: null,
            background_image: null,
            css: [],
            addAttribute: function(key, value) {
                if (key)
                    this.css.push({
                        key: key,
                        value: value
                    });
            },
            deleteAttribute: function(index) {
                this.css.splice(index, 1);
            },
            setText: function(text) {
                this.text = text;
            },
            deleteText: function() {
                this.text = null;
            },
            setBackgroundImage: function(background_image) {
                this.background_image = background_image;
            },
            deleteBackgroundImage: function() {
                this.background_image = null;
            },
            calculateStyle: function() {
                var out = '';
                for (var i =0; i < this.css.length; i++) {
                    out += '#key:#value;'.replace('#key', this.css[i].key).replace('#value', this.css[i].value);
                }
                this.style_sheet = out;
            },
            style_sheet: ''
        });
        if (data)
            angular.extend(this, data);
        else {
            angular.extend(this, {
                css : [
                    {
                        key: 'width',
                        value: '100px'
                    },
                    {
                        key: 'height',
                        value: '100px'
                    },
                    {
                        key: 'position',
                        value: 'absolute'
                    },
                    {
                        key: 'top',
                        value: '0px'
                    },
                    {
                        key: 'left',
                        value: '0px'
                    }
                ]
            });
        }
        this.calculateStyle();

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
            addAttribute: function(key, value){
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
            addLayer: function(data) {
                this.layers.push(new LayerFactory(data));
            },
            removeLayer: function(index){
                this.layers.splice(index,1);
            },
            cloneLayer: function(index) {
                this.addLayer(angular.copy(this.layers[index]));
            },
            switchPlaces: function(index_a, index_b) {
                var tmp, obj_a, obj_b;
                //force a < b
                if (index_b < index_a) {
                    tmp = index_a;
                    index_a = index_b;
                    index_b = tmp;
                }
                obj_b = this.layers.splice(index_b, 1)[0];
                obj_a = this.layers.splice(index_a, 1, obj_b)[0];
                this.layers.splice(index_b, 0, obj_a);
            },
            save: function() {
                TemplateService.storeTemplate(this).then(
                    (function(){
                        this.saved = true;
                    }).bind(this)
                );
            }
        });
        if (data) {
            var layers = data.layers;
            var layer;
            delete data.layers;
            angular.extend(this,data);
            while (layer = layers.shift()) {
                this.layers.push(new LayerFactory(layer));
            }

        }
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
