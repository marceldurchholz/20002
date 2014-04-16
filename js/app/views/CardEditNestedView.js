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
				_thisViewCardEditNested.checkLogin();
				// _thisViewCardEditNested.collectStreamData();
			},
			bindEvents: function() {
				_thisViewCardEditNested = this;
					$(document).ready(function(e) {
						$( ".sortableListe" ).sortable({
							'containment': 'parent',
							'opacity': 0.6,
							update: function(event, ui) {
								// alert("dropped");
								// console.log(event);
								// console.log(ui);
								console.log('update: '+ui.item.index());
							},
							start: function(event, ui) { 
								console.log('start: ' + ui.item.index())
							}
						});
					});
					$( ".sortableListe" ).disableSelection();
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewLearningStreamNested.clicked(e);});
				_thisViewCardEditNested.$el.off('click','.newCardpage').on('click','.newCardpage',function(e){
					e.preventDefault();
					return(false);
					// window.location.href = event.currentTarget.hash;
				});
				_thisViewCardEditNested.$el.off('click','.editCardpage').on('click','.editCardpage',function(e){
					e.preventDefault();
					return(false);
					// window.location.href = event.currentTarget.hash;
				});
				_thisViewCardEditNested.$el.off('click','.newCard').on('click','.newCard',function(e){
					e.preventDefault();
					return(false);
					// window.location.href = event.currentTarget.hash;
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
				console.log(_thisViewCardEditNested.options);
				
				_thisViewCardEditNested = this;
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					_thisViewCardEditNested.me = me;
					// alert(_thisViewCardEditNested.me.master);
				});
				console.log(_thisViewCardEditNested.options.cardid);
				if(_thisViewCardEditNested.options.cardid==undefined) {
					_thisViewCardEditNested.options.cardid="";
					_thisViewCardEditNested.streamData.pagetype = 'Lernset';
					_thisViewCardEditNested.streamData.pagetitle = 'Lernsets';
					_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
					_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardid,_thisViewCardEditNested.options.pageid);
				}
				else if(_thisViewCardEditNested.options.cardid=="0") {
					_thisViewCardEditNested.streamData.pagetype = 'Lernset';
					_thisViewCardEditNested.streamData.pagetitle = 'Lernset erstellen';
					_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
					// _thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardid,_thisViewCardEditNested.options.pageid);
				}
				else {
					if(_thisViewCardEditNested.options.pageid==undefined) {
						_thisViewCardEditNested.options.pageid="";
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarten';
						_thisViewCardEditNested.displaySubPage = CardEditPagesNestedPage;
						_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardid,_thisViewCardEditNested.options.pageid);
					}
					else if(_thisViewCardEditNested.options.pageid==0) {
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarte erstellen';
						_thisViewCardEditNested.displaySubPage = CardEditPagesNestedPage;
						// _thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardid,_thisViewCardEditNested.options.pageid);
					}
					else {
						_thisViewCardEditNested.streamData.pagetype = 'Lernkarte';
						_thisViewCardEditNested.streamData.pagetitle = 'Lernkarte bearbeiten';
						_thisViewCardEditNested.displaySubPage = CardEditNestedPage;
						_thisViewCardEditNested.collectCardData(_thisViewCardEditNested.options.cardid,_thisViewCardEditNested.options.pageid);					
					}
				}
			},
			collectCardData: function(cardid,pageid) {
				var requestUrl = "http://dominik-lohmann.de:5000/cards?active=true&deleted=false";
				if (window.system.master!=true) requestUrl = requestUrl + "&uploader="+window.system.aoid;
				if (cardid!="") requestUrl = requestUrl + "&id="+cardid;
				console.log(requestUrl);
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(cardData) {
					myObj = new Object();
					if (cardid!="") {
						myObj.cardData = cardData; 
						myObj.cardDatay = cardData; 
						cardData = myObj;
					}
					// else cardData = cardDataX;
					console.log(cardData);
					
					_.each(cardData, function(value, index, list) {
						console.log(index+" > "+value);
						// console.log(value.uploader,_thisViewCardEditNested.me.id);
						if ((window.system.master==true && value.public==true) || value.uploader==_thisViewCardEditNested.me.id) { 
							console.log('bla');
							
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
					
					if (cardid!="") {
						if (cardid==myObj.cardData.id) { 
							console.log('foo');
							var requestUrl = "http://dominik-lohmann.de:5000/cardpages?active=true&deleted=false&cardid="+cardid;
							$.ajax({
								url: requestUrl,
								async: false
							}).done(function(cardPageData) {
								// value.uploaderdata = _thisViewCardEditNested.userArray[value.uploader];
								_.each(cardPageData, function(pagevalue, pageindex, pagelist) {
									_thisViewCardEditNested.streamData.pagesArray.push(pagevalue);
								});
							});
						}
					}

				});
				// Sort multidimensional arrays with oobjects by value 
				// http://www.javascriptkit.com/javatutors/arraysort2.shtml
				_thisViewCardEditNested.streamData.cardsArray.sort(function(a, b){
					return b.cdate-a.cdate
				});
				
				_thisViewCardEditNested.render();
			},
			render: function() {
				_thisViewCardEditNested = this;
				console.log(_thisViewCardEditNested.streamData);
				_thisViewCardEditNested.$el.html(_.template(_thisViewCardEditNested.displaySubPage, {
					data: _thisViewCardEditNested.streamData
				},{variable: 'stream'}));
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