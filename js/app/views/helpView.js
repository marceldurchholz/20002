// helpView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/helpPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, helpPage){
		
			var helpViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					var _thisViewHelp = this;
					// $('#showMenu').show();
					// $('#showPageOptions').show();
				},
				sendLogin: function(targetUrl) {
					_thisViewHelp = this;
				},
				sync: function() {
				},
				fetch: function() {
					this.render();
				},
				initialize: function() {
					var _thisViewHelp = this;
					this.fetch();
				},
				render: function() {
					// console.log('DOING render Videos.js called');
					_thisViewHelp = this;
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewHelp.nestedView = new SidemenuView().fetch();
					_thisViewHelp.$el.html(_.template(helpPage, {}));
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

        return helpViewVar;

    }

);