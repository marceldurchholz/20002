// CardStartView.js
// -------
define(["jquery", "backbone", "models/CardModel", "collections/cardsCollection", "collections/answersCollection", "models/AnswerModel", "views/CardView", "text!templates/cardStartView.html", "text!templates/cardFinishView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, CardModel, cardsCollection, answersCollection, AnswerModel, CardListViewItems, cardsStartViewHTML, cardsFinishViewHTML, sidemenusList, SidemenuView){
		
			var CardStartViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				initialize: function(options) {
					_thisViewCardStart = this;
					_thisViewCardStart.displayPage = cardsStartViewHTML;
					_thisViewCardStart.fetch(options);
					_thisViewCardStart._AnswerModel = new AnswerModel();
					_thisViewCardStart._answersCollection = new answersCollection();
					_thisViewCardStart.failures = 0;
					_thisViewCardStart.lastquestion = "";
					// _thisViewCardStart._answersCollection.set(_thisViewCardStart._AnswerModel);
					// _thisViewCardStart.listenTo(_thisViewCardStart._answersCollection, 'change', _thisViewCardStart.alarm);
				},
				alarm: function() {
					alert('alarm');
				},
				submitAnswer: function (event) {
					event.preventDefault();
					_thisViewCardStart = this;
					var $this = $(this);
					var submitFormData = $('#submitform').serializeArray();
					_.each(submitFormData, function(obj) {
						var n = obj.name;
						var v = obj.value;
						_thisViewCardStart._AnswerModel = new AnswerModel({question: n, answer: v});
						if (n.substr(0,6)=='answer') { _thisViewCardStart._answersCollection.add(_thisViewCardStart._AnswerModel); }
					});
					_thisViewCardStart.options.page = parseInt(_thisViewCardStart.cardpagedata.page)+1;					
					if (_thisViewCardStart.options.page > _thisViewCardStart.cardcount) {
						_thisViewCardStart.displayPage = cardsFinishViewHTML;
					}
					_thisViewCardStart.render();
					return(false);
				},

				retryCard: function (event) {
					event.preventDefault();
					_thisViewCardStart = this;
					window.location.href = "#cards/details/view/"+_thisViewCardStart.options.cardid;
					return(false);
				},

				cardsLink: function (event) {
					event.preventDefault();
					_thisViewCardStart = this;
					window.location.href = "#cards";
					return(false);
				},
				
				bindEvents: function(event) {
					var _thisViewCardStart = this;
					this.$el.off('click','#submitanswer').on('click','#submitanswer',function(event){_thisViewCardStart.submitAnswer(event);});
					this.$el.off('click','#retrycard').on('click','#retrycard',function(event){_thisViewCardStart.retryCard(event);});
					this.$el.off('click','#cardslink').on('click','#cardslink',function(event){_thisViewCardStart.cardsLink(event);});
				},
				
				fetch: function(options) {
					_thisViewCardStart = this;
					_thisViewCardStart.options = options;
					_thisViewCardStart.render();
					
				},
				
				insertResult: function(options) {
					_thisViewCardStart = this;
					// console.log(_thisViewCardStart.options);
					// console.log(_thisViewCardStart.allcardpages);
					_thisViewCardStart.resultArray = new Array();
					_.each(_thisViewCardStart.allcardpages, function(cardpage) {
						
						this.cardpage = cardpage;
						// console.log(this.cardpage);
						console.log('---------------------------------------');
						console.log('---------------------------------------');
						console.log('checking cardpageid ' + cardpage.id);
						console.log(cardpage);
						console.log('***************************************');
						
						console.log(cardpage.id);
						console.log(cardpage.question);
						console.log('running through potential answers');
						console.log('+++++++++++++++++++++++++++++++++++++++');
						
						_.each(cardpage.answers, function(answer) {
							// var correctanswer = model.get('');
							// console.log('answer.id ' +answer.id);
							console.log('answer.text ' +answer.text + ' >> ' + answer.solution);
							// console.log('answer.solution '+answer.solution);
							var found = 0;
							
							_.each(_thisViewCardStart._answersCollection.models, function(model) {
								if (
									cardpage.id == model.get('question').split("-")[1] 
									&& cardpage.page == model.get('question').split("-")[2]
									&& answer.id == model.get('question').split("-")[3]
									) {
									found = 1;
									console.log('FOUND GIVEN ANSWER: ' + model.get('answer'));
									if (answer.solution != model.get('answer')) {
										console.log('FAILURE !!!');
										_thisViewCardStart.failures = _thisViewCardStart.failures+1;
										var fo = new Object();
										fo.question = cardpage.question;
										fo.answer = answer.text;
										fo.solution = answer.solution;
										fo.lastquestion = _thisViewCardStart.lastquestion;
										_thisViewCardStart.lastquestion = fo.question;
										_thisViewCardStart.resultArray.push(fo);
									}
									// console.log(model.get('answer'));
									return(false);
								}
							});
							if (answer.solution == 1 && found==0) {
								console.log('FAILURE !!!');
								_thisViewCardStart.failures = _thisViewCardStart.failures+1;
								var fo = new Object();
								fo.question = cardpage.question;
								fo.answer = answer.text;
								fo.solution = answer.solution;
								fo.lastquestion = _thisViewCardStart.lastquestion;
								_thisViewCardStart.lastquestion = fo.question;
								_thisViewCardStart.resultArray.push(fo);
							}
							
						});

					});
					
					_template = _.template(_thisViewCardStart.displayPage, {
						id: _thisViewCardStart.carddata.id,
						uploader: _thisViewCardStart.uploaderdata.fullname,
						results: _thisViewCardStart._answersCollection.models,
						/*
						cardid: _thisViewCardStart.carddata.cardid,
						answers: _thisViewCardStart.cardpagedata.answers,
						question: _thisViewCardStart.cardpagedata.question,
						page_id: _thisViewCardStart.cardpagedata.id,
						page: _thisViewCardStart.cardpagedata.page,
						lastpage: (parseInt(_thisViewCardStart.cardpagedata.page)-1),
						nextpage: (parseInt(_thisViewCardStart.cardpagedata.page)+1),
						*/
						failures: _thisViewCardStart.failures,
						topic: _thisViewCardStart.carddata.topic,
						cardurl: _thisViewCardStart.carddata.cardurl,
						description: _thisViewCardStart.carddata.description,
						resultArray: _thisViewCardStart.resultArray,
						
						title: _thisViewCardStart.carddata.title
					},{variable: 'card'});
					$(this.el).html(_template);
				},
				
				insertVariables: function(options) {
					_thisViewCardStart = this;
					console.log(_thisViewCardStart.options);
					
					if ( typeof( _thisViewCardStart.carddata ) == "undefined") {
						var query = "http://dominik-lohmann.de:5000/cards/?id="+_thisViewCardStart.options.cardid;
						$.ajax({
							url: query,
							async: false
						}).done(function(carddata) {
							_thisViewCardStart.carddata = carddata;
						});
					}
					// console.log(_thisViewCardStart.carddata);
					
					var query = "http://dominik-lohmann.de:5000/cardpages/?cardid="+_thisViewCardStart.options.cardid;
					$.ajax({
						url: query,
						async: false
					}).done(function(allcardpages) {
						_thisViewCardStart.allcardpages = allcardpages;
						_thisViewCardStart.allcardpages.sort(function(a, b){
							return a.page-b.page
						});
						_thisViewCardStart.cardcount = allcardpages.length;
						// console.log(_thisViewCardStart.cardcount);
					});					
					
					var query = "http://dominik-lohmann.de:5000/cardpages/?cardid="+_thisViewCardStart.options.cardid+"&page="+_thisViewCardStart.options.page; // +"&uploader?"+model.get('uploader')
					console.log(query);
					$.ajax({
						url: query,
						async: false
					}).done(function(cardpagedata) {
						_thisViewCardStart.cardpagedata = cardpagedata[0];
						// console.log(_thisViewCardStart.cardpagedata);
					});
					console.log(_thisViewCardStart.cardpagedata);
					
					if ( typeof( _thisViewCardStart.uploaderdata ) == "undefined") {
						var uploader = _thisViewCardStart.carddata.uploader;
						$.ajax({
							url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
							async: false
						}).done(function(uploaderdata) {
							// console.log(uploaderdata);
							_thisViewCardStart.uploaderdata = uploaderdata;
						});
					}
					// console.log(_thisViewCardStart.uploaderdata);
					// console.log('_thisViewCardStart.carddata');
					// console.log(_thisViewCardStart.carddata);
					
					var pricetext = '';
					if (_thisViewCardStart.carddata.price==0) pricetext = 'kostenlos';
					else pricetext = 'für '+_thisViewCardStart.carddata.price+' Coins';
					_template = _.template(_thisViewCardStart.displayPage, {
						id: _thisViewCardStart.carddata.id,
						uploader: _thisViewCardStart.uploaderdata.fullname,
						cardid: _thisViewCardStart.carddata.cardid,
						answers: _thisViewCardStart.cardpagedata.answers,
						question: _thisViewCardStart.cardpagedata.question,
						cardpageid: _thisViewCardStart.cardpagedata.id,
						page: _thisViewCardStart.cardpagedata.page,
						lastpage: (parseInt(_thisViewCardStart.cardpagedata.page)-1),
						nextpage: (parseInt(_thisViewCardStart.cardpagedata.page)+1),
						topic: _thisViewCardStart.carddata.topic,
						cardurl: _thisViewCardStart.carddata.cardurl,
						title: _thisViewCardStart.carddata.title,
						description: _thisViewCardStart.carddata.description,
						price: _thisViewCardStart.carddata.price,
						pricetext: pricetext
					},{variable: 'card'});
					$(this.el).html(_template);
				},
				render: function() {
					_thisViewCardStart = this;
					$(window).resize(function() {
						window.resizeElement('#card_player_1')
					});
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewCardStart.nestedView = new SidemenuView().fetch();
					var htmlContent = '';
					$(this.el).html(htmlContent);
					
					if (_thisViewCardStart.options.page > _thisViewCardStart.cardcount) {
						// doAlert('finish');
						_thisViewCardStart.insertResult(_thisViewCardStart.options);
					} else {
						_thisViewCardStart.insertVariables(_thisViewCardStart.options);
					}
					
					_thisViewCardStart.$el.trigger('create');
					hideModal();
					new FastClick(document.body);
					fontResize();
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