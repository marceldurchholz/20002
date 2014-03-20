// AdminUserCollection.js
// -------------
define(["jquery", "backbone", "models/AdminUserModel"],

  function($, Backbone, AdminUserModel) {

    // Creates a new Backbone Collection class object
	var AdminUserCollectionVar = Backbone.Collection.extend({
		comparator: function( collection ){
			return( collection.get( 'username' ) );
		},
		initialize: function(models, options) {
			this.options = options || {};
			this.bind("error", this.errorHandler);
			this.bind("success", this.successHandler);
			_thisCollectionAdminUser = this;
			var online = _thisCollectionAdminUser.online = 1;
			this._localStorage_AdminUser = new Store('users');
			var offlineData = this.offlineData = this._localStorage_AdminUser.findAll();
			this.localStorage = this._localStorage_AdminUser;
			if (_thisCollectionAdminUser.online==1) {
				// http://dominik-lohmann.de:5000/users/?id=f0cebeb4f451982b&sponsor=df8a74e899bba811
				this.url = 'http://dominik-lohmann.de:5000/users/';
				if (this.options.sponsor!=undefined) {
					this.url = this.url+"?sponsor="+this.options.sponsor;
					// alert(this.url);
				}
				else {
					// alert('this.options.sponsor NOT setted');
				}
				this.localStorage = null;
			}
		},
		model: AdminUserModel,
		fetch: function(options) {
            options || (options = {});
            var data = (options.data || {});
            options.data = {date: this.date};
			var responseObject = Backbone.Collection.prototype.fetch.call(this, options);
			return responseObject;
		},
		sync: function(method, model, options) {
			var bla = Backbone.sync.call(model, method, model, options);
			// console.log(bla);
			console.log(options);
			console.log(method);
			console.log(model);
		},
		parse: function(responseAdminUser) {
			console.log('parse responseAdminUser');
			console.log(responseAdminUser);
			console.log(responseAdminUser.length);
			_thisCollectionAdminUser.models = [];
			this._localStorage_AdminUser.models = [];
			if (responseAdminUser.length==undefined) {
				// alert('put into array');
				var myArray = new Array();
				myArray[0] = responseAdminUser;
				responseAdminUser = myArray;
				console.log(myArray);
			}
			for (n = 0; n < responseAdminUser.length; ++n) {
				console.log('yiehpaa');
				model = responseAdminUser[n];
				if (this.options.hasOwnProperty('id')) {
					if (this.options.id == model.id) {
						_thisCollectionAdminUser.add(model);
						if (_thisCollectionAdminUser.online==1) this._localStorage_AdminUser.update(new AdminUserModel(model));
					}
				}
				else {
					_thisCollectionAdminUser.add(model);
					if (_thisCollectionAdminUser.online==1) _thisCollectionAdminUser._localStorage_AdminUser.update(new AdminUserModel(model));
					var sponsot = model.sponsor;
				}
			}
			console.log('blafoopeng');
			console.log(_thisCollectionAdminUser);
			console.log(_thisCollectionAdminUser.models);
			return(_thisCollectionAdminUser.models);
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
		}
	});

    // Returns the Model class
    return AdminUserCollectionVar;

  }

);