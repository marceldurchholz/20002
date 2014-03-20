// UsersCollection.js
// -------------
define(["jquery", "backbone", "models/UserModel"],

  function($, Backbone, UserModel) {

    // Creates a new Backbone Collection class object
	var UsersCollection = Backbone.Collection.extend({
		initialize: function(models, options) {
			this.options = options || {};
			// console.log('UsersCollection.js: '+this.options.dbid);
			this.bind("error", this.errorHandler);			
			_thisCollection = this;
			var online = _thisCollection.online = 1;
			this._localStorage_users = new Store('users');
			var offlineData = this.offlineData = this._localStorage_users.findAll();
			this.localStorage = this._localStorage_users;
			if (_thisCollection.online==1) {
				// http://dominik-lohmann.de:5000/users/?id=042cb1572ffbea5d
				if (this.options.id && !this.options.dbid) this.options.dbid = this.options.id;
				if (this.options.dbid) this.url = 'http://dominik-lohmann.de:5000/users/?id='+this.options.dbid;
				if (this.options.sponsor) this.url = this.url+'&sponsor='+this.options.sponsor;
				// else this.url = 'http://dominik-lohmann.de:5000/users/';
				// console.log('UsersCollection.js: '+this.url);
				this.localStorage = null;
			}
		},
		model: UserModel,
		fetch: function(options) {
			// console.log('UsersCollection.js: options: '+options);
            options || (options = {});
            var data = (options.data || {});
            options.data = {date: this.date};
			var responseObject = Backbone.Collection.prototype.fetch.call(this, options);
			return responseObject;
		},
		sync: function(method, model, options) {
			// console.log('UsersCollection.js: sync');
			Backbone.sync.call(model, method, model, options);
		},
		parse: function(response) {
			if (!response.length) response = {"0":response};
			// console.log('UsersCollection.js: '+response);
			// console.log(response);
			// console.log(_.size(response));
			// console.log(response.id);
			response.length = _.size(response);
			_thisCollection.models = [];
			this._localStorage_users.models = [];
			for (n = 0; n < response.length; ++n) {
				model = response[n];
				// console.log('UsersCollection.js: '+model);
				if (this.options.hasOwnProperty('id')) {
					if (this.options.id == model.id) {
						_thisCollection.add(model);
						if (_thisCollection.online==1) this._localStorage_users.update(new UserModel(model));
					}
				}
				else {
					_thisCollection.add(model);
					if (_thisCollection.online==1) this._localStorage_users.update(new UserModel(model));
				}
			}
			return(_thisCollection.models);
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
		txErrorHandler: function(tx) {
			alert('error tx.message');
		}
	});

    // Returns the Model class
    return UsersCollection;

  }

);