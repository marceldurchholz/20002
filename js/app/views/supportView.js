// supportView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/supportPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, supportPage){
		
			var supportViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					var _thisViewSupport = this;
					// $('#showMenu').show();
					// $('#showPageOptions').show();
				},
				sendLogin: function(targetUrl) {
					_thisViewSupport = this;
				},
				sync: function() {
				},
				fetch: function() {
					this.render();
				},
				initialize: function() {
					var _thisViewSupport = this;
					this.fetch();
				},
				render: function() {
					console.log('DOING render Videos.js called');
					_thisViewSupport = this;
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewSupport.nestedView = new SidemenuView().fetch();
					_thisViewSupport.$el.html(_.template(supportPage, {}));
					hideModal();
					this.$el.trigger('create');
					new FastClick(document.body);
					this.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
					});
					this.bindEvents();
					return this;
				}

			});

        return supportViewVar;

    }

);