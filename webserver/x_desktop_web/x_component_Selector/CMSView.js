MWF.xApplication.Selector = MWF.xApplication.Selector || {};
MWF.xDesktop.requireApp("Selector", "Person", null, false);
MWF.xApplication.Selector.CMSView = new Class({
	Extends: MWF.xApplication.Selector.Person,
    options: {
        "style": "default",
        "count": 0,
        "title": MWF.xApplication.Selector.LP.selectView,
        "values": [],
        "names": [],
        "expand": false
    },

    loadSelectItems: function(addToNext){
        this.cmsAction.listCMSApplicationView(function(json){
            if (json.data.length){
                json.data.each(function(data){
                    if (data.queryViews && data.queryViews.length){
                        var category = this._newItemCategory(data, this, this.itemAreaNode);
                        data.queryViews.each(function(d){
                            d.applicationName = data.appName;
                            var item = this._newItem(d, this, category.children);
                            this.items.push(item);
                        }.bind(this));
                    }
                }.bind(this));
            }
        }.bind(this));
    },

    _scrollEvent: function(y){
        return true;
    },
    _getChildrenItemIds: function(data){
        return data.queryViews || [];
    },
    _newItemCategory: function(data, selector, item, level){
        return new MWF.xApplication.Selector.CMSView.ItemCategory(data, selector, item, level)
    },

    _listItemByKey: function(callback, failure, key){
        return false;
    },
    _getItem: function(callback, failure, id, async){
        this.cmsAction.getQueryView(function(json){
            if (callback) callback.apply(this, [json]);
        }.bind(this), failure, ((typeOf(id)==="string") ? id : id.id), async);
    },
    _newItemSelected: function(data, selector, item){
        return new MWF.xApplication.Selector.CMSView.ItemSelected(data, selector, item)
    },
    _listItemByPinyin: function(callback, failure, key){
        return false;
    },
    _newItem: function(data, selector, container, level){
        return new MWF.xApplication.Selector.CMSView.Item(data, selector, container, level);
    }
});
MWF.xApplication.Selector.CMSView.Item = new Class({
	Extends: MWF.xApplication.Selector.Person.Item,
    _getShowName: function(){
        return this.data.name;
    },
    _setIcon: function(){
        this.iconNode.setStyle("background-image", "url("+"/x_component_Selector/$Selector/default/icon/processicon.png)");
    },
    loadSubItem: function(){
        return false;
    },
    checkSelectedSingle: function(){
        var selectedItem = this.selector.options.values.filter(function(item, index){
            if (typeOf(item)==="object") return (this.data.id === item.id) || (this.data.name === item.name) ;
            if (typeOf(item)==="string") return (this.data.id === item) || (this.data.name === item);
            return false;
        }.bind(this));
        if (selectedItem.length){
            this.selectedSingle();
        }
    },
    checkSelected: function(){
        var selectedItem = this.selector.selectedItems.filter(function(item, index){
            return (item.data.id === this.data.id) || (item.data.name === this.data.name);
        }.bind(this));
        if (selectedItem.length){
            //selectedItem[0].item = this;
            selectedItem[0].addItem(this);
            this.selectedItem = selectedItem[0];
            this.setSelected();
        }
    }
});

MWF.xApplication.Selector.CMSView.ItemSelected = new Class({
	Extends: MWF.xApplication.Selector.Person.ItemSelected,
    _getShowName: function(){
        return this.data.name;
    },
    _setIcon: function(){
        this.iconNode.setStyle("background-image", "url("+"/x_component_Selector/$Selector/default/icon/processicon.png)");
    },
    check: function(){
        if (this.selector.items.length){
            var items = this.selector.items.filter(function(item, index){
                return (item.data.id === this.data.id) || (item.data.name === this.data.name);
            }.bind(this));
            this.items = items;
            if (items.length){
                items.each(function(item){
                    item.selectedItem = this;
                    item.setSelected();
                }.bind(this));
            }
        }
    }
});

MWF.xApplication.Selector.CMSView.ItemCategory = new Class({
    Extends: MWF.xApplication.Selector.Person.ItemCategory,
    _getShowName: function(){
        return this.data.appName;
    },
    createNode: function(){
        this.node = new Element("div", {
            "styles": this.selector.css.selectorItemCategory_department
        }).inject(this.container);
    },
    _setIcon: function(){
        this.iconNode.setStyle("background-image", "url("+"/x_component_Selector/$Selector/default/icon/applicationicon.png)");
    },
    _hasChild: function(){
        return (this.data.queryViews && this.data.queryViews.length);
    },
    check: function(){}
});
