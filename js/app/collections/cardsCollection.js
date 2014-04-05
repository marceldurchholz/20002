// CardsCollection.js
// -------------
define(["jquery", "backbone", "models/CardModel"],

  function($, Backbone, CardModel) {

    // Creates a new Backbone Collection class object
	var CardsCollectionVar = Backbone.Collection.extend({
		comparator: function( collection ){
			return( collection.get( 'topic' ) );
		},
		initialize: function(models, options) {
			this.options = options || {};
			this.bind("error", this.errorHandler);
			this.bind("success", this.successHandler);
			_thisCollectionCards = this;
			var online = _thisCollectionCards.online = 1;
			this._localStorage_cards = new Store('cards');
			var offlineData = this.offlineData = this._localStorage_cards.findAll();
			this.localStorage = this._localStorage_cards;
			if (_thisCollectionCards.online==1) {
				this.url = 'http://dominik-lohmann.de:5000/cards/?active=true&deleted=false';
				if (window.system.master!=true) this.url = this.url + "&uploader=" + window.system.aoid;
				if (this.options.cardid!=undefined) {
					this.url = this.url+this.options.cardid;
					// alert(this.url);
				}
				// this.url = 'http://dominik-lohmann.de:5000/cards/d6c9268c49a139bf';
				this.localStorage = null;
			}
		},
		model: CardModel,
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
		parse: function(responseCards) {
			console.log('parse responseCards');
			console.log(responseCards);
			console.log(responseCards.length);
			_thisCollectionCards.models = [];
			this._localStorage_cards.models = [];
			if (responseCards.length==undefined) {
				// alert('put into array');
				var myArray = new Array();
				myArray[0] = responseCards;
				responseCards = myArray;
				console.log(myArray);
			}
			for (n = 0; n < responseCards.length; ++n) {
				console.log('yiehpaa');
				model = responseCards[n];
				if (this.options.hasOwnProperty('id')) {
					if (this.options.id == model.id) {
						_thisCollectionCards.add(model);
						if (_thisCollectionCards.online==1) this._localStorage_cards.update(new CardModel(model));
					}
				}
				else {
					_thisCollectionCards.add(model);
					if (_thisCollectionCards.online==1) _thisCollectionCards._localStorage_cards.update(new CardModel(model));
					var userid = model.uploader;
				}
			}
			console.log('blafoopeng');
			console.log(_thisCollectionCards);
			console.log(_thisCollectionCards.models);
			return(_thisCollectionCards.models);
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
    return CardsCollectionVar;

  }

);