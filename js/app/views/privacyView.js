// privacyView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/privacyPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, privacyPage){
		
			var privacyViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					var _thisViewPrivacy = this;
				},
				initialize: function() {
					var _thisViewPrivacy = this;
					this.fetch();
				},
				fetch: function() {
					this.render();
				},
				render: function() {
					_thisViewPrivacy = this;
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewPrivacy.nestedView = new SidemenuView().fetch();
					_thisViewPrivacy.$el.html(_.template(privacyPage, {}));
					this.$el.trigger('create');
					hideModal();
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

        return privacyViewVar;

    }

);