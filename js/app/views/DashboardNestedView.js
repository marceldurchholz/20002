// DashboardNestedView.js
// -------
define(["jquery", "backbone", "text!templates/DashboardNestedViewPage.html"],

    function($, Backbone, DashboardNestedViewPage){
		
		var DashboardNestedViewVar = Backbone.View.extend({
			el: "#DashboardNestedViewDiv",
			initialize: function() {
				_thisViewDashboardNested = this;
				console.log('initialize DashboardNestedView.js');
				// alert('dashboard');
				this.$el.hide();
				showModal();
				// alert(window.me.username);
				// dpd.users.me(function(me) {
				// alert(window.system.uid);
				dpd('users').get(window.system.uid, function(me, err) {
					if (me) {
						// alert('yes');
						_thisViewDashboardNested.initializedata();
					}
					else {
						// alert('no');
						system.redirectToUrl('#login');
					}
				});
			},
			initializedata: function() {
				console.log('initializedata DashboardNestedView.js');
				// $(this.el).html('loading...');
				_thisViewDashboardNested.me = window.me;
				
				var query = {  readby: {$nin: [me.id]},  $fields: {id: 1}, receiver:me.id, $sort:{cdate:1}};
				// dpd.messages.get(query, function (allmessagesdata) {
				// var query = "";
				dpd.messages.get(query, function(messagesdata) {
					if (messagesdata) {
						// console.log(messagesdata.length);
						_thisViewDashboardNested.me.newmsgs = messagesdata.length;
						// return(false);
						messagesdata.length = 0;
						_thisViewDashboardNested.render();
					}
					else {
						messagesdata.length = 0;
						// alert('error ? ! ?');
						// console.log('you are not logged in');
					}
				});
			},
			fetch: function() {	
				_thisViewDashboardNested = this;
				console.log('fetching DashboardNestedView.js');
			},
			showDetails: function(e) {
				// e.preventDefault();
				var id = $(e.currentTarget).data("id");
				// var item = this.collection;
				// console.log(item);
				console.log('showDetails: '+id);
				// window.location.hash = '#videos/details/'+id;
				// Router.navigate( $(this).attr('href') );
				window.location.hash = '#videos/details/view/'+id;
				// alert('bla');
			},
			bindEvents: function() {
				var _thisViewDashboardNested = this;
				dpd.messages.off('create');
				dpd.messages.on('create', function(msgData) {
					_thisViewDashboardNested.initializedata();
					/*
					if (_thisMessagesDetailsViewNested.messages==undefined) _thisMessagesDetailsViewNested.messages= new Array;
					_thisMessagesDetailsViewNested.messages.push(msgData);
					_thisMessagesDetailsViewNested.$el.html(_.template(MessagesDetailsViewNestedPage, {
						data: _thisMessagesDetailsViewNested.messages
					},{variable: 'messages'}));
					_thisMessagesDetailsViewNested.$el.trigger('create');
					new FastClick(document.body);
					$('#page-content').stop().animate({
					  scrollTop: $("#page-content")[0].scrollHeight
					}, 0);
					*/
				});
				// dpd.users.me(function(user) {
				dpd('users').get(window.system.uid, function(user, err) {
					if (user) {
						// _thisViewDashboardNested.me = user;
						if (_thisViewDashboardNested.me.active==false || user.fullname=='') {
							$('#showMenu').hide();
							$('#showPageOptions').hide();
							// system.redirectToUrl('#myprofile');
							window.location.href = '#myprofile';
						}
					}
					else {
						// location.href = "#noaccess";
						// console.log('you are not logged in');
					}
				});
			},
			render: function() {
				var _thisViewDashboardNested = this;
				console.log('rendering DashboardNestedView.js');
				var htmlContent = '';
				$(this.el).html(htmlContent);
				if (_thisViewDashboardNested.me.pictureurl==undefined || _thisViewDashboardNested.me.pictureurl.length<=10) {
					_thisViewDashboardNested.me.pictureurl = 'images/avatar.jpg';
				}
				htmlContent = _.template(DashboardNestedViewPage, {
					id: _thisViewDashboardNested.me.id
					, pictureurl: _thisViewDashboardNested.me.pictureurl
					, fullname: _thisViewDashboardNested.me.fullname
					, username: _thisViewDashboardNested.me.username
					// , newmsgs: _thisViewDashboardNested.me.newmsgs
					, newmsgs: 0
				},{variable: 'user'});
				$(this.el).html(htmlContent);
				hideModal();
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 1000, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				this.bindEvents();
				return(this);
			}
		});

        return DashboardNestedViewVar;

    }

);