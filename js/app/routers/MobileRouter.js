// MobileRouter.js
// ---------------
define(["jquery", "backbone", "models/Profile", "models/System", "views/View", "views/Aboutus", "views/Listview", "views/Videos", "views/Planer", "views/Cards", "views/AdminUserListView", "views/AdminUserDetailsView", "views/VideoDetailsView", "views/MessageDetailsView", "views/PlanDetailsView", "views/CardDetailsView", "views/CardStartView", "views/VideoRecordView", "views/LearningStreamView", "views/loginView", "views/DashboardView", "views/NoAccess", "views/LogoutView", "views/MyProfileView", "views/supportView", "views/helpView", "views/agbView", "views/privacyView", "views/MessagesView", "views/MessagesEditView"],
        
    function($, Backbone, Profile, System, View, Aboutus, Listview, Videos, Planer, Cards, AdminUserListView, AdminUserDetailsView, Videosdetailsview, MessageDetailsView, Planerdetailsview, Cardsdetailsview, Cardstartview, Videorecordview, Learningstreamview, loginView, DashboardView, NoAccess, Logout, MyProfile, supportView, helpView, agbView, privacyView, MessagesView, MessagesEditView) {

		var MobileRouter = Backbone.Router.extend({

			/*
			routerSwitched: function(status) {
				var routerSwitchedDeferred = $.Deferred();
				var routerSwitchedDeferredWatcher = routerSwitchedDeferred.then(function( value ) {
					return status;
				});
				routerSwitchedDeferred.resolve();
				routerSwitchedDeferredWatcher.done(function( value ) {
					alert(value);
					// console.log(value);
				});
			},
            */
			initialize: function() {
                Backbone.history.start();
                // Tells Backbone to start watching for hashchange events
				// report('MobileRouter.js','initialize:');
				// alert('aaa');
				// this.routerSwitched(false);
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash bang on the url, the home method is called
                "": "startpage",
				"home": "home",
				"aboutus" : "aboutus",
				"noaccess" : "noaccess",
				"dashboard" : "dashboard",
				"listview" : "listview",
				"videos" : "videos",
				"videos/details/:id" : "videodetails",
				"videos/details/view/:id" : "videodetailsview",
				"videos/record" : "videorecordview",
				"messages" : "messages",
				"messages/edit/:id" : "MessagesEditRouter",
				"messages/details/view/:id" : "messagedetailsrouter",
				"planer" : "planer",
				"planer/details/:id" : "plandetails",
				"planer/details/view/:id" : "plandetailsview",
				"planer/entry" : "planentryview",
				"cards" : "cards",
				"cards/details/:id" : "carddetails",
				"cards/details/view/:id" : "carddetailsview",
				"cards/start/view/:id/:page" : "cardstartview",
				"cards/edit/:id" : "cardeditview",
				"myprofile" : "myprofile",
				"admin/users" : "adminuserlist",
				"admin/users/details/:id" : "adminuserdetails",
				"learningstreamview" : "learningstreamview",
				"employeeListItemView" : "employeeListItemView",
				"support" : "support",
				"help" : "help",
				"login" : "login",
				"agb" : "agb",
				"privacy" : "privacy",
				"logout" : "logout"
            },
			messages: function() {
				this.changePage(MessagesView,{});
			},
			MessagesEditRouter: function(id) {
				this.changePage(MessagesEditView,{id:id});
			},
			startpage: function() {
				// redirectToUrl();
				// alert('routing to redirectToUrl');
				system.redirectToUrl('#login');
			},
			adminuserlist: function() {
				this.changePage(AdminUserListView, {});
            },
            adminuserdetails: function(id) {
				// new Videosdetailsview({id:id});
				this.changePage(AdminUserDetailsView, {id:id});
            },
			home: function() {
				// alert('routing to home');
				// new View();
				system.redirectToUrl('#login');
				// this.changePage(View, {});
            },
			learningstreamview: function() {
				// alert('routing to home');
				// new Learningstreamview();
				this.changePage(Learningstreamview, {});
				// this.changePage(View, {});
            },
            aboutus: function() {
                // new Aboutus();
				this.changePage(Aboutus, {});
                // this.myView = new Aboutus();
				// $.mobile.changePage($(Aboutus.el), { changeHash: false, transition: 'slide' });
				// return(false);
            },
            listview: function() {
				// $('#page-content').html('aaa');
				// var bla = $('#page-content').html();
				// console.log($(body).html());
				// console.log('bla');
				// myListview.render(); 
				// this.changePage(bla);
				// $('#page-content').remove();
				// var myListview = new Listview();
				// var changePage = this.changePage(Listview, {});
				// $('#page-content').setElement( Listview() );
				// this.changePage();
				this.changePage(Listview, {});
				// var bla = new Listview();
            },
            videos: function() {
                // new Videos();
				this.changePage(Videos, {});
            },
            planer: function() {
                // new Planer();
				// alert('bla');
				this.changePage(Planer, {});
            },
            cards: function() {
                // new Cards();
				// alert('bla');
				this.changePage(Cards, {});
            },
            carddetailsview: function(id) {
				// new Videosdetailsview({id:id});
				this.changePage(Cardsdetailsview, {id:id});
            },
            cardstartview: function(cardid,page) {
				// new Videosdetailsview({id:id});
				this.changePage(Cardstartview, {cardid:cardid,page:page});
            },
            videodetailsview: function(id) {
				// new Videosdetailsview({id:id});
				this.changePage(Videosdetailsview, {id:id});
            },
            messagedetailsrouter: function(id) {
				// new Videosdetailsview({id:id});
				this.changePage(MessageDetailsView, {id:id});
            },
            plandetailsview: function(id) {
				// new Videosdetailsview({id:id});
				this.changePage(Planerdetailsview, {id:id});
            },
			videorecordview: function() {
				// alert('bla');
				this.changePage(Videorecordview, {});
			},
			planentryview: function() {
				// alert('bla');
				this.changePage(Planentryview, {});
			},
            login: function() {
				// alert('routing to login');
                // new login();
				this.changePage(loginView, {});
            },
            support: function() {
				this.changePage(supportView, {});
            },
            help: function() {
				this.changePage(helpView, {});
            },
            agb: function() {
				this.changePage(agbView, {});
            },
            privacy: function() {
				this.changePage(privacyView, {});
            },
            dashboard: function() {
                // new DashboardView();
				this.changePage(DashboardView, {});
            },
            myprofile: function() {
                // new MyProfile();
				this.changePage(MyProfile, {});
            },
            noaccess: function() {
                // new NoAccess();
				this.changePage(NoAccess, {});
            },
            logout: function() {
                // new Logout();
				this.changePage(Logout, {});
            },
			/*
			viewFadeIn: function() {
				// alert('viewFadeIn');
				// $.mobile.loading( 'hide' );
				// $("#page-content").show();
				// $('.ui-content').scrollTop(0);
				$("#page-content").fadeIn( 100, function() {
					// $( "#page-content" ).html('bla');
					// Animation complete
					$('.ui-content').scrollTop(0);
					// console.log("$.mobile.loading( 'hide' )");
					// $.mobile.loading( 'hide' );
					// system.toggleLoading(false);
				});
			},
			testFunction: function() {
				// console.log('create triggered');
				// $("#page-content").show();
				new FastClick(document.body);
				$("#page-content").fadeIn( 1000, function() {
					$('.ui-content').scrollTop(0);
					$.mobile.hidePageLoadingMsg();
					new FastClick(document.body);
				});
			},
			*/
			changePage: function(view, viewOptions) {
				// system.toggleLoading(true);
				// $.mobile.loadingMessage = 'Loading...Please wait';
				// $.mobile.showPageLoadingMsg();
				// $("#page-content").hide();
				// $("#body").hide();
				// $("#page-content").css({"position":"fixed", "top":"100px"});
				// $("#ui-page-active").css({"position":"fixed", "top":"200px"});
				modifyiOS7StatusBar();
				$('.pageOptions').hide();
				$('.showPageOptions').hide();
				var _this = this;
				// dpd.users.me(function(me) {
				// alert(window.system.uid);
				dpd('users').get(window.system.uid, function(me, err) {
					if (err) {
						// return(false);
					}
					else {
						window.me = me;
						if (window.me.active==true && window.me.fullname!="") {
							$('.showPageOptions').show();
							$('#showPageOptionsIcon').show();
						}
					}
					_this.myView = new view(viewOptions);
					new FastClick(document.body);
				});
				$('#pageFooter').html('');
				$('#body').css('overflow','hidden !mportant');
				

				
				// this.myView.$el.off('create', this.testFunction);
				// this.myView.$el.on('create', this.testFunction);
				// this.myView.$el.off('create', this.viewFadeIn, this.$el);
				// this.myView.$el.on('create', this.viewFadeIn, this.$el); // << hier noch ein .off hinzufügen, weil multiple ausführung!!! <<
				
				// this.myView.$el.on('initialized', this.viewFadeIn, this.$el); // << hier noch ein .off hinzufügen, weil multiple ausführung!!! <<
			}
        });
		
		// eventuell nützlich
		// http://stackoverflow.com/questions/11787384/backbone-js-and-jquery-mobile-accessing-router-function-from-view
		// und
		// http://stackoverflow.com/questions/11533247/uncaught-typeerror-when-trying-to-call-loading-with-jquery-mobile
		
		// this.$el.trigger('create');
		// $('#body').trigger('create');
		return MobileRouter;

    }

);