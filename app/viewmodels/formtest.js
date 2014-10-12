define(['plugins/http', 'durandal/app', 'knockout', 'jstree', 'bootstrap', 'jquery-ui'], function (http, app, ko, jstree, bootstrap) {

    return {
        displayName: 'formtest',

        selectedGeographicType: ko.observable(),

        geographicTypes: ko.observableArray([]),
        useGeographicFilter: ko.observable(),
        geoFilters: ko.observableArray([]),

        assetTypes: ko.observableArray([]),
        useAssetFilter: ko.observable(),
        assetFilters: ko.observableArray([]),

        geoTreeNodes: null,
        assetTreeNodes: null,
        assetTree: null,
        geoTree: null,

        activate: function () {
            var that = this;
            $.get( "querydata.json",
                function(data) {
                    var geoTreeNodes = [];
                    $(data['GeographicTypes']).each(function () {
                        var geoTypeName = Object.getOwnPropertyNames (this)[0];
                        that.geographicTypes().push(geoTypeName);
                        var geoTreeNode = {};
                        geoTreeNode.children = [];
                        geoTreeNode.text = geoTypeName;
                        geoTreeNode.a_attr = {'selectionId' : geoTypeName},
                        geoTreeNode.selectionId = geoTypeName;
                        geoTreeNode.state = { 'opened' : false, 'selected' : false };
                        that.geoTreeNode = geoTreeNode;
                        var $this = $(this);
                        $(this[geoTypeName]).each(function (index, childElement) {
                            var child = {};
                            child.text = childElement.Name;
                            child.a_attr = {'selectionId' : childElement.Value},
                            child.state = { 'opened' : false, 'selected' : false };
                            child.parentId = that.geoTreeNode.selectionId;
                            that.geoTreeNode.children.push(child);
                        });

                        geoTreeNodes.push(geoTreeNode);

                    });
                    that.geoTreeNodes = geoTreeNodes;

                    var assetTreeNodes = [];
                    $(data['AssetTypes']).each(function () {
                        var assetTypeName = Object.getOwnPropertyNames (this)[0];
                        var assetTreeNode = {};
                        assetTreeNode.children = [];
                        assetTreeNode.text = assetTypeName;
                        assetTreeNode.a_attr = {'selectionId' : assetTypeName},
                        assetTreeNode.selectionId = assetTypeName;
                        assetTreeNode.state = { 'opened' : false, 'selected' : false };
                        that.assetTreeNode = assetTreeNode;
                        $(this[assetTypeName]).each(function (index, childElement) {
                            var child = {};
                            child.text = childElement.Name;
                            child.a_attr = {'selectionId' : childElement.Value},
                            child.state = { 'opened' : false, 'selected' : false };
                            child.parentId = that.assetTreeNode.selectionId;
                            that.assetTreeNode.children.push(child);
                        });

                        assetTreeNodes.push(assetTreeNode);

                    });
                    that.assetTreeNodes = assetTreeNodes;
                }
            );
        },

        attached: function (view, parent) {
            var that =this;
            $('#assetTree').jstree({'plugins':["checkbox"], 'core' : {
                'data' : this.assetTreeNodes
            }}).on('changed.jstree', function (e, data) {
                that.updateAssetSelection(e, data)
            });

            $('#geoTree').jstree({'plugins':["checkbox"], 'core' : {
                'data' : this.geoTreeNodes
            }}).on('changed.jstree', function (e, data) {
                that.updateGeoSelection(e, data)
            });

            this.useGeographicFilter.subscribe(function(newValue) {
                var oldValue = that.useGeographicFilter();
                if(oldValue){
                    $("#geoTree").jstree("uncheck_all",true);
                    that.useAssetFilter();
                    that.assetFilters([]);
                }
            }, null, "beforeChange");

            this.useAssetFilter.subscribe(function(newValue) {
                var oldValue = that.useAssetFilter();
                if(oldValue){
                    $("#assetTree").jstree("uncheck_all",true);
                }
            }, null, "beforeChange");
        },

        updateGeoSelection: function (e, data) {
            var values = $("#geoTree").jstree("get_checked",{full:true},true) ;
            if(values.length > 0){
                this.geoFilters(values);
            }else{
                this.geoFilters([]);
            }
        },

        updateAssetSelection: function (e, data) {
            var values = $("#assetTree").jstree("get_checked",{full:true},true) ;
            if(values.length > 0){
                this.assetFilters(values);
            }else{
                this.assetFilters([]);
            }
        },

    };
});