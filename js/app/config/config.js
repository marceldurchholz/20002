// Require.js Configurations
// -------------------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js/app",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "../libs/jquery",

      "jqueryui": "../libs/jqueryui",

      "jquerymobile": "../libs/jquery.mobile",
	  
      // "jquerypulltorefresh": "../libs/jquery.plugin.pullToRefresh",

      // "backbone.LocalStorage": "../libs/backbone.localStorage",

      "backbone.LocalStorage": "../libs/backbone.localStorage",
	  
      "underscore": "../libs/lodash",

      "functions": "../functions",
	  
      "jexpander": "../jquery.expander.min",
	  
      "jelastic": "../jquery.elastic.source",

      "jtablesorter": "../libs/jquery.tablesorter",

      "videojs": "../video-js/video",

      "backbone": "../libs/backbone",
	  
	  "bindmobile": "../jqm-config",

	  // "deployd": "../dpd",
	  "deployd": "http://dominik-lohmann.de:5000/dpd",

      // Plugins
      // -------
      "backbone.validateAll": "../libs/plugins/Backbone.validateAll",

      "bootstrap": "../libs/plugins/bootstrap",

      "text": "../libs/plugins/text"
	  
	  /* ,"jasminejquery": "../libs/plugins/jasmine-jquery" */

  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {

      // jQuery pull to refresh
      // "jquerypulltorefresh": ["jquery"],

      // jQuery Mobile
      "jquerymobile": ["bindmobile", "jquery", "deployd"],
	  
      // Twitter Bootstrap jQuery plugins
      "bootstrap": ["jquery"],

      // jQueryUI
      "jqueryui": ["jquery"],
	  
	  "jexpander": ["jquery"],

	  "jelastic": ["jquery"],
	  
	  "jtablesorter": ["jquery"],
	  
	  "functions": ["jquery", "videojs"],
	  
      // jQueryUI
      "videojs": {
		"deps": ["jquery"],
		"exports": "videojs"
	  },

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery // "jquerypulltorefresh", 
        "deps": ["functions", "underscore", "jquery", "jquerymobile", "jexpander", "jelastic", "jtablesorter"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"],

      // local storage
	  // "backbone.LocalStorage": ["backbone"],
	  
      // local storage
	  // "backbone.LocalStorage": ["backbone"],
	  "backbone.LocalStorage": {
		"deps": ["backbone"],
		"exports": "backbone.LocalStorage"
	  }
	  
      // Jasmine-jQuery plugin
      // , "jasminejquery": ["jquery"]

  }

});