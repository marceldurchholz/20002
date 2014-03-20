// CardStartView.js
// -------
define(["jquery", "backbone", "models/CardModel", "collections/cardsCollection", "collections/answersCollection", "models/AnswerModel", "views/CardView", "text!templates/cardStartView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, CardModel, cardsCollection, answersCollection, AnswerModel, CardListViewItems, cardsStartViewHTML, sidemenusList, SidemenuView){
		
			var CardStartViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				createCard: function (event) {
					event.preventDefault();
					if (this._cardsCollection.online==0) {
						alert('in offline mode you can not add data');
					}
					else {
						var username = ''+Math.floor((Math.random()*10000)+1);
						var password = ''+Math.floor((Math.random()*10000)+1);
						this.create(new CardModel({"uploader": "042cb1572ffbea5d", "cardurl": "http://xyz.de.com.uk", "title": "This is a card title", "description": "This is a description", "price": "35", "thumbnailurl": "http://www.cbr250r.com.au/images/card-thumbnail.jpg"}));
					}
					return(false);
				},
				create: function(model) {
					_thisViewCardStart = this;
					$.ajax('http://dominik-lohmann.de:5000/cards', {
					  type: "POST",
					  contentType: "application/json",
					  data: JSON.stringify(model.attributes),
					  success: function(todo) {
						_thisViewCardStart.fetch();
					  }, 
					  error: function(xhr,b) {
						console.log(xhr);
						alert(xhr);
					  }
					});
					return(false);
				},
				submitAnswer: function (event) {
					event.preventDefault();
					console.log(this._answersCollection);
					_thisViewCardStart = this;
					if (this._answersCollection.online==0) {
						alert('in offline mode you can not add data');
					}
					else {
						var $this = $(this);
						console.log($('#submitform').serializeArray());
						var submitFormData = $('#submitform').serializeArray();
						// alert('you are online SUBMIT');
						// console.log(submitFormData.id);
						// var obj = jQuery.parseJSON( submitFormData );
						
						_.each(submitFormData, function(obj) {
							// this.id = model.get('id');
							// _thisViewCardStart.insertVariables(model);
							var n = obj.name;
							var v = obj.value;
							_thisViewCardStart._AnswerModel.set({n:v});
							_thisViewCardStart._answersCollection.set(this._AnswerModel);
							_thisViewCardStart._answersCollection.localStorage.save();
						});
						
						// console.log(submitFormData);
						// this._AnswerModel.set({'question': 'bla','answers' : 'foo'});
						// this._answersCollection.set(this._AnswerModel);
						// this._answersCollection.localStorage.save();
						console.log(this._answersCollection);
						// this.create(new CardModel({"uploader": "042cb1572ffbea5d", "cardurl": "http://xyz.de.com.uk", "title": "This is a card title", "description": "This is a description", "price": "35", "thumbnailurl": "http://www.cbr250r.com.au/images/card-thumbnail.jpg"}));
					}
					return(false);
				},
				submitForm: function (event) {
					var $this = $(this);
					event.preventDefault();
					console.log($this);
					console.log(event);
					console.log($this.serialize());
					/*
					$.post($this.attr('action'), $this.serialize(), function (responseData) {
						//in here you can analyze the output from your server-side script (responseData) and validate the user's login without leaving the page
					});
					*/
					return(false);
					if (this._answersCollection.online==0) {
						alert('in offline mode you can not add data');
					}
					else {
						alert('you are online FORM');
						// this.create(new CardModel({"uploader": "042cb1572ffbea5d", "cardurl": "http://xyz.de.com.uk", "title": "This is a card title", "description": "This is a description", "price": "35", "thumbnailurl": "http://www.cbr250r.com.au/images/card-thumbnail.jpg"}));
					}
					return(false);
				},
				bindEvents: function(event) {
					var _thisViewCardStart = this;
					this.$el.off('click','.createCard').on('click','.createCard',function(){_thisViewCardStart.createCard();});
					this.$el.off('submit','#submitform').on('submit','#submitform',function(event){_thisViewCardStart.submitForm(event);});
					this.$el.off('click','#submitanswer').on('click','#submitanswer',function(event){_thisViewCardStart.submitAnswer(event);});
				},
				initializeCollection:function(options) {
					this._cardsCollection = new cardsCollection([], options);
					this._answersCollection = new answersCollection();
					this._AnswerModel = new AnswerModel();					
				},
				fetch: function(options) {
					var _thisViewCardStart = this;
					this.$el.hide();
					console.log(options);
					this.initializeCollection(options);
					this._cardsCollection.fetch({
						error: function(action, coll) {
							console.log(action);
							console.log(coll);
						},
						success: function(coll, jsoncoll) {
							console.log(coll);
							console.log(jsoncoll);
							// _thisViewCardStart.render();
							_thisViewCardStart._answersCollection.fetch({
								error: function(action, coll) {
									console.log(action);
									console.log(coll);
								},
								success: function(coll, jsoncoll) {
									console.log(coll);
									console.log(jsoncoll);
									_thisViewCardStart.render();
								}
							});
						}
					});
				},
				initialize: function(options) {
					// console.log('search post data');
					// console.log(this);
					// this.initializeCollection(options);
					this.fetch(options);
				},
				insertVariables: function(model) {
					_thisViewCardStart = this;
					// console.log(this.id);
					// console.log('model');
					// console.log(model.collection.options.cardid);
					// console.log(model.collection.options.page);
					if ( typeof( _thisViewCardStart.uploaderdata ) == "undefined") {
						var uploader = model.get('uploader');
						$.ajax({
							url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
							async: false
						}).done(function(uploaderdata) {
							// console.log(uploaderdata);
							_thisViewCardStart.uploaderdata = uploaderdata;
						});
					}
					if ( typeof( _thisViewCardStart.carddata ) == "undefined") {
						$.ajax({
							url: "http://dominik-lohmann.de:5000/cardpages/?cardid="+model.collection.options.cardid+"&page="+model.collection.options.page+"&uploader?"+model.get('uploader'),
							async: false
						}).done(function(carddata) {
							// console.log(carddata);
							_thisViewCardStart.carddata = carddata[0];
						});
					}
					
					// console.log('_thisViewCardStart.carddata');
					// console.log(_thisViewCardStart.carddata);
					
					var pricetext = '';
					if (model.get('price')==0) pricetext = 'kostenlos';
					else pricetext = 'für '+model.get('price')+' Coins';
					_template = _.template(cardsStartViewHTML, {
						id: model.get('id'),
						uploader: _thisViewCardStart.uploaderdata.fullname,
						cardid: _thisViewCardStart.carddata.cardid,
						answers: _thisViewCardStart.carddata.answers,
						question: _thisViewCardStart.carddata.question,
						page_id: _thisViewCardStart.carddata.id,
						page: _thisViewCardStart.carddata.page,
						lastpage: (parseInt(_thisViewCardStart.carddata.page)-1),
						nextpage: (parseInt(_thisViewCardStart.carddata.page)+1),
						topic: model.get('topic'),
						cardurl: model.get('cardurl'),
						title: model.get('title'),
						subtitle: model.get('subtitle'),
						description: model.get('description'),
						price: model.get('price'),
						pricetext: pricetext,
						start: model.get('start'),
						end: model.get('end')
					},{variable: 'card'});
					$(this.el).html(_template);
				},
				render: function() {
					_thisViewCardStart = this;
					console.log('rendering CardStartView.js');
					$(window).resize(function() {
						window.resizeElement('#card_player_1')
					});
					console.log('DOING render CardStartView.js called');
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewCardStart.nestedView = new SidemenuView().fetch();
					var htmlContent = '';
					$(this.el).html(htmlContent);
					// _thisViewCardStart.uploaderdata.id = '';
					// _thisViewCardStart.carddata = '';
					_.each(this._cardsCollection.models, function(model) {
						this.id = model.get('id');
						_thisViewCardStart.insertVariables(model);
					});
					
					console.log('this._cardsCollection.models.attributes.cardurl');
					console.log(this._cardsCollection);
					// console.log(this._cardsCollection.models.attributes.cardurl);
					
					_thisViewCardStart.$el.trigger('create');
					new FastClick(document.body);
					_thisViewCardStart.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
					});
					this.bindEvents();
					return _thisViewCardStart;
				}

			});

        return CardStartViewVar;

    }

);