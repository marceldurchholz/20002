// VideoDetailsView.js
// -------
define(["jquery", "backbone", "collections/videosCollection", "text!templates/videoDetailsView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, videosCollection, videosDetailsViewHTML, sidemenusList, SidemenuView){
		
			var VideoDetailsViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				bindEvents: function() {
					_thisViewVideoDetails = this;
					this.$el.off('click','#loadvideobutton').on('click','#loadvideobutton',function(e) { 
						e.preventDefault();
						var videoid = $(this).attr('data-videoid');
						
						// dpd.users.me(function(me) {
						dpd('users').get(window.system.uid, function(me, err) {
							if (me) {
								_thisViewVideoDetails.buyVideo(videoid);
								// alert(videoid);
							}
							else {
								doConfirm('Um diese Funktion zu nutzen, registrieren Sie sich bitte.', 'Video kaufen', function (event) { 
									if (event=="1") {
										window.location.href = '#noaccess';
									}
								}, ('Okay,Abbruch').split(","));
							}
						});
						
					});
					this.$el.off('click','#complainvideolink').on('click','#complainvideolink',function(e) { 
						e.preventDefault();
						var videoid = $(this).attr('data-videoid');
						window.location.href = "mailto:support@appinaut.de?subject=Meldung%20eines%20Videos%20oder%20eines%20Verstosses%20-%20"+videoid+"&body=Bitte%20teilen%20Sie%20uns%20den%20Hintergrund%20Ihrer%20Meldung%20oder%20des%20Verstosses%20detailliert%20mit.";
					});
					this.$el.off('click','#reportvideolink').on('click','#reportvideolink',function(e) { 
						e.preventDefault();
						var videoid = $(this).attr('data-videoid');
						addVideoReport(me, videoid);
						$(this).remove();
					});
					this.$el.off('click','#detailsvideolink').on('click','#detailsvideolink',function(e) { 
						e.preventDefault();
						$('#videodetailsdiv').toggle();
						$('#detailsvideolink').toggle();
					});
				},

				downloadVideo: function(videoid) {
					var _thisViewVideoDetails = this;
					showModal();
					if (isMobile.any()) var ft = new FileTransfer();
					if (isMobile.any()) window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
						var downloadPath = fs.root.fullPath + "/"+videoid+".mp4";
						uri = $('#video_player_1_html5_api').attr("src");
						ft.onprogress = function(progressEvent) {
							$('#modaltxt').html(progressEvent.loaded+" / "+progressEvent.total);
						};
						ft.download(uri, downloadPath, function(entry) {
							$("#video_player_1_html5_api").attr("src", downloadPath); // .get(0)
							_thisViewVideoDetails.rememberVideoLocation(videoid,downloadPath);
							$('#downloadvideobutton').hide();
							hideModal();
						}, 
						function(error) {
							console.log(error);
							doAlert('Da ist etwas schiefgegangen. Die Datei konnte nicht vollständig heruntergeladen werden. Bitte probieren Sie es erneut oder wenden Sie sich an unseren Support. Vielen Dank.','Ups!');						
							hideModal();
						});
					});
					else {
						$('#downloadvideobutton').hide();
						hideModal();
					}
				},
				rememberVideoLocation: function(videoid,downloadPath) {
					_thisViewVideoDetails = this;
					this.db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);
					this.db.transaction(
						function(tx) {
							var query = "INSERT INTO videos (videoid,videourl) VALUES ('"+videoid+"','"+downloadPath+"')"; 
							tx.executeSql(query);
						},
						function() {
							alert('ERROR ON entry saving in TABLE videos');
						},
						function() {
						}
					);
				},
				
				initializeCollection:function(options) {
					// dpd.users.me(function(me) {
					dpd('users').get(window.system.uid, function(me, err) {
						if (me) {
							window.me = me;
						}
						else {
							var meid = getRandomID().toString();
							var me = new Object();
							me.id = meid;
							window.me = me;
						}
					});
					this._videosCollection = new videosCollection([], options);
				},
				fetch: function(options) {
					var _thisViewVideoDetails = this;
					showModal();
					_thisViewVideoDetails.getVideo(options);
				},
				getVideo: function(options) {
					var _thisViewVideoDetails = this;
					_thisViewVideoDetails.offlineurl = "";
					if (isMobile.any()) {
						this.db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);
						this.db.transaction (
							function(tx) {
								var sql = "SELECT videourl as videourl FROM videos WHERE videoid='"+options.id+"'";
								tx.executeSql(sql, 
									function() {
										alert('ERROR ON SELECT videourl');
									},
									function(tx, results) {
										var offlineurl = results.rows.item(0).videourl;
										_thisViewVideoDetails.offlineurl = offlineurl;
									}
								);
							}
						);
					}
					
					// return(false);
					_thisViewVideoDetails.initializeCollection(options);
					_thisViewVideoDetails._videosCollection.fetch({
						error: function(action, coll) {
							// console.log(action);
							// console.log(coll);
						},
						success: function(coll, jsoncoll) {
							// console.log(coll);
							// console.log(jsoncoll);
							_thisViewVideoDetails.render();
						}
					});					
				},
				buyVideo: function(videoid) {
					_thisViewVideoDetails = this;
					// _thisConfirmButtonLabels = ('Preise anzeigen,Abbrechen').split(",");
					var CreditsAfterPurchase = parseFloat(this._videosCollection.user.credits) - parseFloat(this._videosCollection.models[0].attributes.price);
					if (CreditsAfterPurchase<0) {
						// doAlert('Sie haben nicht genügend Credits.','Schade...');
						doConfirm('Sie haben nicht genügend APPinaut® Coins.', 'Schade...', function (event) { 
							if (event=="1") {
								// doAlert('1','ok');
								window.location.href = '#myprofile';
							}
						}, ('Preise anzeigen,Abbrechen').split(","));
						return(false);
					}
					else {
						purchaseVideoConfirm(this._videosCollection.user,this._videosCollection.models[0].attributes);
					}
				},
				initialize: function(options) {
					_thisKnowledgeData = this;
					this.$el.hide();
					this.fetch(options);
				},

				collectRelatedData: function(topic) {
					var streamData = new Array();
					_thisKnowledgeData = this;
					_thisKnowledgeData.streamData = streamData;
					var querystr = "";
					// if (topic!='') querystr += "&topic="+topic;
					var url = "http://dominik-lohmann.de:5000/videos?active=true&deleted=false";
					$.ajax({
						url: url+querystr,
						async: false
					}).done(function(videoData) {
						var nameArray = new Array;
						_.each(videoData, function(value, index, list) {
							if (window.system.aoid=='' || value.uploader == window.system.aoid) {
								value.ccat = 'video';
								value.icon = 'images/icon-multimedia-60.png';
								value.href = '#videos/details/view/'+value.id;
								// _thisKnowledgeData.streamData.push(value);
								var uploader = value.uploader; // "ed568841af69d94d";							
								_thisKnowledgeData.streamData.push(value);
							}

						});
					});
					// Sort multidimensional arrays with oobjects by value 
					// http://www.javascriptkit.com/javatutors/arraysort2.shtml
					_thisKnowledgeData.streamData.sort(function(a, b){
						return b.cdate-a.cdate
					});
					return(_thisKnowledgeData.streamData);
				},
				
				insertVariables: function(model) {
					_thisViewVideoDetails = this;
					var uploader = model.get('uploader');
					// console.log(this.id);
					if (uploader==window.me.id) {
						_thisViewVideoDetails.uploaderdata = window.me;
					}
					else {
						$.ajax({
							url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
							async: false
						}).done(function(uploaderdata) {
							// console.log(uploaderdata);
							_thisViewVideoDetails.uploaderdata = uploaderdata;
						});
					}
					
					var pricetext = '';
					if (model.get('price')==0) pricetext = 'Video kostenlos laden';
					else pricetext = 'Video für '+model.get('price')+' Coins kaufen';
					var provider = '';
					provider = jQuery.inArray( 'provider', window.me.roles );
					var seeker = '';
					seeker = jQuery.inArray( 'seeker', window.me.roles );
					// console.log('purchases');
					// console.log(model.get('purchases'));
					/*
					var _thumbnailurl = '';
					if () {
						_thumbnailurl = '';
					}
					*/
					_template = _.template(videosDetailsViewHTML, {
						id: model.get('id'),
						uploaderdata: _thisViewVideoDetails.uploaderdata,
						uploader: _thisViewVideoDetails.uploaderdata.fullname,
						me_credits: this._videosCollection.user.credits,
						videourl: model.get('videourl'),
						offlineurl: model.get('offlineurl'),
						topic: model.get('topic'),
						title: model.get('title'),
						description: model.get('description'),
						price: model.get('price'),
						seeker: seeker,
						provider: provider,
						cdate: dateYmdHisToGerman(model.get('cdate')),
						vlength: model.get('vlength'),
						vsize: model.get('vsize'),
						purchases: this._videosCollection.user.purchases,
						pricetext: pricetext,
						ireported: $.inArray( me.id, model.get('reportedby')), // model.get('reportedby')
						thumbnailurl: model.get('thumbnailurl'),
						related: _thisViewVideoDetails.collectRelatedData(model.get('topic'))
					},{variable: 'video'});
					$(this.el).html(_template);
				},
				render: function() {
					_thisViewVideoDetails = this;
					console.log('rendering');
					$(window).resize(function() {
						window.resizeElement('#video_player_1')
					});
					console.log('DOING render VideoDetailsView.js called');
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewVideoDetails.nestedView = new SidemenuView().fetch();
					
					if( $.inArray( this._videosCollection.models[0].attributes.id , window.me.purchases ) >- 1 ) {
						this._videosCollection.models[0].attributes.videourl,showVideoLength = 0;
					} else {
						this._videosCollection.models[0].attributes.videourl,showVideoLength = 60;
						// alert('not buyed');
					}
					// _thisViewVideoDetails.offlineurl
					// alert(showVideoLength);
					/*
					if (_thisViewVideoDetails.offlineurl!='') {
						// alert(_thisViewVideoDetails.offlineurl);
						this._videosCollection.models[0].attributes.videourl = _thisViewVideoDetails.offlineurl;
						$('#downloadvideobutton').hide();
					}
					*/
					this._videosCollection.models[0].attributes.offlineurl = _thisViewVideoDetails.offlineurl;

					var htmlContent = '';
					$(this.el).html(htmlContent);
					_.each(this._videosCollection.models, function(model) {
						this.id = model.get('id');
						this.videourl = model.get('videourl');
						_thisViewVideoDetails.insertVariables(model);
					});
					// console.log('this._videosCollection.models[0].attributes.videourl');
					// console.log(this._videosCollection.models[0].attributes.videourl);
					// alert(showVideoLength);
					// console.log(window.me.purchases);
					// console.log(this._videosCollection.models[0].attributes.id);
					// alert($.inArray( this._videosCollection.models[0].attributes.id , window.me.purchases ));
					if (this._videosCollection.models[0].attributes.offlineurl!='') this._videosCollection.models[0].attributes.videourl = this._videosCollection.models[0].attributes.offlineurl;
					window.createVideoPreview(_thisViewVideoDetails.$('#video_player_1'),'video_player_1',this._videosCollection.models[0].attributes.videourl,showVideoLength);
					$('video_player_1_html5_api').css("z-index","2147483647");
					// alert(_thisViewVideoDetails.videourl);
					// alert(this._videosCollection.models[0].attributes.videourl);
					hideModal();
					this.$el.trigger('create');
					new FastClick(document.body);
					
					var slicePoint = Math.round($(window).width()/10-5);
					// alert(slicePoint);
					_thisViewVideoDetails.title_shorten = this._videosCollection.models[0].attributes.title;
					if (_thisViewVideoDetails.title_shorten.length>slicePoint) _thisViewVideoDetails.title_shorten = _thisViewVideoDetails.title_shorten.substr(0,slicePoint)+'...';

					_thisViewVideoDetails.fullname_shorten = _thisViewVideoDetails.uploaderdata.fullname;
					if (_thisViewVideoDetails.fullname_shorten.length>slicePoint) _thisViewVideoDetails.fullname_shorten = _thisViewVideoDetails.fullname_shorten.substr(0,slicePoint)+'...';
					
					this.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
						fontResize();
						// alert($('.readmore').html());
						$('.readmoretitle').expander({
							slicePoint: 0,
							preserveWords: false,
							expandPrefix: '',
							expandEffect: 'fadeIn',
							expandSpeed: 500,
							collapseEffect: 'fadeOut',
							collapseSpeed: 200,
							expandText: _thisViewVideoDetails.title_shorten,
							userCollapseText: '',
							userCollapse: false
						});
						$('.readmore').expander({
							slicePoint: slicePoint*4,
							preserveWords: true,
							expandPrefix: '...',
							expandEffect: 'fadeIn',
							expandSpeed: 500,
							collapseEffect: 'fadeOut',
							collapseSpeed: 200,
							expandText: ' Weiterlesen...',
							userCollapseText: '',
							userCollapse: false
						});
						$('.readmorename').expander({
							slicePoint: 0,
							preserveWords: false,
							expandPrefix: '',
							expandEffect: 'fadeIn',
							expandSpeed: 500,
							collapseEffect: 'fadeOut',
							collapseSpeed: 200,
							expandText: _thisViewVideoDetails.fullname_shorten,
							userCollapseText: '',
							userCollapse: false
						});
					});
					_thisViewVideoDetails.bindEvents();
					return this;
				}

			});

        return VideoDetailsViewVar;

    }

);