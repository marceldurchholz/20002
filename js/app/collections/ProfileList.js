// ProfileList.js
// -------------
define(["jquery", "backbone", "models/Profile", "backbone.LocalStorage"],

  function($, Backbone, Profile, LocalStorageAdapter) {

  
    // Creates a new Backbone Collection class object
	var ProfileList = Backbone.Collection.extend({
		// remote: true, // never cached, dualStorage is bypassed entirely
		// local: true,  // always fetched and saved only locally, never saves on remote
		// local: function() { return true; }, // local and remote can also be dynamic
		model: Profile,
		// url: 'profiles.jsonx'
		// url: 'http://mobile002.appinaut.de/api/employees/index.php', 
		// url: 'http://dominik-lohmann.de:5000/users/?{%22zip%22:%20%2222415%22}',
		initialize: function() {
			//// console.log('***** initialize');
			this.bind("error", this.errorHandler);			
			_thisCollection = this;
			var online = _thisCollection.online = 1;
			this._localStorage_users = new Store('users');
			var offlineData = this.offlineData = this._localStorage_users.findAll();
			// this._localStorage_videos = new Store('videos');
			this.localStorage = this._localStorage_users;
			if (_thisCollection.online==1) {
				this.url = 'http://dominik-lohmann.de:5000/users/';
				this.localStorage = null;
			}
		},
		fetch: function(options) {
			// console.log('***** fetch');
            options || (options = {});
            var data = (options.data || {});
            options.data = {date: this.date};
			// console.log(Backbone.ajaxSync('read', this, options));
			var responseObject = Backbone.Collection.prototype.fetch.call(this, options);
			return responseObject;
		},
		sync: function(method, model, options) {
			// var bla = Backbone.sync.call(model, method, model, options);
			// console.log('***** sync');
			Backbone.sync.call(model, method, model, options);
		},
		parse: function(response) {
			//// console.log('***** parse');
			// var offlineData = this._localStorage_users.findAll();
			//// console.log('this.offlineData');
			//// console.log(this.offlineData);
			// console.log(response);			

			/*
			for (n = 0; n < this._offlineData.length; ++n) {
				arg = this._offlineData[n];
				console.log("typeof this._offlineData[" + n + "] = " + typeof arg);
				for (name in arg) {
					console.log("this._offlineData[" + n + "][" + name + "]=" + arg[name]);
				}
			}
			*/
			// console.log('response');
			// console.log(response);

			// console.log('schleife');
			// this._localStorage_users.
			
			// var myColl = new Array();
			_thisCollection.models = [];
			this._localStorage_users.models = [];
			
			for (n = 0; n < response.length; ++n) {
				model = response[n];
				_thisCollection.add(model);
				// console.log('testoutput');
				//// console.log('--- model');
				//// console.log(model);
				// this._localStorage_users.create(new Profile({"fullname": "offline James King", "device": "5645-6543-5415-5233", "credits": "120", "pictureurl": "http://www.redner24.de/typo3temp/GB/Durchholz_Marcel_4c_1090c3626b_Durc_a4ff6064ff.jpg"}));
				// alert(_thisCollection.online);
				if (_thisCollection.online==1) this._localStorage_users.update(new Profile(model));
				// myColl[n] = model;
				// var myModel = model;
				// myColl.push(myModel);
				
				// console.log("typeof response[" + n + "] = " + typeof model);
				// for (name in model) {
					// console.log("response[" + n + "][" + name + "]=" + model[name]);
				// }

			}
			// console.log(myColl);
			
			// _thisCollection.models = myColl;
			// this._localStorage_users = myColl;
			
			// console.log(_thisCollection.models);
			
			/*
			_.each(response, function(model) {
				_thisCollection.add(model);
			});
			*/
			// console.log(this._localStorage_users.findAll());
			// return(this._localStorage_users.localStorage());
			console.log(_thisCollection.models);
			console.log(this._localStorage_users);
			// return(this._localStorage_users.findAll());
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
    return ProfileList;

  }

);