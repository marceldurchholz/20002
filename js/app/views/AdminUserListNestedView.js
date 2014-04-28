// AdminUserListItemView.js
// -------
define(["jquery", "backbone", "text!templates/AdminUserListItemPage.html"],

    function($, Backbone, AdminUserListItemPage){
		
		var AdminUserListItemViewVar = Backbone.View.extend({
			
			el: "#AdminUserListViewNestedDiv",
			initialize: function() {
				_thisViewAdminUser = this;
				showModal();
				var streamData = new Array();
				_thisViewAdminUser.streamData = streamData;
			},
			fetch: function() {	
				_thisViewAdminUser = this;
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					_thisViewAdminUser.me = me;
				});

				var requestUrl = "http://dominik-lohmann.de:5000/users?deleted=false"; // active=true&
				if (window.system.me.master!=true) requestUrl = requestUrl + "&sponsor="+_thisViewAdminUser.me.id;
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(result) {
					_.each(result, function(value, index, list) {
						_thisViewAdminUser.streamData.push(value);
					});
				});
				_thisViewAdminUser.streamData.sort(function(a, b){
					var nameA=a.fullname.toLowerCase(), nameB=b.fullname.toLowerCase()
					if (nameA < nameB) return -1 
					if (nameA > nameB) return 1
					return 0 
				});
				_thisViewAdminUser.render();
			},
			bindEvents: function() {
				var _thisViewAdminUser = this;
				this.$el.off('click','.showAdminUserDetailsLink').on('click','.showAdminUserDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
			},
			render: function() {
				this.bindEvents();
				var _thisViewAdminUser = this;
				var htmlContent = _.template(AdminUserListItemPage, {
					data: _thisViewAdminUser.streamData
				},{variable: 'users'});
				$(_thisViewAdminUser.el).html(htmlContent);
				$("#AdminUserListView").listview({
				  autodividers: true,
				  autodividersSelector: function ( li ) {
					var rowTopic = li.data( "topic" );
					var out = rowTopic;
					return out;
				  }
				});
				hideModal();
				_thisViewAdminUser.$el.trigger('create');
				new FastClick(document.body);
				return _thisViewAdminUser;				
			}
		});

        return AdminUserListItemViewVar;

    }

);