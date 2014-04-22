// AdminUserListItemView.js
// -------
define(["jquery", "backbone", "collections/AdminUserCollection", "text!templates/AdminUserListItemPage.html"],

    function($, Backbone, AdminUserCollection, AdminUserListItemPage){
		
		var AdminUserListItemViewVar = Backbone.View.extend({
			
			el: "#AdminUserListViewNestedDiv",
			initialize: function() {
				_thisViewAdminUser = this;
				console.log('initializing AdminUserListItemView.js');
				showModal();
				var streamData = new Array();
				_thisViewAdminUser.streamData = streamData;
			},
			fetch: function() {	
				_thisViewAdminUser = this;
				console.log('fetching AdminUserListItemView.js');
				// this.$el.hide();
				
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					_thisViewAdminUser.me = me;
				});

				var requestUrl = "http://dominik-lohmann.de:5000/users?active=true&deleted=false";
				if (window.system.master!=true) requestUrl = requestUrl + "&sponsor="+_thisViewAdminUser.me.id;
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(result) {
					_.each(result, function(value, index, list) {
						_thisViewAdminUser.streamData.push(value);
					});
				});
				
				// Sort multidimensional arrays with oobjects by value 
				// http://www.javascriptkit.com/javatutors/arraysort2.shtml
				_thisViewAdminUser.streamData.sort(function(a, b){
					var nameA=a.fullname.toLowerCase(), nameB=b.fullname.toLowerCase()
					if (nameA < nameB) //sort string ascending
						return -1 
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
				});
				
				// console.log(_thisViewAdminUser.streamData);
				// return(false);
				_thisViewAdminUser.render();
				
				/*
				this._AdminUserCollection = new AdminUserCollection([],{sponsor:window.me.id});
				this._AdminUserCollection.fetch({
					success: function(coll, jsoncoll) {
						console.log(_thisViewAdminUser);
						// _thisViewAdminUser.render();
						if (window.me) {
							_thisViewAdminUser.render();
						}
						else {
							console.log('You are not logged in!');
							window.location.href = "#noaccess";
						}
					},
					error: function(action, coll) {
						console.log('ERROR fetching _AdminUserCollection');
						console.log(action);
						console.log(coll);
						// _thisViewAdminUser.render();
					}
				});
				*/
			},
			bindEvents: function() {
				var _thisViewAdminUser = this;
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewAdminUser.clicked(e);});
				this.$el.off('click','.showAdminUserDetailsLink').on('click','.showAdminUserDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
			},
			/*
			insertData: function(model) {
				_thisViewAdminUser = this;
				var sponsor = model.get('sponsor');
				console.log(model);
				var rowContent = _.template(AdminUserListItemPage, {
					id: model.get('id'),
					// sponsor: _thisViewAdminUser.sponsordata.fullname,
					username: model.get('username'),
					fullname: model.get('fullname'),
					slogan: model.get('slogan'),
					perstext: model.get('perstext'),
					pictureurl: model.get('pictureurl'),
					lastModified: model.get('lastModified'),
					registered: model.get('registered'),
					show: model.get('show'),
					credits: model.get('credits'),
					active: model.get('active')
				},{variable: 'user'});
				return(rowContent);
			},
			*/
			render: function() {
				this.bindEvents();
				var _thisViewAdminUser = this;
				console.log('DOING render AdminUserListItemView.js called');
				
				var htmlContent = _.template(AdminUserListItemPage, {
					/*
					id: model.get('id'),
					// sponsor: _thisViewAdminUser.sponsordata.fullname,
					username: model.get('username'),
					fullname: model.get('fullname'),
					slogan: model.get('slogan'),
					perstext: model.get('perstext'),
					pictureurl: model.get('pictureurl'),
					lastModified: model.get('lastModified'),
					registered: model.get('registered'),
					show: model.get('show'),
					credits: model.get('credits'),
					active: model.get('active')
					*/
					data: _thisViewAdminUser.streamData
				},{variable: 'users'});
				$(_thisViewAdminUser.el).html(htmlContent);

				/*
				console.log(window.me);
				// return(false);
				
				_thisViewAdminUser.htmlContent = '';
				_thisViewAdminUser.rowContent = '';
				$(this.el).html(_thisViewAdminUser.htmlContent);
				_.each(this._AdminUserCollection.models, function(model) {
					this.id = model.get('id');
					_thisViewAdminUser.rowContent = _thisViewAdminUser.rowContent + _thisViewAdminUser.insertData(model);
				});
				_thisViewAdminUser.htmlContent = '<ul data-filter="true" data-filter-placeholder="Suchfilter..." data-role="listview" data-theme="a" data-divider-theme="a" data-filter-theme="a" data-autodividers="true" id="AdminUserListView">'+_thisViewAdminUser.rowContent+'</ul>';
				$(this.el).html(_thisViewAdminUser.htmlContent);
				*/
				$("#AdminUserListView").listview({
				  autodividers: true,
				  autodividersSelector: function ( li ) {
					var rowTopic = li.data( "topic" );
					var out = rowTopic;
					return out;
				  }
				});
				
				/*
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				*/
				hideModal();
				_thisViewAdminUser.$el.trigger('create');
				// _thisViewLearningStream.$el.trigger('create');
				new FastClick(document.body);

				return _thisViewAdminUser;				
			}
		});

        return AdminUserListItemViewVar;

    }

);