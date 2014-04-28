// VideoRecordNestedView.js
// -------
define(["jquery", "backbone", "text!templates/captureVideoLinkPage.html", "models/VideoModel", "collections/videoRecordCollection", "text!templates/VideoRecordNestedPage.html", "text!templates/VideoRecordNestedPageTwo.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, captureVideoLinkPage, VideoModel, videoRecordCollection, VideoRecordNestedPage, VideoRecordNestedPageTwo, sidemenusList, SidemenuView){
		
		var VideoRecordNestedViewVar = Backbone.View.extend({
			
			el: "#VideoRecordNestedViewDiv",
			collection: new Backbone.LocalStorage("videoRecordStorage"),
			model: VideoModel,
			initialize: function() {
				_thisViewRecordVideoNested = this;
				console.log('initializing VideoRecordNestedView.js');
				_thisViewRecordVideoNested.localStorageSubmitformModel = new VideoModel();
				// _thisViewRecordVideoNested.localStorageSubmitformModel.set('title','Dies ist ein Titel');
				// _thisViewRecordVideoNested.localStorageSubmitformModel.set('subtitle','Dies ist ein Untertitel');
				// _thisViewRecordVideoNested.localStorageSubmitformModel.set('description','Dies ist eine Beschreibung.');
				_thisViewRecordVideoNested.localStorageSubmitform = new videoRecordCollection();
				_thisViewRecordVideoNested.localStorageSubmitform.set(_thisViewRecordVideoNested.localStorageSubmitformModel);
				this.activePage = VideoRecordNestedPage;
			},
			/*
			initializeme: function() {
				console.log('initializing ME in VideoRecordNestedView.js');
				$(this.el).html('loading...');
				$.when( this.fetchMe() ).then(
				  function( status ) {
					_thisViewRecordVideoNested.me = status;
					_thisViewRecordVideoNested.render();
				  },
				  function( status ) {
					console.log( "you fail this time" );
					system.redirectToUrl('#login');
				  },
				  function( status ) {
					console.log('still fetchWorking');
				  }
				);
			},
			*/
			fetchWorking: function() {
				var setTimeoutWatcher = setTimeout(function foo() {
					if ( _thisViewRecordVideoNested.dfd.state() === "pending" ) {
						_thisViewRecordVideoNested.dfd.notify( "working... " );
						setTimeout( _thisViewRecordVideoNested.fetchWorking, 100 );
					}
				}, 1 );
			},
			fetchMe: function() {
				_thisViewRecordVideoNested = this;
				console.log('fetchMe VideoRecordNestedView.js');
				_thisViewRecordVideoNested.dfd = new jQuery.Deferred();
				_thisViewRecordVideoNested.fetchWorking();
				dpd('users').get(window.system.uid, function(user, err) { 
				// dpd.users.me(function(user) {
					if (user) {
						var fetchMe = setTimeout ( function() {
							_thisViewRecordVideoNested.dfd.resolve(user);
						}, 0 );
					}
					else {
						console.log('You are not logged in!');
						window.location.href = "#noaccess";
					}
				});
				return this.dfd.promise();
			},
			fetch: function() {	
				_thisViewRecordVideoNested = this;
				console.log('fetching VideoRecordNestedView.js');
				this.$el.hide();
				// _thisViewRecordVideoNested.initializeme();
				$.ajax({
					url: "http://dominik-lohmann.de:5000/interests",
					async: false
				}).done(function(interests) {
					_thisViewRecordVideoNested.interests = interests;
				});
				_thisViewRecordVideoNested.interests.sort(function(a, b){
					 var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
					 if (nameA < nameB) //sort string ascending
					  return -1 
					 if (nameA > nameB)
					  return 1
					 return 0 //default return value (no sorting)
				});
				
				dpd('users').get(window.system.uid, function(me, err) { 
					if (me) {
						window.me = me;
						_thisViewRecordVideoNested.me = me;
						_thisViewRecordVideoNested.render();
					}
					else {
						// console.log('Redirecting... You are not logged in!');
						window.location.href = "#login";				
					}
				});
				
				// console.log(_thisViewRecordVideoNested.interests);
			},
			switchPage: function() {
				this.activePage = VideoRecordNestedPageTwo;
				this.render();
			},
			savePageOne: function(event) {
				event.preventDefault();
				var _thisViewRecordVideoNested = this;
				// testFunc();
				// return(false);
				var videosrc = $("#video_player").attr("src");
				if (videosrc==undefined || videosrc=='') {
					// if (!isMobile.any()) videosrc = 'https://dl.dropboxusercontent.com/u/45253363/appinaut/videos/1111111111.mp4';
					// else {
						doAlert('Bitte nehmen es eines auf auf oder verknüpfen Sie ein existierendes Video.','Und das Video?');
						return(false);
					// }
				}
				_thisViewRecordVideoNested.formValues = new Object;
				_.each(this.$('#submitform').serializeArray(), function(input){
					// console.log('getting: '+input.name+' >> '+input.value);
					_thisViewRecordVideoNested.localStorageSubmitformModel.set(input.name,input.value);
				});
				_thisViewRecordVideoNested.localStorageSubmitform.set(_thisViewRecordVideoNested.localStorageSubmitformModel);
				this.switchPage();
			},
			backToPageOne: function(event) {
				event.preventDefault();
				var _thisViewRecordVideoNested = this;
				_thisViewRecordVideoNested.formValues = new Object;
				_.each(this.$('#submitform').serializeArray(), function(input){
					_thisViewRecordVideoNested.localStorageSubmitformModel.set(input.name,input.value);
				});
				_thisViewRecordVideoNested.localStorageSubmitform.set(_thisViewRecordVideoNested.localStorageSubmitformModel);
				this.activePage = VideoRecordNestedPage;
				this.render();
			},
			savePageTwo: function(event) {
				event.preventDefault();
				// alert('savePageTwo');
				var _thisViewRecordVideoNested = this;
				/*
				if ($('#blafoopeng').val()=='') {
					doAlert('','');
					return(false);
				}
				*/
				_thisViewRecordVideoNested.stop = false;
				_thisViewRecordVideoNested.formValues = new Object;
				_.each(this.$('#submitform').serializeArray(), function(input){
					if (input.value=='') {
						doAlert('Es fehlen Angaben in mindestens einem Formularfeld.','Formular unvollständig!');
						console.log(input);
						_thisViewRecordVideoNested.stop=true;
						// return(false);
					}
					// console.log('getting: '+input.name+' >> '+input.value);
					_thisViewRecordVideoNested.localStorageSubmitformModel.set(input.name,input.value);
				});
				if(_thisViewRecordVideoNested.stop==true) return(false);
				_thisViewRecordVideoNested.localStorageSubmitform.set(_thisViewRecordVideoNested.localStorageSubmitformModel);
				// this.activePage = VideoRecordNestedPageTwo;
				// this.render();
				console.log(_thisViewRecordVideoNested.localStorageSubmitform);
				
				// return(false);
				if (isMobile.any()) captureVideoUpload(_thisViewRecordVideoNested.localStorageSubmitform);
				else {
					var attributes = _thisViewRecordVideoNested.localStorageSubmitform.models[0].attributes;
					console.log(attributes);
					if (attributes.flipactivate=="on") var isactive = true; else var isactive = false;
					dpd.videos.post({"external":true,"vsize":"","vlength":"","uploader":""+_thisViewRecordVideoNested.me.id,"videourl":""+attributes.camera_file,"active":isactive,"cdate":""+dateYmdHis(),"topic":""+attributes.interest,"title":""+attributes.title,"subtitle":"","description":""+attributes.description,"price":attributes.sliderprice}, function(result, err) {
						if(err) {
							hideModal();
							return console.log(err);
						}
						hideModal();
						window.location.href = '#learningstreamview';
					});
				}
			},
			bindEvents: function() {
				var _thisViewRecordVideoNested = this;
				$('#body').off( "swiperight", "#page-content");
				
				_thisViewRecordVideoNested.$el.off('click','#captureVideoLinkPopup').on('click','#captureVideoLinkPopup',function(e){
					e.preventDefault();
					var popupid = 'popupBasic';
					$('#pageoverlay').append('<div style="z-index:9999;width:'+($(window).width()-30)+'px;min-width:200px !important;max-width:650px !important;" data-role="popup" data-dismissible="true" data-overlay-theme="a" class="ui-corner-all" data-theme="b" id="'+popupid+'"></div>');
					$('#'+popupid).html('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right"></a>');			
					$('#'+popupid).append('<div class="ui-corner-bottom ui-content" id="popupcontent" data-role="content"></div>');
					$( "#"+popupid ).bind({
						popupafterclose: function(event, ui) { 
							var videoLink = $('#linkVideoUrl').val();
							// var videoLink = "http://download.wavetlan.com/SVV/Media/HTTP/H264/Talkinghead_Media/H264_test1_Talkinghead_mp4_480x360.mp4";
							if (videoLink!='') {
								var video_player = $('#video_player');
								video_player.attr("src", videoLink).get(0).pause();
								$('#camera_file').val(videoLink);
							}
							$('#body').find('.ui-popup-container').each(function() {
								$(this).remove();
							});
						}
					});
					var popupcontent = _.template(captureVideoLinkPage, {
						data: _thisViewRecordVideoNested.me
					},{variable:'user'});
					$('#popupcontent').html(popupcontent);
					var el = $( "#"+popupid );
					el.popup().trigger('create');
					el.popup( "open", {transition: 'fade'} );
				});
				
				this.$el.off('change','#sliderprice').on('change','#sliderprice',function(event){
					$('#priceincoins').html($('#sliderprice').val());					
					var priceineuro = ((Math.ceil($('#sliderprice').val()*0.0055*100))/100).toString().replace(".", ",");
					if (priceineuro.split(",")[1]==undefined) priceineuro = priceineuro + ",00";
					else if (priceineuro.split(",")[1].length==0) priceineuro = priceineuro + "00";
					else if (priceineuro.split(",")[1].length==1) priceineuro = priceineuro + "0";
					$('#priceineuro').html(priceineuro);
				});
				
				/*
				$('#slider').val('on');
				try {
					$('#slider').slider("refresh");
				}
				catch (err) {
					console.log ("Error occurred refreshing slider (probabily first time!)");
				}
				*/
				
				// $('#sliderprice').css({"visibility":"hidden","width":"0","display":"none"});
				// $( ".ui-slider" ).css( {"width":"90% !important"} );
				// $( "input.ui-slider-input" ).css( {"display":"none !important"} );
				
				/*
				this.$el.off('click','#checkLocalTitleButton').on('click','#checkLocalTitleButton',function(event){
					event.preventDefault();
					recordVideoUpload(_thisViewRecordVideoNested.localStorageSubmitform);
				});
				*/
				this.$el.off('click','#submitbutton').on('click','#submitbutton',function(event){
					event.preventDefault();
					_thisViewRecordVideoNested.savePageOne(event);
				});
				this.$el.off('click','#recordMediaUploadButton').on('click','#recordMediaUploadButton',function(event){
					event.preventDefault();
					/*
					if (!isMobile.any()) {
						doAlert('Die Uploadfunktion ist in einem APPinaut® Preview Beispiel nicht möglich. Sie werden statt dessen zur Pinnwand Ihres APPinaut® weitergeleitet.','APPinaut® Information');
						window.location.href = "#learningstreamview";
					}
					else {
						_thisViewRecordVideoNested.savePageTwo(event);
					}
					*/
					_thisViewRecordVideoNested.savePageTwo(event);
				});
				this.$el.off('click','#formbackbutton').on('click','#formbackbutton',function(event){
					event.preventDefault();
					_thisViewRecordVideoNested.backToPageOne(event);
				});
				this.$el.off('click','#captureVideoRecordButton').on('click','#captureVideoRecordButton',function(event){
					event.preventDefault();
					if (!isMobile.any()) {
						doAlert('Die Aufnahmefunktion ist in einem APPinaut® Preview Beispiel nicht möglich. Es wird statt dessen ein Beispielvideo verwendet.','APPinaut® Information');
						$("#video_player").attr("src", "https://dl.dropboxusercontent.com/u/45253363/appinaut/videos/1111111111.mp4").get(0).play();
					}
					else captureVideoRecord();
				});
				$('#downloadVideoInputDiv').toggle();
				this.$el.off('click','.downloadVideoToggleButton').on('click','.downloadVideoToggleButton',function(event){
					event.preventDefault();
					_thisViewRecordVideoNested.downloadVideoToggle();
				});
				this.$el.off('click','#downloadVideoButton').on('click','#downloadVideoButton',function(event){
					event.preventDefault();
					_thisViewRecordVideoNested.downloadVideo();
				});
				
				// $('#uploadstatusbar').hide();
				// $('#videobox').hide();
				
				/*
				this.$el.off('click','#captureVideoUploadButton').on('click','#captureVideoUploadButton',function(event){
					event.preventDefault();
					captureVideoUpload();
				});
				*/
				// $('#captureVideoUploadButton').button('disable');
				// $('#submitbutton').button('disable');
				window.resizeElement('#videobox');
				window.resizeElement('#video_player');					
				$(window).resize(function() {
					window.resizeElement('#videobox');
					window.resizeElement('#video_player');
					// window.resizeElement('#video_player_1')
				});
				
			},
			downloadVideo: function() {
				var _thisViewRecordVideoNested = this;
				// showModal();
				var fileSystem;
				// console.log('starting downloadVideo a');
				var ft = new FileTransfer();
				// console.log('starting downloadVideo b');
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
					// console.log('starting downloadVideo c');
					var downloadPath = fs.root.fullPath + "/download.mp4";
					// console.log(downloadPath);
					var uri = '';
					uri =  $('#downloadVideoUrl').val();
					// if (!isMobile.any()) uri = encodeURI("http://management-consulting.marcel-durchholz.de/secure/4444444444.mp4");
					// else uri =  $('#downloadVideoUrl').val();
					// console.log('starting downloadVideo d');
					// console.log(uri);
					// console.log(downloadPath);
					var oldprogress = 0;
					ft.onprogress = function(progressEvent) {
						// $('#uploadstatusbar').html(round((progressEvent.loaded/progressEvent.total)*100)+' %');
						// $('#uploadstatusbar').html(round((progressEvent.loaded/progressEvent.total)*10000)+' % (' + progressEvent.loaded + ' / ' + progressEvent.total + ')');
						// console.log(progressEvent.loaded + " / " + progressEvent.total);
						$('#modaltxt').html(progressEvent.loaded+" / "+progressEvent.total);
						if (oldprogress == progressEvent.loaded) {} 
						else window.system.modaltimeout = 60000;
						oldprogress = progressEvent.loaded;
						
					};
					ft.download(uri, downloadPath, 
					function(entry) {
						console.log(entry);
						// var media = new Media(entry.fullPath, null, function(e) { alert(JSON.stringify(e));});
						// media.play();
						_thisViewRecordVideoNested.downloadVideoToggle();
						$('#camera_file').val(downloadPath);
						hideModal();
					}, 
					function(error) {
						console.log(error);
						// doAlert('Da ist etwas schiefgegangen. Die Datei konnte nicht vollständig heruntergeladen werden. Bitte probieren Sie es erneut oder wenden Sie sich an unseren Support. Vielen Dank.','Ups!');						
						hideModal();
					});
					
				});
				/*
				ft.onprogress = function(progressEvent) {
					if (progressEvent.lengthComputable) {
						var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
						statusDom.innerHTML = perc + "% loaded...";
					} else {
						if(statusDom.innerHTML == "") {
							statusDom.innerHTML = "Loading";
						} else {
							statusDom.innerHTML += ".";
						}
					}
				};
				*/
			},
			downloadVideoToggle: function() {
				var _thisViewRecordVideoNested = this;
				$('#downloadVideoToggleButton').toggle();
				$('#captureVideoRecordButton').toggle();
				$('#downloadVideoInputDiv').toggle();
				/*
				if (window.system.contentHelper==1) {
					$('#downloadVideoUrl').val('https://dl.dropboxusercontent.com/u/45253363/appinaut/videos/1111111111.mp4'); // http://management-consulting.marcel-durchholz.de/secure/1391304708489.mp4
					$('#camera_file').val('file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4');
				}
				*/
			},
			render: function() {
				var _thisViewRecordVideoNested = this;
				console.log('DOING render VideoRecordNestedView.js called');
				_thisVideoRecordAttributes = _thisViewRecordVideoNested.localStorageSubmitform.models[0].attributes;
				if (_thisVideoRecordAttributes['sliderprice']==undefined) _thisVideoRecordAttributes['sliderprice'] = "1800";
				// console.log(_thisVideoRecordAttributes['sliderprice']);
				_thisViewRecordVideoNested.$el.html(_.template(_thisViewRecordVideoNested.activePage, {
					slider_price:_thisVideoRecordAttributes['sliderprice'],
					interests:_thisViewRecordVideoNested.interests					
				},{variable: 'video'}));
				
				// var testvideo = 'file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4';
				/*
				if (!isMobile.any()) {
					$('#camera_file').val('file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4');
					// alert($('#camera_file').val());
				}
				*/
				// $(function(){
					// $("#video_player").attr("src", "file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4").get(0).play();
				// });
				this.$el.trigger('create');
				sendLocalStorageToElements(_thisViewRecordVideoNested.localStorageSubmitform.models);
				var mediaFilePath = $('#camera_file').val();
				// console.log(mediaFilePath);
				// alert(mediaFilePath);
				/*
				if (window.system.contentHelper==1) {
					attachVideoToPlayer(testvideo);
				}
				*/
				hideModal();
				this.$el.fadeIn( 500, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				this.bindEvents();
				return this;
			}
		});

        return VideoRecordNestedViewVar;

    }

);