// System.js
// --------
define(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll"],
	function($, Backbone, MobileRouter) {
		var System = Backbone.Model.extend( {
			defaults: {
				version: '',
				platform: '',
				uuid: '',
				name: '',
				model: '',
				device_internet: ''
			},
			initialize: function() {
				if(isMobile.any()) {
					this.set({version: device.version});
					this.set({platform: device.platform});
					this.set({uuid: device.uuid});
					this.set({name: device.name});
					this.set({model: device.model});
					this.set({device_internet: isConnectedToInternet()});
					// this.set({version: 'bla'});
				}
			}
		} );
        return System;
    }
);
