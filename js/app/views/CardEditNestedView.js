// CardEditNestedView.js
// -------
define(["jquery", "backbone", "text!templates/CardEditNestedPage.html", "text!templates/CardEditNestedPage.html"],

    function($, Backbone, CardEditNestedPage, CardEditPagesNestedPage){
		
		var CardEditNestedViewVar = Backbone.View.extend({
			
			el: "#CardEditViewDiv",
			initialize: function() {
				_thisViewCardEditNested = this;
				_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
				showModal();
				// var streamData = new Array();
				// _thisViewCardEditNested.streamData = streamData;
			},
			checkLogin:function() {
				_thisViewCardEditNested = this;
				_thisViewCardEditNested.me = window.me;
				if (!isMobile.any()) {
					// window.system.uid = '3a499b457111f803'; // 81f03ace38e668db
					_thisViewCardEditNested.me.id = window.system.uid;
				}
				dpd('users').get(window.system.uid, function(user, err) {
					if (user) _thisViewCardEditNested.chooseSubPage();
					else system.redirectToUrl('#login');
				});
			},
			fetch: function(data) {	
				_thisViewCardEditNested = this;
				_thisViewCardEditNested.options = data.options;
				_thisViewCardEditNested.streamData = new Object();
				_thisViewCardEditNested.streamData.cardsArray = new Array();
				_thisViewCardEditNested.streamData.pagesArray = new Array();
				_thisViewCardEditNested.streamData.activePageArray = new Array();
				_thisViewCardEditNested.streamData.activePageArray[0] = new Object();				
				_thisViewCardEditNested.streamData.activePageArray[0].id = "0";
				_thisViewCardEditNested.streamData.activePageArray[0].answers = new Array();
				_thisViewCardEditNested.checkLogin();
				// _thisViewCardEditNested.collectStreamData();
			},
			updateCardpageOrder: function() {
				showModal();
				var newpage = 0;
				// console.log($( "#CardPagesEditList li" ).length);
				$( "#CardPagesEditList li" ).each(function(index, value) {
					var cardpageid = $(this).attr('data-cardpageid');
					var page = $(this).attr('data-page');
					// console.log(cardpageid+': '+page+' >> '+newpage);
					if (page!=newpage && cardpageid != undefined) {

						$(this).find('input:checkbox').each(function() {
							if ($(this).hasClass( "activatecardcb" )) {
								var iscorrect = $(this).is(":checked"); // $(this).val();
								if (iscorrect==true) var cardpageactive = true; else cardpageactive = false;
								// newanswerObject.solution = solution;
								dpd.cardpages.put(cardpageid, {"page":''+newpage, "active":cardpageactive}, function(result, err) {
									if(err) {
										return console.log(err);
										// hideModal();
									}
									// console.log(result, result.id);
									// hideModal();
									// doAlert('Vielen Dank. Sie haben nun ' + newcredits + ' APPinaut Coins.','Kauf erfolgreich');
									// window.location.reload();
									// window._thisViewMyProfileNested.initialize();
								});
							}
						});

					}
					newpage = newpage+1;
					// if (newpage==$( "#CardPagesEditList li" ).length) hideModal();
				});
				hideModal();
			},
			updateCardPageAnswers: function() {
				showModal();
				// alert('updateCardPageAnswers');
				var newanswerArray = new Array();
				var answerOrder = 0;
				$( "#answerList div" ).each(function(index, value) {
					if ($(this).hasClass( "answerRow" )) {
						var _thisRow = $(this);
						// var cardpageid = $(this).attr('data-cardpageid');
						// console.log(cardpageid);
						var newanswerObject = new Object();
						newanswerObject.id = answerOrder;
						$(this).find('input:text, input:checkbox').each(function() {
							if ($(this).hasClass( "answercb" )) {
								var iscorrect = $(this).is(":checked"); // $(this).val();
								if (iscorrect==true) var solution = "1"; else solution = "0";
								newanswerObject.solution = solution;
							}
							if ($(this).hasClass( "answer" )) {
								var newanswer = $(this).val();
								newanswerObject.text = newanswer;
							}
						});
						if (newanswerObject.text!='') {
							newanswerArray.push(newanswerObject);
							answerOrder = answerOrder + 1;
						}
						else {
							_thisRow.remove();
							// delete row in the view
						}
					}
				});
				// console.log(newanswerArray);
				// console.log(_thisViewCardEditNested.streamData.activePageArray[0].id);
				dpd.cardpages.put(_thisViewCardEditNested.streamData.activePageArray[0].id, {"answers":newanswerArray}, function(result, err) {
					if(err) {
						return console.log(err);
						// hideModal();
					}
					console.log(result.answers);
					_thisViewCardEditNested.streamData.activePageArray[0].answers = result.answers;
					// _thisViewCardEditNested.render();
				});
				hideModal();
			},
			bindEvents: function() {
				_thisViewCardEditNested = this;
					$(document).ready(function(e) {
						$( ".sortableListe" ).sortable({
							'containment': 'parent',
							'opacity': 0.6,
							// 'delay': 1000, 
							update: function(e, ui) {
								// alert("dropped");
								// console.log(e);
								// console.log(ui);
								// console.log('update: '+ui.item.index());
								_thisViewCardEditNested.updateCardpageOrder();
							},
							start: function(e, ui) { 
								// console.log('start: ' + ui.item.index())
							}
						});
					});
					$( ".sortableListe" ).disableSelection();
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewLearningStreamNested.clicked(e);});
				
				
				_thisViewCardEditNested.$el.off('click','#addAnswerBtn').on('click','#addAnswerBtn',function(e){
					e.preventDefault();
					if (_thisViewCardEditNested.streamData.activePageArray[0].answers==undefined) _thisViewCardEditNested.streamData.activePageArray[0].answers = new Array();
					if ((_thisViewCardEditNested.streamData.activePageArray[0].answers.length+1)>5) {
						doAlert('Mehr als 5 Antworten pro Lernkarte sind derzeit nicht erlaubt.','Aktion nicht möglich');
						return(false);
					}
					// var cardpageid = $(this).attr('data-cardpageid');
					// alert(cardpageid);
					// window.location.href = e.currentTarget.href;
					var answers = _thisViewCardEditNested.streamData.activePageArray[0].answers;
					console.log(answers);
					var newanswerObject = new Object();
					newanswerObject.id = (_thisViewCardEditNested.streamData.activePageArray[0].answers.length+1);
					newanswerObject.solution = "0";
					newanswerObject.text = "";
					console.log(newanswerObject);
					_thisViewCardEditNested.streamData.activePageArray[0].answers.push(newanswerObject);
					console.log(answers);
					_thisViewCardEditNested.render();
					return(false);
					// window.location.href = e.currentTarget.hash;
				});
				
				_thisViewCardEditNested.$el.off('click','.editCardpage').on('click','.editCardpage',function(e){
					e.preventDefault();
					var cardpageid = $(this).attr('data-cardpageid');
					// alert(cardpageid);
					window.location.href = e.currentTarget.href;
					return(false);
					// window.location.href = e.currentTarget.hash;
				});
				
				_thisViewCardEditNested.$el.off('click','.delAnswerBtn').on('click','.delAnswerBtn',function(e){
					e.preventDefault();
					var answerrowid = $(this).attr('data-answerrowid');
					// alert(answerrowid);
					var answerrow = $('#'+answerrowid);
					// answerrow.fadeOut();
					answerrow.fadeOut( "fast", function(e,o) {
						// Animation complete.
						console.log(this);
						this.remove();
						_thisViewCardEditNested.updateCardPageAnswers();
					});
					// window.location.href = e.currentTarget.href;
					// activePageArray
					return(false);
					// window.location.href = e.currentTarget.hash;
				});
				
				_thisViewCardEditNested.$el.off('blur','#question').on('blur','#question',function(e){
					e.preventDefault();
					showModal();
					var cardpageid = $(this).attr('data-cardpageid');
					var cardsetid = $(this).attr('data-cardsetid');
					// alert(cardsetid);
					// return(false);
					// alert(cardpageid);
					var newquestion = $(e.currentTarget).val();
					// alert(newquestion);
					if(cardpageid=="0") {
						if (newquestion=='') $('#questionemtpywarning').html('Sie müssen eine Frage eingeben.');
						else {
							$('#questionemtpywarning').html('');
							console.log('inserting new cardpage');
							dpd.cardpages.post({"question":''+newquestion, "cardid":''+cardsetid, "active":false, "public":true, "uploader": _thisViewCardEditNested.me.id, "page":""+(_thisViewCardEditNested.streamData.pagesArray.length)}, function(result, err) {
								if(err) {
									return console.log(err);
								}
								console.log(result);
								window.location.href = "#cards/edit/acd1eacd6a69e82e/"+result.id;
							});
						}
					}
					if(cardpageid!="0") {
						if (newquestion=='') $('#questionemtpywarning').html('Sie müssen eine Frage eingeben.');
						else {
							$('#questionemtpywarning').html('');
							dpd.cardpages.put(cardpageid, {"question":''+newquestion}, function(result, err) {
								if(err) {
									return console.log(err);
									// hideModal();
								}
							});
						}
					}
					hideModal();
					return(false);
				});
				
				
				_thisViewCardEditNested.$el.off('change','.activatecardcb').on('change','.activatecardcb',function(e){
					e.preventDefault();
					// alert('change triggered');
					// _thisViewCardEditNested.updateCardPageAnswers();
					var cardpageid = $(this).attr('data-cardpageid');
					// alert(cardpageid);
					var isactive = $(this).is(":checked");
					dpd.cardpages.put(cardpageid, {"active":isactive}, function(result, err) {
						if(err) {
							return console.log(err);
							// hideModal();
						}
					});
					return(false);
				});
				
				_thisViewCardEditNested.$el.off('change','.answercb').on('change','.answercb',function(e){
					e.preventDefault();
					// alert('change triggered');
					_thisViewCardEditNested.updateCardPageAnswers();
					return(false);
				});
	
				_thisViewCardEditNested.$el.off('blur','.answer').on('blur','.answer',function(e){
					e.preventDefault();
					_thisViewCardEditNested.updateCardPageAnswers();
					return(false);
				});
				
				_thisViewCardEditNested.$el.off('click','.deleteCardPageBtn').on('click','.deleteCardPageBtn',function(e){
					e.preventDefault();
					showModal();
					var cardpageid = $(this).attr('data-cardpageid');
					// alert(cardpageid);
					var cardsetid = $(this).attr('data-cardsetid');
					// alert(cardsetid);
					dpd.cardpages.put(cardpageid, {"deleted":true}, function(result, err) {
						if(err) {
							return console.log(err);
							hideModal();
						}
						var href = $(this).attr('href');
						window.location.href = '#cards/edit/'+cardsetid;
					});

					return(false);					
				});
				
				_thisViewCardEditNested.$el.off('click','.newCard').on('click','.newCard',function(e){
					e.preventDefault();
					var cardsetid = $(this).attr('data-cardsetid');
					// var href = $(this).attr('href');
					// alert(cardsetid);
					// window.location.href = href;
					doAlert('Das Hinzufügen eines Lernsets ist derzeit nicht erlaubt.','Aktion nicht möglich');
					return(false);
					// window.location.href = e.currentTarget.hash;
				});
				
				_thisViewCardEditNested.$el.off('click','.newCardpage').on('click','.newCardpage',function(e){
					e.preventDefault();
					var cardsetid = $(this).attr('data-cardsetid');
					var href = $(this).attr('href');
					// alert(cardsetid);
					window.location.href = href;
					return(false);
					// window.location.href = e.currentTarget.hash;
				});
				
				/*
				dpd.videos.once('create', function(videoData) {
					_thisViewCardEditNested.collectStreamData();
					_thisViewCardEditNested.render();
				});
				*/
			},
			chooseSubPage: function() {
				_thisViewCardEditNested = this;
				// console.log(_thisViewCardEditNested.options);
				
				_thisViewCardEditNested = this;
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					_thisViewCardEditNested.me = me;
					// alert(_thisViewCardEditNested.me.master);
				});
				// console.log(_thisViewCardEditNested.options.cardsetid);
				if(_thisViewCardEditNested.options.cardsetid==undefined) {
					_thisViewCardEditNested.options.cardsetid="";
					_thisViewCardEditNested.streamData.view = 'list';
					_thisViewCardEditNested.streamData.pagetype = 'Lernset';
					_thisViewCardEditNested.streamData.pagetitle = 'Lernsets';
					_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
					_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardsetid,_thisViewCardEditNested.options.pageid);
				}
				else if(_thisViewCardEditNested.options.cardsetid=="0") {
					_thisViewCardEditNested.streamData.view = 'new';
					_thisViewCardEditNested.streamData.pagetype = 'Lernset';
					_thisViewCardEditNested.streamData.pagetitle = 'Lernset erstellen';
					_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
					// _thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardsetid,_thisViewCardEditNested.options.pageid);
				}
				else {
					if(_thisViewCardEditNested.options.pageid==undefined) {
						_thisViewCardEditNested.options.pageid="";
						_thisViewCardEditNested.streamData.view = 'list';
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarten';
						_thisViewCardEditNested.displaySubPage = CardEditPagesNestedPage;
						_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardsetid,_thisViewCardEditNested.options.pageid);
					}
					else if(_thisViewCardEditNested.options.pageid==0) {
						console.log('create new cardpage');
						_thisViewCardEditNested.streamData.view = 'new';
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarte erstellen';
						_thisViewCardEditNested.displaySubPage = CardEditPagesNestedPage;
						_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardsetid,_thisViewCardEditNested.options.pageid);
					}
					else {
						console.log('edit cardpage');
						_thisViewCardEditNested.streamData.view = 'edit';
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarte bearbeiten';
						_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
						_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardsetid,_thisViewCardEditNested.options.pageid);					
					}
				}
			},
			collectCardData: function(cardsetid,pageid) {
				var requestUrl = "http://dominik-lohmann.de:5000/cards?deleted=false"; // active=true&
				if (window.system.master!=true) requestUrl = requestUrl + "&uploader="+window.system.aoid;
				if (cardsetid!="") requestUrl = requestUrl + "&id="+cardsetid;
				// console.log(requestUrl);
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(cardData) {
					myObj = new Object();
					if (cardsetid!="") {
						myObj.cardData = cardData; 
						myObj.cardDatay = cardData; 
						cardData = myObj;
					}
					// else cardData = cardDataX;
					// console.log(cardData);
					
					_.each(cardData, function(value, index, list) {
						// console.log(index+" > "+value);
						// console.log(value.uploader,_thisViewCardEditNested.me.id);
						if ((window.system.master==true && value.public==true) || value.uploader==_thisViewCardEditNested.me.id) { 
							// console.log('bla');
							
							if (_thisViewCardEditNested.userArray == undefined) _thisViewCardEditNested.userArray = new Array();
							if (_thisViewCardEditNested.userArray[value.uploader] != undefined) {
								value.uploaderdata = _thisViewCardEditNested.userArray[value.uploader];
								_thisViewCardEditNested.streamData.cardsArray.push(value);
							}
							else {
								$.ajax({
									url: "http://dominik-lohmann.de:5000/users/"+value.uploader,
									async: false
								}).done(function(userData) {
									value.uploaderdata = userData;
									_thisViewCardEditNested.streamData.cardsArray.push(value);
									if (_thisViewCardEditNested.userArray[userData.id] == undefined) _thisViewCardEditNested.userArray = new Object();
									_thisViewCardEditNested.userArray[userData.id] = userData;
								});
							}							
						}
					});
					
					if (cardsetid!="") {
						if (cardsetid==myObj.cardData.id) { 
							// console.log('foo');
							var requestUrl = "http://dominik-lohmann.de:5000/cardpages?deleted=false&cardid="+cardsetid; // active=true&
							$.ajax({
								url: requestUrl,
								async: false
							}).done(function(cardPageData) {
								// value.uploaderdata = _thisViewCardEditNested.userArray[value.uploader];
								_.each(cardPageData, function(pagevalue, pageindex, pagelist) {
									// _thisViewCardEditNested.streamData.pagesArray.push(pagevalue);
									
									if (_thisViewCardEditNested.options.pageid!=undefined && _thisViewCardEditNested.options.pageid!=0) {
										if (_thisViewCardEditNested.options.pageid == pagevalue.id) {
											pagevalue.selected=true;
											_thisViewCardEditNested.streamData.activePageArray[0] = pagevalue;
										}
										else {
											pagevalue.selected=false;
										}
									}
									
									_thisViewCardEditNested.streamData.pagesArray.push(pagevalue);
									
								});
							});
						}
					}
					
				});
				
				// Sort multidimensional arrays with oobjects by value 
				// http://www.javascriptkit.com/javatutors/arraysort2.shtml
				// cards via DATE
				_thisViewCardEditNested.streamData.cardsArray.sort(function(a, b){
					return b.cdate-a.cdate
				});
				// cardpages via NUMBER
				_thisViewCardEditNested.streamData.pagesArray.sort(function(a, b){
					return a.page-b.page
				});
				
				_thisViewCardEditNested.render();
			},
			render: function() {
				_thisViewCardEditNested = this;
				// console.log(_thisViewCardEditNested.streamData);
				_thisViewCardEditNested.$el.html(_.template(_thisViewCardEditNested.displaySubPage, {
					data: _thisViewCardEditNested.streamData
				},{variable: 'stream'}));
				fontResize();
				hideModal();
				_thisViewCardEditNested.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					// $('.ui-content').scrollTop(0);
					// new FastClick(document.body);
					/*
					var LearningStreamUpdateInterval = setInterval(function(){
						// alert("Hello");
						// _thisViewLearningStreamNested.fetch();
					},2000);
					*/
				});

				_thisViewCardEditNested.bindEvents();
				return _thisViewCardEditNested;				
			}
		});

        return CardEditNestedViewVar;

    }

);