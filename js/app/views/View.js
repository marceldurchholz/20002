// View.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/HomeNestedPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, HomeNestedPage){

		var ViewVar = Backbone.View.extend({

            el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewHome = this;
				// this.$el.off('click','.createVideo').on('click','.createVideo',function(){_thisViewHome.createVideo();});
			},
			sync: function() {
			},
			initialize: function() {
				this.fetch();
			},
			fetch: function() {
				this.render();
			},
			render: function() {
				this.bindEvents();
				console.log('DOING render Videos.js called');
				_thisViewHome = this;
				var ani = setTimeout ( function() {
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewHome.nestedView = new SidemenuView().fetch();
					_thisViewHome.$el.html(_.template(HomeNestedPage, {}));
					// _thisViewHome.nestedView = new HomeNestedView().fetch();
					_thisViewHome.$el.trigger('create');
				}, 1000 );

				return this;
				
			}
			/*
            render: function() {
				// alert('rendering view.js');
				
				_thisViewHome = this;
				var ani = setTimeout ( function() {
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewHome.nestedView = new SidemenuView().fetch();					
				}, 500 );

					
				// this.sidebar = _.template(sidebar, {});
				// $('#sidebar').html(sidebar);
				
				// this._viewPage = _.template(viewPage, {});
				// this.$el.html(this._viewPage);
				
				this._viewPage = _.template(viewPage, {
					id: this.modelData.get('profileData').get('id'), 
					src: this.modelData.get('profileData').get('src'), 
					first_name: this.modelData.get('profileData').get('first_name'), 
					last_name: this.modelData.get('profileData').get('last_name'), 
					version: this.modelData.get('systemData').get('version'),
					platform: this.modelData.get('systemData').get('platform'),
					uuid: this.modelData.get('systemData').get('uuid'),
					name: this.modelData.get('systemData').get('name'),
					model: this.modelData.get('systemData').get('model'),
					device_internet: this.modelData.get('systemData').get('device_internet')
					}, {variable: 'modelData'}
				);
				this.$el.html(this._viewPage);
				// alert('create');
				this.$el.trigger('create');
				// console.log(this);
                return this;
            }
			*/

        });

        return ViewVar;

    }

);