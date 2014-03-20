// Sidemenus.js
// -------
define(["jquery", "backbone", "collections/sidemenusCollection", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, sidemenusCollection, sidemenusList, SidemenuView){
		
			var Sidemenus = Backbone.View.extend({
			
				el: "#sidebarListViewDiv",
				attributes: {"data-role": 'content'},
				initialize: function() {
					this._sidemenusCollection = new sidemenusCollection();
					this.fetch();
				},
				fetch: function() {
					// this._sidemenusCollection = new sidemenusCollection(); var _thisView = this; this._sidemenusCollection.fetch({ error: function(action, coll) { alert('ERROR: fetch _sidemenusCollection'); _thisView.render(); console.log(action); console.log(coll); }, success: function(coll, jsoncoll) { _thisView.render(); } });
					this._sidemenusCollection = new sidemenusCollection();
					var _thisView = this;
					this._sidemenusCollection.fetch({
						success: function(coll, jsoncoll) {
							_thisView.render();
						},
						error: function(action, coll) {
							console.log(action);
							console.log(coll);
							// _thisView.render();
						}
					});
				},
				render: function() {
					var _thisView = this;
					console.log('DOING render Sidemenus.js called');
					
					this._template = _.template(sidemenusList, {});
					$('#sidebarListViewDiv').html(this._template);
					// this.$el.html(this._template);
					
					// console.log('this._sidemenusCollection.models');
					// console.log(this._sidemenusCollection.models);
					this.nestedView = new SidemenuView({collection: this._sidemenusCollection.models}).render();

					// this.$el.trigger('create');
					return this;
				}

			});

        return Sidemenus;

    }

);