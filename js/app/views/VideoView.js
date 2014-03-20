// VideoView.js
// -------
define(["jquery", "backbone", "models/VideoModel", "collections/videosCollection", "text!templates/videoView.html"],

    function($, Backbone, VideoModel, videosCollection, videoPage){
		
		var VideoViewVar = Backbone.View.extend({
			
			el: "#VideosNestedViewDiv",
			initialize: function() {
				// console.log('initializing VideoView.js');
			},
			initializeme: function() {
				// console.log('initializing ME in VideoView.js');
				$(this.el).html('loading...');
				$.when( this.fetchMe() ).then(
				  function( status ) {
					_thisViewVideo.me = status;
					_thisViewVideo.render();
				  },
				  function( status ) {
					alert( "Benutzer konnte nicht erkannt werden." );
				  },
				  function( status ) {
					// console.log('still fetchWorking');
				  }
				);
			},
			fetchWorking: function() {
				var setTimeoutWatcher = setTimeout(function foo() {
					if ( _thisViewVideo.dfd.state() === "pending" ) {
						_thisViewVideo.dfd.notify( "working... " );
						setTimeout( _thisViewVideo.fetchWorking, 100 );
					}
				}, 1 );
			},
			fetchMe: function() {
				_thisViewVideo = this;
				// console.log('fetchMe VideoView.js');
				_thisViewVideo.dfd = new $.Deferred();
				_thisViewVideo.fetchWorking();
				// dpd.users.me(function(me) {
				dpd('users').get(window.system.uid, function(me, err) {
					if (me) {
						var fetchMe = setTimeout ( function() {
							_thisViewVideo.dfd.resolve(me);
						}, 0 );
					}
					else {
						// console.log('You are not logged in!');
						// window.location.href = "#noaccess";
						var meid = getRandomID().toString();
						var me = new Object();
						me.id = meid;
						_thisViewVideo.dfd.resolve(me);
					}
				});
				return this.dfd.promise();
			},
			fetch: function() {	
				// alert('bla');
				_thisViewVideo = this;
				// console.log('fetching VideoView.js');
				this.$el.hide();
				showModal();
				
				this._videosCollection = new videosCollection();
				this._videosCollection.fetch({
					success: function(coll, jsoncoll) {
						// console.log(_thisViewVideo);
						// _thisViewVideo.render();
						// _thisViewVideo.initializeme();
						// console.log(this._videosCollection);
						_thisViewVideo.initializeme();
					},
					error: function(action, coll) {
						console.log('ERROR fetching _videosCollection');
						// console.log(action);
						// console.log(coll);
						// _thisViewVideo.render();
					}
				});
			},
			bindEvents: function() {
				var _thisViewVideo = this;
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewVideo.clicked(e);});
				this.$el.off('click','.showVideoDetailsLink').on('click','.showVideoDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
				/*
				this.$el.off('click','.isVideoToFavourites').on('click','.isVideoToFavourites',function(event){
					event.preventDefault();
					// alert('isVideoToFavourites');
					doAlert('Das Medienobjekt befindet sich bereits in Ihren Favoriten.','Information');
				});
				this.$el.off('click','.addVideoToFavourites').on('click','.addVideoToFavourites',function(event){
					event.preventDefault();
					console.log(event);
					$(this).removeClass("addVideoToFavourites");
					$(this).addClass("isVideoToFavourites");
					var videoid = $(event.currentTarget).attr('data-link');
					var _videoid = videoid;
					console.log(_videoid);
					dpd.users.get({id:_thisViewVideo.me.id,following:_videoid}, function(result, error) {
						if (result) {
							console.log(result);
							}
						else {
							// console.log(error);
							dpd.users.put(_thisViewVideo.me.id, {following:{$push:_videoid}}, function(result, error) {
								if (result) {
									console.log(result);
									doAlert('Das Medienobjekt befindet sich nun in Ihren Favoriten.','Favorit gespeichert!');
									}
								else {
									// console.log(error);
								}
							});
						}
					});
				});
				*/
			},
			insertData: function(model) {
				_thisViewVideo = this;
				var uploader = model.get('uploader');
				/*
				// if ( typeof( _thisViewVideo.uploaderdata ) == "undefined") {
					$.ajax({
						url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
						async: false
					}).done(function(uploaderdata) {
						// $( this ).addClass( "done" );
						console.log(uploaderdata);
						_thisViewVideo.uploaderdata = uploaderdata;
					});
				// }
				*/
				// console.log($.inArray(model.id, _thisViewVideo.me.following));
				/*
				if ($.inArray(model.id, _thisViewVideo.me.following)==-1) {
					model.set("favclass","addVideoToFavourites");
				}
				else {
					model.set("favclass","isVideoToFavourites");
				}
				*/
				// console.log(model);
				rowContent = '';
				if (window.system.aoid=='' || model.get('uploader') == window.system.aoid) {
					rowContent = _.template(videoPage, {
						id: model.get('id'),
						// uploader: model.get('uploader'),
						uploader: model.get('uploaderdata').fullname,
						videourl: model.get('videourl'),
						title: model.get('title'),
						description: model.get('description'),
						price: model.get('price'),
						thumbnailurl: model.get('thumbnailurl'),
						topic: model.get('topic'),
						favclass: model.get('favclass')
					},{variable: 'video'});
				}
				return(rowContent);
			},
			render: function() {
				this.bindEvents();
				var _thisViewVideo = this;
				// console.log('DOING render VideoView.js called');
				
				
				/*
				// Sort multidimensional arrays with oobjects by value 
				// http://www.javascriptkit.com/javatutors/arraysort2.shtml
				this._videosCollection.sort(function(a, b){
				 var nameA=a.attributes.topic.toLowerCase(), nameB=b.attributes.topic.toLowerCase()
				 if (nameA < nameB) //sort string ascending
				  return -1 
				 if (nameA > nameB)
				  return 1
				 return 0 //default return value (no sorting)
				});
				*/
				
				
				_thisViewVideo.htmlContent = '';
				_thisViewVideo.rowContent = '';
				_.each(this._videosCollection.models, function(model) {
					// this.id = model.get('id');
					// console.log(model);
					var uploader = model.attributes.uploader; // "ed568841af69d94d";
					$.ajax({
						// type: 'get',
						// timeout: 5000,
						url: 'http://dominik-lohmann.de:5000/users/?id='+uploader,
						async: false,
						success: function(data, textStatus, XMLHttpRequest){
							model.attributes.uploaderdata = data;
							_thisViewVideo.rowContent = _thisViewVideo.rowContent + _thisViewVideo.insertData(model);
						},
						error:function (xhr, ajaxOptions, thrownError) {
							/*
							console.log('error');
							console.log(xhr.status);
							console.log(xhr.statusText);
							console.log(xhr.responseText);
							console.log(ajaxOptions);
							console.log(thrownError);
							*/
							if (xhr.responseText=='{"message":"not found","statusCode":404,"status":404}') {
								// console.log('deactivating');
								
								dpd.videos.put(model.attributes.id, {"active":false}, function(result, err) {
								  if(err) return console.log(err);
								  // console.log(result, result.id);
								});


								
							}
						}
					});
				});
				_thisViewVideo.htmlContent = '<ul id="videosListView" data-filter="true" data-filter-placeholder="Suchfilter..." data-filter-theme="a" data-role="listview" data-theme="a" data-divider-theme="b" data-autodividers="true">'+_thisViewVideo.rowContent+'</ul>';
				$(this.el).html(_thisViewVideo.htmlContent);
				$("#videosListView").listview({
				  autodividers: true,
				  autodividersSelector: function ( li ) {
					// console.log(li);
					var rowTopic = li.data( "topic" );
					var out = rowTopic;
					return out;
				  }
				});				
				hideModal();
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					// $('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				return this;				
			}
		});

        return VideoViewVar;

    }

);