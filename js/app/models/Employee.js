// Employee.js
// --------
define(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll"],
	function($, Backbone, MobileRouter) {
		var Employee = Backbone.Model.extend( {
			/*
			urlRoot:"http://mobile002.appinaut.de/api/employees/",
			initialize:function () {
				this.reports = new EmployeeCollection();
				this.reports.url = 'http://mobile002.appinaut.de/api/employees/' + this.id + '/reports';
			}
			*/
			defaults: {
				name: "No Slot", 
				butter: false, 
				time: "3pm",
				icon: "plus",
				deladd: "ADD"
			},
			initialize: function() {
				this.bind("change:butter", function(){
					if (this.model.butter == false) {
						this.set({name: this.defaults.name});
					};
				});
			}
			
		} );
        return Employee;
    }
);
