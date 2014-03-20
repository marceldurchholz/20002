// AnswersCollection.js
// -------------
define(["jquery", "backbone", "models/AnswerModel"],

  function($, Backbone, AnswerModel) {

    // Creates a new Backbone Collection class object
	var AnswersCollectionVar = Backbone.Collection.extend({
		/*
		comparator: function( collection ){
			return( collection.get( 'topic' ) );
		},
		*/
		localStorage: new Store('answersy'),
		model: AnswerModel,
		/*
		fetch: function(options) {
			if (_thisCollectionAnswers.online==1) {
				dpd.users.me(function(user) {
					if (user) {
						// alert(user.roles);
						_thisCollectionAnswers.user = user;
						// console.log(user.roles);
					}
					else {
						// location.href = "#noaccess";
						// console.log('you are not logged in');
					}
				});
			}
			options || (options = {});
            var data = (options.data || {});
            options.data = {date: this.date};
			var responseObject = Backbone.Collection.prototype.fetch.call(this, options);
			return responseObject;
		},
		/*
		sync: function(method, model, options) {
			Backbone.sync.call(model, method, model, options);
		},
		parse: function(responseAnswers) {
			console.log('parse responseAnswers');
			// console.log(_thisCollectionSidemenu.user);
			_thisCollectionAnswers.models = [];
			this.localStorage.models = [];
			for (n = 0; n < responseAnswers.length; ++n) {
				model = responseAnswers[n];
				if (this.options.hasOwnProperty('id')) {
					if (this.options.id == model.id) {
						// alert('id setted');
						_thisCollectionAnswers.add(model);
						if (_thisCollectionAnswers.online==1) this.localStorage.update(new AnswerModel(model));
					}
				}
				else {
					_thisCollectionAnswers.add(model);
					if (_thisCollectionAnswers.online==1) _thisCollectionAnswers.localStorage.update(new AnswerModel(model));
					var userid = model.uploader;
				}
			}
			console.log(_thisCollectionAnswers.models);
			return(_thisCollectionAnswers.models);
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
		*/
	});

    // Returns the Model class
    return AnswersCollectionVar;

  }

);