// VideoAddToFavourites.js
// -------
define(["jquery", "backbone"],

    function($, Backbone){
		
		var VideoAddToFavouritesVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewVideoAddToFavourites = this;
			},
			initialize: function() {
				this.fetch();
			},
			sync: function() {
			},
			fetch: function() {
				this.render();
			},
			render: function() {
				this.bindEvents();
				_thisViewVideoAddToFavourites = this;
				console.log(this.options.id);
				// alert('bla foo');
				alert(this.options.id);
				/*
				console.log('DOING render Videos.js called');
				var ani = setTimeout ( function() {
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewVideoAddToFavourites.nestedView = new SidemenuView().fetch();
					_thisViewVideoAddToFavourites.$el.html(_.template(videosList, {}));
					_thisViewVideoAddToFavourites.nestedView = new VideoView().fetch();
					_thisViewVideoAddToFavourites.$el.trigger('create');
				}, 0 );
				*/
				return this;	
			}
		});

        return VideoAddToFavouritesVar;

    }

);