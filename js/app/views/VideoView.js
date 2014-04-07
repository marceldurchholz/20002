// VideoView.js
// -------
define(["jquery", "backbone", "models/VideoModel", "collections/videosCollection", "text!templates/videoView.html"],

    function($, Backbone, VideoModel, videosCollection, videoPage){
		
		var VideoViewVar = Backbone.View.extend({
			
			el: "#VideosNestedViewDiv",
			initialize: function() {
				_thisViewVideo = this;
				// console.log('initializing VideoView.js');
				showModal();
				_thisViewVideo.checkLogin();
				var streamData = new Array();
				_thisViewVideo.streamData = streamData;
			},
			checkLogin:function() {
				dpd('users').get(window.system.uid, function(user, err) {
					if (user) { }
					else system.redirectToUrl('#login');
				});
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
				_thisViewVideo = this;
				this.$el.hide();
				
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					// alert(me.id);
					_thisViewVideo.me = me;
				if (_thisViewVideo.me.interests == undefined) _thisViewVideo.me.interests = new Array();
				});
				
				var requestUrl = "http://dominik-lohmann.de:5000/videos?active=true&deleted=false";
				if (window.system.master!=true) requestUrl = requestUrl + "&uploader="+window.system.aoid;
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(videoData) {
					_thisViewVideo.uploaderArray = new Array();
					_.each(videoData, function(value, index, list) {
						var filter = 0;
						var exists = $.inArray( value.topic, _thisViewVideo.me.interests );
						if (_thisViewVideo.me.interests == undefined) exists=1;
						else if (_thisViewVideo.me.interests.length==0) exists=1;
						if (exists>-1 || value.uploader == me.id || filter==0) {
							value.ccat = 'video';
							value.icon = 'images/icon-multimedia-60.png';
							value.href = '#videos/details/view/'+value.id;
							var uploader = value.uploader;
							console.log(uploader);
							console.log(_thisViewVideo.uploaderArray[uploader]);
							if (_thisViewVideo.uploaderArray[uploader]==undefined) {
								$.ajax({
									url: 'http://dominik-lohmann.de:5000/users/?id='+uploader,
									async: false,
									success: function(data, textStatus, XMLHttpRequest) {
										console.log(data);
										value.uploaderdata = data;
										_thisViewVideo.uploaderArray[data.id]==data;
										console.log(_thisViewVideo.uploaderArray[data.id]);
										// _thisViewVideo.streamData.push(value);
										// _thisViewVideo.rowContent = _thisViewVideo.rowContent + _thisViewVideo.insertData(value);
									},
									error:function (xhr, ajaxOptions, thrownError) {
										console.log(xhr.responseText);
										/*
										if (xhr.responseText=='{"message":"not found","statusCode":404,"status":404}') {
											dpd.videos.put(model.attributes.id, {"active":false}, function(result, err) {
											  if(err) return console.log(err);
											});
										}
										*/
									}
								});
							}
							else {
								value.uploaderdata = _thisViewVideo.uploaderArray[uploader];
							}
							
							if ((window.system.master==true && value.public==true) || (window.system.master==false && window.system.aoid==value.uploader)) { 
								_thisViewVideo.streamData.push(value);
							}
						}
					});
				});
				_thisViewVideo.render();				
			},
			bindEvents: function() {
				var _thisViewVideo = this;
				this.$el.off('click','.showVideoDetailsLink').on('click','.showVideoDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
			},
			insertData: function(value) {
				_thisViewVideo = this;
				rowContent = '';
				rowContent = _.template(videoPage, {
					id: value.id,
					uploader: value.uploaderdata.fullname,
					videourl: value.videourl,
					title: value.title,
					description: value.description,
					price: value.price,
					thumbnailurl: value.thumbnailurl,
					topic: value.topic
				},{variable: 'video'});
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
				
				
				// _thisViewVideo.htmlContent = '';
				// _thisViewVideo.rowContent = '';
				/*
				_thisViewVideo.htmlContent = '<ul id="videosListView" data-filter="true" data-filter-placeholder="Suchfilter..." data-filter-theme="a" data-role="listview" data-theme="a" data-divider-theme="b" data-autodividers="true">';
				*/
				/*
				_.each(videoData, function(value, index, list) {
					_thisViewVideo.streamData
				}
				*/
				/*
				_thisViewVideo.htmlContent += _thisViewVideo.rowContent;
				_thisViewVideo.htmlContent += '</ul>';
				*/
				
				console.log(_thisViewVideo.streamData);
				
				_thisViewVideo.$el.html(_.template(videoPage, {
					data: _thisViewVideo.streamData
				},{variable: 'videos'}));

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