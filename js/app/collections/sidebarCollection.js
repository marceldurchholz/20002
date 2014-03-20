// SidebarCollection.js
// -------------
define(["jquery", "backbone", "models/SidebarModel"],

  function($, Backbone, SidebarModel) {

    // Creates a new Backbone Collection class object
	var SidebarCollection = Backbone.Collection.extend({
		initialize: function(models, options) {
			// console.log('options');
			// console.log(options);
			this.options = options || {};
			// this.options.id = this.options.id || 0;
			
			// console.log('this');
			// console.log(this);
			this.bind("error", this.errorHandler);
			this.bind("success", this.successHandler);
			_thisCollectionSidebar = this;
			var online = _thisCollectionSidebar.online = 1;
			this._localStorage_sidebar = new Store('videos');
			var offlineData = this.offlineData = this._localStorage_sidebar.findAll();
			this.localStorage = this._localStorage_sidebar;
			if (_thisCollectionSidebar.online==1) {
				this.url = 'http://dominik-lohmann.de:5000/sidemenu/';
				// this.url = 'http://dominik-lohmann.de:5000/videos/d6c9268c49a139bf';
				this.localStorage = null;
			}
		},
		model: SidebarModel,
		fetch: function(options) {
            options || (options = {});
            var data = (options.data || {});
            options.data = {date: this.date};
			var responseObject = Backbone.Collection.prototype.fetch.call(this, options);
			return responseObject;
		},
		sync: function(method, model, options) {
			Backbone.sync.call(model, method, model, options);
		},
		parse: function(response) {
			_thisCollectionSidebar.models = [];
			this._localStorage_sidebar.models = [];
			for (n = 0; n < response.length; ++n) {
				model = response[n];
				if (this.options.hasOwnProperty('id')) {
					if (this.options.id == model.id) {
						// alert('id setted');
						_thisCollectionSidebar.add(model);
						if (_thisCollectionSidebar.online==1) this._localStorage_sidebar.update(new SidebarModel(model));
					}
				}
				else {
					_thisCollectionSidebar.add(model);
					if (_thisCollectionSidebar.online==1) this._localStorage_sidebar.update(new SidebarModel(model));
				}
			}
			return(_thisCollectionSidebar.models);
		},
		errorHandler: function(xhr) {
			console.log(xhr);
			if (xhr.status=='404') {
				if (xhr.responseJSON==undefined) {
					alert('probably no internet connection');
				}
				else {
					alert('probably request url wrong or not reachable');
				}
			}
		},
		successHandler: function(xhr) {
			alert('successHandler');
			console.log(xhr);
		},
		/*
		txErrorHandler: function(tx) {
			alert('error tx.message');
		}
		*/
	});

    // Returns the Model class
    return SidebarCollection;

  }

);