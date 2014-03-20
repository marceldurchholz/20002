// agbView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/agbPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, agbPage){
		
			var agbViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					var _thisViewAgb = this;
					// $('#showMenu').show();
					// $('#showPageOptions').show();
				},
				sendLogin: function(targetUrl) {
					_thisViewAgb = this;
				},
				sync: function() {
				},
				fetch: function() {
					this.render();
				},
				initialize: function() {
					var _thisViewAgb = this;
					this.fetch();
				},
				render: function() {
					console.log('DOING render Videos.js called');
					_thisViewAgb = this;
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewAgb.nestedView = new SidemenuView().fetch();
					_thisViewAgb.$el.html(_.template(agbPage, {}));
					hideModal();
					this.$el.trigger('create');
					fontResize();
					new FastClick(document.body);
					this.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
					});
					this.bindEvents();
					return this;
				}

			});

        return agbViewVar;

    }

);