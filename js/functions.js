try {

	var rootURL = "";
	var root = this; // used by pdfbrowser and childbrowser
	var deviceSDID;
	var cordovaIsLoaded = false;
	var deviceSDID = "???";
	var SDID_DOMAIN = 'phonegap.appinaut.de';  
	var SDID_KEY = '633241';

	var my_media;
	var platformId = null;
	var CameraPopoverOptions = null;
	var pictureUrl = null;
	var fileObj = null;
	var fileEntry = null;
	var pageStartTime = +new Date();

	//default camera options
	var camQualityDefault = ['quality value', 50];
	var camDestinationTypeDefault = ['FILE_URI', 1];
	var camPictureSourceTypeDefault = ['CAMERA', 1];
	var camAllowEditDefault = ['allowEdit', false];
	var camEncodingTypeDefault = ['JPEG', 0];
	var camMediaTypeDefault = ['mediaType', 0];
	var camCorrectOrientationDefault = ['correctOrientation', false];
	var camSaveToPhotoAlbumDefault = ['saveToPhotoAlbum', true];

	// var badgeToggledOn = false;
	// var autoLockIsDisabled = false;
	// var cdvBadge = null;
	var me = new Object();
	
	var isMobile = {};	
	isMobile = {
		Android: function() {
			// return navigator.userAgent.match(/Android/i) ? true : false;
			return navigator.userAgent.match(/Android/i) ? false : false;
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
			// return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? false : false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true : false;
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
		}
	};

	$('#body').css("display","block");
	var currentHash = window.location.hash;
	var imagePath = '';
	var menuStatus = false;
	var footervideoStatus = false;
	function renderList(employees) {
		alert('Rendering list using local SQLite data...');
		dao.findAll(function(employees) {
			$('#list').empty();
			var l = employees.length;
			for (var i = 0; i < l; i++) {
				var employee = employees[i];
				$('#list').append('<tr>' +
					'<td>' + employee.id + '</td>' +
					'<td>' +employee.firstName + '</td>' +
					'<td>' + employee.lastName + '</td>' +
					'<td>' + employee.title + '</td>' +
					'<td>' + employee.officePhone + '</td>' +
					'<td>' + employee.deleted + '</td>' +
					'<td>' + employee.lastModified + '</td></tr>');
			}
		});
	}
	var myLocalStorageAdapter = {
		testOutput: function() {
			return('testoutputtext');
		},
		initialize: function() {
			console.log('now inner window.LocalStorageAdapter: initialize');
			var deferred = $.Deferred();
			// Store sample data in Local Storage
			/*
			window.localStorage.setItem("employees", JSON.stringify(
				[
					{"id": 1, "fullname": "offline James King", "device": 0, "credits": "100", "pictureurl": ""},
					{"id": 2, "fullname": "offline Julie Taylor", "device": 1, "credits": "355", "pictureurl": ""}
				]
			));
			*/
			deferred.resolve();
			return deferred.promise();
		},
		
		// Save the current state of the **Store** to *localStorage*.
		save: function() {
			window.localStorage.setItem("employees", this.records.join(","));
		},
		create: function(model) {
			console.log('create: function(model) {');
			if (!model.id) {
			  model.id = guid();
			  model.set(model.idAttribute, model.id);
			  alert('model.id inserted');
			}
			// return(model);
			console.log("employees"+"-"+model.id);
			window.localStorage.setItem("employees"+"-"+model.id, JSON.stringify(model));
			// console.log(window.localStorage.getItem("employees"+"-"+model.id, JSON.stringify(model));
			this.push(model.id.toString());
			this.save;
			return this.findById(model.id);
		},
		
		findAll: function () {
			var employees = JSON.parse(window.localStorage.getItem("employees"));
			// var employees = window.localStorage.getItem("employees");
			// console.log(employees);
			return employees;
		},

		findById: function (id) {
			console.log('findById: function (id) {');
			console.log(id);
			var deferred = $.Deferred(),
				employees = JSON.parse(window.localStorage.getItem("employees")),
				employee = null;
				l = employees.length;

			for (var i = 0; i < l; i++) {
				if (employees[i].id === id) {
					employee = employees[i];
					break;
				}
			}
			console.log('employee');
			console.log(employee);
			deferred.resolve(employee);
			return deferred.promise();
		},

		findByName: function (searchKey) {
			var deferred = $.Deferred(),
				employees = JSON.parse(window.localStorage.getItem("employees")),
				results = employees.filter(function (element) {
					var fullName = element.firstName + " " + element.lastName;
					return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
				});
			deferred.resolve(results);
			return deferred.promise();
		}

	}

	var websqlReady = $.Deferred();
	var sampleDataReady = $.Deferred();

	var dao = {

		// syncURL: "../api/employees",
		// syncURL: "http://coenraets.org/offline-sync/api/employees?modifiedSince=2010-03-01%2010:20:56",
		// syncURL: "http://mobile002.appinaut.de/api/employees/",

		test: function(bla) {
			alert(bla);
		},
		initialize: function() {
			// alert('window.dao initialize');
			// alert('bbb');
			var self = this;
			// renderList();
			if (isPhoneGap()) {
				this.db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);
				/*
				this.db.transaction(
					function(tx) {
						// tx.executeSql('DROP TABLE IF EXISTS videos');
						tx.executeSql('DROP TABLE IF EXISTS users');
					},
					this.txErrorHandler,
					function() {
						// alert('Tables successfully DROPPED in local SQLite database');
						// callback();
					}
				);
				
				// Testing if the table exists is not needed and is here for logging purpose only. We can invoke createTable
				// no matter what. The 'IF NOT EXISTS' clause will make sure the CREATE statement is issued only if the table
				// does not already exist.
				*/
				this.db.transaction (
					function(tx) {
						tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='videos'", this.txErrorHandler,
							function(tx, results) {
								if (results.rows.length != 1) self.createTables();
							}
						);
						// self.sync(renderList);
					}
				)
			}
			// else websqlReady.resolve("initialize done");
		},
			
		findVideoById: function(id) {
			var deferred = $.Deferred();
			if (isPhoneGap()) {
				this.db.transaction(
					function (tx) {
						var sql = "SELECT v.videoid, v.videourl FROM videos v WHERE v.videoid=:id";
						tx.executeSql(sql, [id], function (tx, results) {
							deferred.resolve(results.rows.length === 1 ? results.rows.item(0) : null);
						});
					},
					function (error) {
						deferred.reject("Transaction Error: " + error.message);
					}
				);
			}
			else {
				deferred.resolve();
			}
			return deferred.promise();
		},
		
		createTables: function() {
			this.db.transaction(
				function(tx) { 
					tx.executeSql("CREATE TABLE IF NOT EXISTS videos ( " + "id INTEGER PRIMARY KEY AUTOINCREMENT, " + "videoid VARCHAR(255), " + "videourl VARCHAR(255))");
				},
				function(error) { 
					// alert('ERROR ON Tables CREATE local SQLite database'); 
					// alert(error);
				},
				function() { 
					window.system.showtutorial = true;
					// alert('SUCCESS Tables CREATE local SQLite database'); 
					// websqlReady.resolve("initialize done"); 
				}
			);
			this.db.transaction(
				function(tx) { 
					tx.executeSql("CREATE TABLE IF NOT EXISTS metbl ( " + "id INTEGER PRIMARY KEY, " + "username VARCHAR(255), " + "password VARCHAR(255), " + "autologin VARCHAR(255))");
				},
				function(error) { 
					alert('ERROR ON Tables CREATE local SQLite database'); 
					alert(error);
				},
				function() { 
					window.system.showtutorial = true;
					// alert('SUCCESS Tables CREATE local SQLite database'); 
					// websqlReady.resolve("initialize done"); 
				}
			);
		},
		rememberUserDataDeleteAutologin: function(callback) {
			// alert('rememberUserDataDeleteAutologin');
			// alert(window.system.kdnr);
			var _thisFunction = this;
			if (isPhoneGap()) {
				this.db.transaction(
					function (tx) {
						var id = window.system.kdnr;
						// var sql = "DELETE FROM metbl WHERE id=:id";
						var sql = "UPDATE metbl SET autologin = '0' WHERE id=:id";
						tx.executeSql(sql, [id], function (tx, results) {
							callback();
						});
					},
					function (error) {
						alert('error');
						alert(error.message);
						// deferred.reject("Transaction Error: " + error.message);
						callback();
					}
				);
			}
			else {
				callback();
			}
		},
		rememberUserDataDelete: function(callback) {
			// callback();
			// alert('rememberUserDataDelete: '+window.system.kdnr);
			if (isPhoneGap()) {
				this.db.transaction(
					function (tx) {
						var id = window.system.kdnr;
						// alert(id);
						// var sql = "DELETE FROM metbl WHERE id=:id";
						var sql = "DELETE FROM metbl WHERE id=:id";
						// var sql = "UPDATE metbl SET autologin = '0' WHERE id=:id";
						// alert(sql);
						tx.executeSql(sql, [id], function (tx, results) {
							callback();
						});
					},
					function (error) {
						// alert('error');
						// alert(error.message);
						// deferred.reject("Transaction Error: " + error.message);
						callback();
					}
				);
			}
			else {
				// alert(callback)
				callback();
			}
		},
		rememberUserDataGet: function(callback) {
			// var deferred = $.Deferred();
			var userdata = new Object();
			userdata.username = "";
			userdata.password = "";
			if (isPhoneGap()) {
				this.db.transaction(
					function (tx) {
						var id = window.system.kdnr;
						// alert(id);
						var sql = "SELECT m.username, m.password, m.autologin FROM metbl m WHERE m.id=:id";
						// alert(sql);
						tx.executeSql(sql, [id], function (tx, results) {
							// alert('found');
							// alert(results.username);
							// alert(results[0].username);
							// alert('length '+results.rows.length);
							// alert('results.row... '+results.rows.item(0).username);
							// deferred.resolve(results.rows.length === 1 ? results.rows.item(0) : null);
							// alert(results.rows.item(0).username);
							// alert(results.rows.item(0).password);
							// alert(results.rows.item(0).autologin);
							callback(results.rows.item(0));
						});
					},
					function (error) {
						// alert('error');
						// alert(error.message);
						// deferred.reject("Transaction Error: " + error.message);
						callback(userdata);
					}
				);
			}
			else {
				callback(userdata);
			}
			// return deferred.promise();
			// callback();
		},
		rememberUserData: function(username, password, autologin) {
			if (isPhoneGap()) {
				this.db.transaction(
					function(tx) {
						// alert('filling table INSERT START');
						var sql3 = "INSERT OR REPLACE INTO metbl (id, username, password, autologin) VALUES ("+window.system.kdnr+", '"+username+"', '"+password+"', '"+autologin+"')";
						// alert(sql3);
						tx.executeSql(sql3);
						// alert('filling table INSERT END');
					},
					function() {
						// alert('ERROR ON Table metbl FILLING WITH SAMPLES in local SQLite database');
					},
					function() {
						// alert('Table metbl successfully FILLED WITH SAMPLES in local SQLite database');
						// callback();
					}
				);
			}
			// if (!isPhoneGap()) websqlReady.resolve("initialize done");
		},
		/*
		fillTable: function() {
			// alert('filling table');
			if (isPhoneGap()) {
				this.db.transaction(
					function(tx) {
						// sample data 
						alert('filling table INSERT START');
						tx.executeSql("INSERT INTO videos (id, fullname,pictureurl,device,credits,deleted,lastModified) VALUES (2, 'Gary Donovan','','555','100',1,'2013-11-09 22:14:19')");
						tx.executeSql("INSERT INTO videos (id, fullname,pictureurl,device,credits,deleted,lastModified) VALUES (1, 'Lisa Wong','','999','20',0,'2013-11-09 22:14:19')");
						alert('filling table INSERT END');
					},
					function() {
						// alert('ERROR ON Table videos successfully FILLED WITH SAMPLES in local SQLite database');
					},
					function() {
						// alert('Table videos successfully FILLED WITH SAMPLES in local SQLite database');
						// callback();
					}
				);
			}
			if (!isPhoneGap()) websqlReady.resolve("initialize done");
		},
		
		xxxy_sync: function() {
			var self = this;
			alert('Starting synchronization...');
			
		},
		
		xyz_getChanges: function(syncURL, modifiedSince, callback) {
			alert('getChanges');
			$.ajax({
				url: syncURL,
				data: {modifiedSince: modifiedSince},
				dataType:"json",
				success:function (data) {
					console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
					callback(data);
				},
				error: function(model, response) {
					console.log(response.responseText);
				}
			});

		},

		bbb_sync: function(callback) {
			var self = this;
			alert('Starting synchronization...');
			this.getLastSync(function(lastSync){
				alert('lastSync' + lastSync);
				alert('this.getLastSync(function(lastSync)');
				self.getChanges(self.syncURL, lastSync,
					function (changes) {
						if (changes.length > 0) {
							self.applyChanges(changes, callback);
							alert('Something to synchronize');
						} else {
							alert('Nothing to synchronize');
							callback();
						}
					}
				);
			});

		},
		bbb_getChanges: function(syncURL, modifiedSince, callback) {
			alert('getChanges');
			$.ajax({
				url: syncURL,
				data: {modifiedSince: modifiedSince},
				dataType:"json",
				success:function (data) {
					console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
					callback(data);
				},
				error: function(model, response) {
					console.log(response.responseText);
				}
			});

		},

		fillTable: function(callback) {
			this.db.transaction(
				function(tx) {
					// sample data 
					// tx.executeSql("INSERT INTO employee (id,firstName,lastName,title,officePhone,deleted,lastmodified) VALUES (5,'Steven','Wells','Software Architect','617-000-0012','false','2013-11-09 22:14:19')");
					// tx.executeSql("INSERT INTO employee (id,firstName,lastName,title,officePhone,deleted,lastmodified) VALUES (4,'Amy','Jones','Sales Representative','617-000-0011','false','2013-11-09 22:14:19')");
					// tx.executeSql("INSERT INTO employee (id,firstName,lastName,title,officePhone,deleted,lastmodified) VALUES (3,'Kathleen','Byrne','Sales Representative','617-000-0010','false','2013-11-09 22:14:19')");
					tx.executeSql("INSERT INTO employee (id,firstName,lastName,title,officePhone,deleted,lastmodified) VALUES (2,'Gary','Donovan','Marketing','617-000-0009','1','2013-11-09 22:14:19')");
					tx.executeSql("INSERT INTO employee (id,firstName,lastName,title,officePhone,deleted,lastmodified) VALUES (1,'Lisa','Wong','Marketing Manager','617-000-0008','0','2013-11-09 22:14:19')");
				},
				this.txErrorHandler,
				function() {
					console.log('Table employee successfully FILLED in local SQLite database');
					callback();
				}
			);
		},

		dropTable: function(callback) {
			this.db.transaction(
				function(tx) {
					tx.executeSql('DROP TABLE IF EXISTS employee');
				},
				this.txErrorHandler,
				function() {
					console.log('Table employee successfully DROPPED in local SQLite database');
					callback();
				}
			);
		},

		bbb_getLastSync: function(callback) {
			alert('getLastSync');
			this.db.transaction(
				function(tx) {
					var sql = "SELECT MAX(lastModified) as lastSync FROM employee";
					tx.executeSql(sql, this.txErrorHandler,
						function(tx, results) {
							var lastSync = results.rows.item(0).lastSync;
							console.log('Last local timestamp is ' + lastSync);
							callback(lastSync);
						}
					);
				}
			);
		},

		bbb_applyChanges: function(employees, callback) {
			alert('applyChanges');
			this.db.transaction(
				function(tx) {
					var l = employees.length;
					var sql =
						"INSERT OR REPLACE INTO employee (id, firstName, lastName, title, officePhone, deleted, lastModified) " +
						"VALUES (?, ?, ?, ?, ?, ?, ?)";
					console.log('Inserting or Updating in local database:');
					var e;
					for (var i = 0; i < l; i++) {
						e = employees[i];
						console.log(e.id + ' ' + e.firstName + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
						var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
						tx.executeSql(sql, params);
					}
					console.log('Synchronization complete (' + l + ' items synchronized)');
				},
				this.txErrorHandler,
				function(tx) {
					callback();
				}
			);
		},
		
		bbb_findAll: function(callback) {
			alert('findAll');
			this.db.transaction(
				function(tx) {
					var sql = "SELECT * FROM employee";
					alert('Local SQLite database: "SELECT * FROM employee"');
					tx.executeSql(sql, this.txErrorHandler,
						function(tx, results) {
							alert('getting len');
							var len = results.rows.length,
								employees = [],
								i = 0;
							// for (; i < len; i = i + 1) {
							for (i=0; i < len; i = i + 1) {
								employees[i] = results.rows.item(i);
							}
							alert(len + ' rows found');
							// alert(employees);
							// alert(employees.toJSON);
							
							// for (var i = 0; i < l; i++) {
							// e = employees[i];

							callback(employees);
						}
					);
				}
			);
		},
		*/

		txErrorHandler: function(tx) {
			alert(tx.message);
		}
	};

	function updateCoins(productId) {
		// showModal();
		$.ajax('http://dominik-lohmann.de:5000/users/?id='+window.me.id,{
			type:"GET",
			async: false,
		}).done(function(me) {
			var newcredits = "0";
			var addcredits = "0";
			switch (productId) {
			  case "com.digitalverve.APPinaut.250APP359T4":
				addcredits = "250";
				// alert("Sie sind sehr bescheiden");
				break;
			  case "com.digitalverve.APPinaut.750APP799T9":
				addcredits = "750";
				// alert("Sie sind ein aufrichtiger Zweibeiner");
				break;
			  case "com.digitalverve.APPinaut.2500APP2499T28":
				addcredits = "2500";
				// alert("Sie haben ein Dreirad gewonnen");
				break;
			  case "com.digitalverve.APPinaut.6500APP4999T51":
				addcredits = "6500";
				// alert("Gehen Sie auf allen Vieren und werden Sie bescheidener");
				break;
			  case "com.digitalverve.APPinaut.16000APP9999T60":
				addcredits = "16000";
				// alert("Gehen Sie auf allen Vieren und werden Sie bescheidener");
				break;
			  case "com.digitalverve.APPinaut.25000APP17999T72":
				addcredits = "25000";
				// alert("Gehen Sie auf allen Vieren und werden Sie bescheidener");
				break;
			  case "com.digitalverve.APPinaut.UPGPROVAPP269T3":
				addcredits = "0";
				// alert("Gehen Sie auf allen Vieren und werden Sie bescheidener");
				break;
			  case "com.digitalverve.APPinaut.UPGPROVAPP1999T22":
				addcredits = "0";
				// alert("Gehen Sie auf allen Vieren und werden Sie bescheidener");
				break;
			  default:
				// doAlert("Der In-App Kauf konnte leiner nicht zugeordnet werden. Bitte wenden Sie sich an den Support.","Unbekannter Fehler");
				break;
			}
			if (parseInt(addcredits,0)>0) {
				newcredits = parseInt(me.credits,0) + parseInt(addcredits,0);
				// alert(addcredits);
				// console.log(newcredits);
				// alert(newcredits);
				dpd.users.put(me.id, {"credits":""+newcredits}, function(result, err) {
					if(err) {
						return console.log(err);
						hideModal();
					}
					console.log(result, result.id);
					hideModal();
					doAlert('Vielen Dank. Sie haben nun ' + newcredits + ' APPinaut Coins.','Kauf erfolgreich');
					// window.location.reload();
					window._thisViewMyProfileNested.initialize();
				});
				_me = me;
			}
			else {
				var newroles = ["user","provider","seeker"];
				// if (productId=="com.digitalverve.APPinaut.UPGPROVAPP269T3") {
				// }
				// else if {
				dpd.users.put(me.id, {roles: newroles}, function(result, err) { 
					if(err) {
						return console.log(err);
						hideModal();
					}
					console.log(result, result.id);
					window._thisViewMyProfileNested.initialize();
					hideModal();
					doAlert('Sie sind nun APPinaut Anbieter und können allen Wissensdurstigen Ihr Material zur Verfügung stellen. Viel Erfolg!','Upgrade erfolgreich');
					// window.location.reload();
				});
				_me = me;
			}
		}).fail(function() {
			hideModal();
			doAlert( "Es ist leider ein Fehler passiert, der nicht passieren sollte.", "Entschuldigung..." );
		})
		.always(function() {
			// doAlert('You just purchased: ' + productId);
		});
	}

	function initStore() {
		window.storekit.init({
			debug: true, /* Because we like to see logs on the console */
			noAutoFinish: true,
			purchase: function (transactionId, productId) {
				// showModal();
				// alert('start purchasing');
				storekit.finish(transactionId);
				storekit.loadReceipts(function (receipts) {
					// console.log('Receipt for appStore = ' + receipts.appStoreReceipt);
					// console.log('Receipt for ' + productId + ' = ' + receipts.forProduct(productId));
				});
				// console.log('purchased: ' + productId);
				updateCoins(productId);
			},
			finish: function (transactionId, productId) {
				// alert('Finished transaction for ' + productId + ' : ' + transactionId);
				// alert('Finished transaction for ' + productId + ' : ' + transactionId);
			},
			restore: function (transactionId, productId) {
				// console.log('restored: ' + productId);
				// alert('restored: ' + productId);
			},
			restoreCompleted: function () {
			   // console.log('all restore complete');
			   // alert('all restore complete');
			},
			restoreFailed: function (errCode) {
				// console.log('restore failed: ' + errCode);
				// alert('restore failed: ' + errCode);
			},
			error: function (errno, errtext) {
				// alert('Failed: ' + errtext);
				hideModal();
				// alert('Failed: ' + errtext);
			},
			ready: function () {
				var productIds = [
					"com.digitalverve.APPinaut.2500APP2499T28", 
					"com.digitalverve.APPinaut.250APP359T4", 
					"com.digitalverve.APPinaut.750APP799T9", 
					"com.digitalverve.APPinaut.6500APP4999T51", 
					"com.digitalverve.APPinaut.16000APP9999T60",
					"com.digitalverve.APPinaut.25000APP17999T72"
				];
				window.storekit.load(productIds, function(validProducts, invalidProductIds) {
					$.each(validProducts, function (i, val) {
						console.log("id: " + val.id + " title: " + val.title + " val: " + val.description + " price: " + val.price);
					});
					if(invalidProductIds.length) {
						console.log("Invalid Product IDs: " + JSON.stringify(invalidProductIds));
					}
				});			
				// Also check the receipts
				storekit.loadReceipts(function (receipts) {
					console.log('appStoreReceipt:' + receipts.appStoreReceipt);
				});
			}
		});
	}

	function isPhoneGap() {
		// return (cordova || PhoneGap || phonegap) && /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
		// return /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
		return /^file:\/{3}[^\/]/i.test(window.location.href) && /iphone|ipod|ipad/i.test(navigator.userAgent);
	}

	function checkFileExists(fileName){
		var http = new XMLHttpRequest();
		http.open('HEAD', fileName, false);
		http.send(null);
		return (http.status != 404);
	}

	function printObject(o) {
	  var out = '';
	  for (var p in o) {
		out += p + ': ' + o[p] + '\n';
	  }
	  alert(out);
	}


	function isConnectedToInternet(){
		var connectionType = getConnectionType();
		return (
				(connectionType.toUpperCase().indexOf("NO NETWORK",0) == -1) &&
				(connectionType.toUpperCase().indexOf("UNKNOWN",0) == -1)
				);
	}

	function getConnectionType() {
		if(cordovaIsLoaded != true){
			// simulate offline with querystring ?OFFLINE=1
			if(getURLParameter("OFFLINE") != ""){
				return "No network connection";	
			}else{
				return "wifi";	
			}		
		} 
		var networkState = navigator.connection.type;//navigator.network.connection.type;
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.NONE]     = 'No network connection';
		// alert('Connection type: ' + states[networkState]);
		return states[networkState];
	}

	/* ----------------------------------------------------------- /
		modifyiOS7StatusBar
	/ ----------------------------------------------------------- */
	function modifyiOS7StatusBar(){
		// if (window.device.version) alert('>> '+window.device.version);
		var doit = true;
		if (isPhoneGap() && doit==true) {
			try {
				StatusBar.hide();
				document.body.style.marginTop = "0px";
				$("#body").css('top', "0px");
				/*
				if (parseFloat(window.device.version) === 7.0) {
					// StatusBar.overlaysWebView(false);
					// StatusBar.styleLightContent();
					// StatusBar.backgroundColorByName("black");
					StatusBar.hide();
					document.body.style.marginTop = "0px";
					$("#body").css('top', "0px");
				}
				else {
					// document.body.style.marginTop = "20px";
					// $("#body").css('top', "20px");
					document.body.style.marginTop = "0px";
					$("#body").css('top', "0px");
				}
				if (window.device.version && parseFloat(window.device.version) > 7) {
					// document.body.style.marginTop = "20px";
				}
				// StatusBar.backgroundColorByHexString("#3e8fd9");
				*/
			} catch(e){ 
				// catchError('modifyiOS7StatusBar()',e); 
			}
		}
		else {
			// console.log('not mobile: statusbar not modified');
		}
	}

	function debugModeEnabled(){
		return true; //false;
	}

	/* ----------------------------------------------------------- /
		report
	/ ----------------------------------------------------------- */
	function report(logtype,msg){
		try{
			// alert(logtype + ': ' + msg);
			// console.log(logtype + ': ' + msg);
		}catch(e){ 
			// give up
		}            
	}


	/* ----------------------------------------------------------- /
	 test_InAppBrowser
	 / ----------------------------------------------------------- */
	function test_InAppBrowser_WithOptions(){
		report('TEST','--> test_InAppBrowser()..');
		try{
			
			if(!cordovaIsLoaded){
				doAlert('Please Note: The [InAppBrowser] plugin\'s dimension and position parameters only work on an actual device.','Plugin Note');
			}
			
			
			var windowHeight, windowWidth, viewX, viewY;
			var iab;
			viewX = 200;
			viewY = 0;
			windowHeight = window.innerHeight;
			windowWidth = window.innerWidth-200;
		
			iab = window.open('http://www.ign.com','_blank',
								  'enableviewportscale=yes,' +
								  'location=yes,' +
								  'vw=' + windowWidth + ',' +
								  'vh=' + windowHeight + ',' +
								  'vx=' + viewX + ',' +
								  'vy=' + viewY);
			iab.addEventListener('loadstart', function(){ $('body').addClass('inappbrowser_windowed_mode'); });
			iab.addEventListener('exit', function(){ $('body').removeClass('inappbrowser_windowed_mode'); });
			
		}catch(e){ catchError('test_InAppBrowser()',e); }
	}

	/* ----------------------------------------------------------- /
	 test_InAppBrowser_NoOptions
	 / ----------------------------------------------------------- */
	function test_InAppBrowser_NoOptions(){
		report('TEST','--> test_InAppBrowser_NoOptions()..');
		try{
			//doAlert('Website will now be opened via InAppBrowser [window.open]','cordova-inappbrowser');
			window.open('http://www.ign.com','_blank','fullscreenbuttonenabled=no');
		}catch(e){ catchError('test_InAppBrowser_NoOptions()',e); }
	}


	/* ----------------------------------------------------------- /
	 test_PDFBrowser
	 / ----------------------------------------------------------- */
	function test_PDFBrowser(){
		report('TEST','--> test_PDFBrowser()..');
		try{

			var pdfView;
			var windowHeight, windowWidth, viewX, viewY;
			viewX = 0;
			viewY = 0;
			windowHeight = window.innerHeight;
			windowWidth = window.innerWidth;

			pdfView = window.open('pdf/example.pdf','_blank',
								  'enableviewportscale=yes,fullscreenbuttonenabled=no,' +
								  'location=no,' +
								  'vw=' + windowWidth + ',' +
								  'vh=' + windowHeight + ',' +
								  'vx=' + viewX + ',' +
								  'vy=' + viewY);
		
			//pdfView.addEventListener('loadstart', function(){ setBodyPDFClass(); });
			//pdfView.addEventListener('exit', function(){ pdfView.close(); clearBodyPDFClass(); });


		}catch(e){ catchError('test_PDFBrowser()',e); }
	}




	/* ----------------------------------------------------------- /
	 test_PDFBrowser_Form
	 / ----------------------------------------------------------- */
	function test_PDFBrowser_Form(){
		report('TEST','--> test_PDFBrowser_Form()..');
		try{
			if(!cordovaIsLoaded){
				doAlert('Please Note: The [InAppBrowser] plugin\'s dimension and position parameters only work on an actual device.','Plugin Note');
			}
			window.open('pdf/example.pdf','_blank','enableviewportscale=yes,presentationstyle=formsheet');
			
		}catch(e){ catchError('test_PDFBrowser_Form()',e); }
	}


	/* ----------------------------------------------------------- /
	 test_PDFBrowser_Vertical
	 / ----------------------------------------------------------- */
	function test_PDFBrowser_Vertical(){
		report('TEST','--> test_PDFBrowser_Vertical()..');
		try{

			var pdfView;
			var windowHeight, windowWidth, viewX, viewY;
			viewX = 0;
			viewY = (window.innerHeight*.35)/2;                    
			windowHeight = window.innerHeight*.65;        
			windowWidth = window.innerWidth;
			
			pdfView = window.open('pdf/example.pdf','_blank',
								  'enableviewportscale=yes,' +
								  'location=no,' +
								  'vw=' + windowWidth + ',' +
								  'vh=' + windowHeight + ',' +
								  'vx=' + viewX + ',' +
								  'vy=' + viewY);            

		}catch(e){ catchError('test_PDFBrowser_Vertical()',e); }
	}



	/* ----------------------------------------------------------- /
	 test_PDF_Windowed
	 / ----------------------------------------------------------- */
	function test_PDF_Windowed(){
		report('TEST','--> test_PDF_Windowed()..');
		try{
			
			if(!cordovaIsLoaded){
				doAlert('Please Note: The [InAppBrowser] plugin\'s dimension and position parameters only work on an actual device.','Plugin Note');
			}
			
			var windowHeight, windowWidth;
			var viewX = window.innerWidth*.05;
			var viewY = 0;
			windowHeight = window.innerHeight;
			windowWidth = window.innerWidth*.90;
			
			var pdfView = window.open('pdf/example.pdf','_blank',
								  'enableviewportscale=yes,' +
								  'location=no,' +
								  'vw=' + windowWidth + ',' +
								  'vh=' + windowHeight + ',' +
								  'vx=' + viewX + ',' +
								  'vy=' + viewY);     
			pdfView.addEventListener('loadstart', function(){ $('body').addClass('inappbrowser_windowed_mode'); });
			pdfView.addEventListener('exit', function(){ $('body').removeClass('inappbrowser_windowed_mode'); });
			
		}catch(e){ catchError('test_PDF_Windowed()',e); }
	}




	function test_SDID(){
		report('TEST','--> test_SDID()..');
		try{
			if(!cordovaIsLoaded){
				doAlert('Sorry: The [SecureDeviceIdentifier] plugin only works on an actual device.','Plugin Error');
				return false;
			}
			getDeviceID();
			var id = window.setTimeout(function(){
									   report('TEST','deviceSDID: ' + deviceSDID + '...');
									   $('#device_id').html(deviceSDID);
									   },1000);
			doAlert('Unique Device ID will be retrieved momentarily - please wait.','cordova-securedeviceidentifier');
			
			
		}catch(e){ catchError('test_SDID()',e); }
	}

	/* ----------------------------------------------------------- /
	 test_PowerManagement
	 / ----------------------------------------------------------- */
	/*
	function test_PowerManagement(){
		report('TEST','--> test_PowerManagement()..');
		try{
			
			if(!cordovaIsLoaded){
				doAlert('Sorry: The [PowerManagement] plugin only works on an actual device.','Plugin Error');
				return false;
			}
			
			
			if(!autoLockIsDisabled){
				PWpreventAutoLock();
				autoLockIsDisabled = true;
				$('#powermgmt_status').html('AUTO DIM/LOCK: <b>DISABLED</b>');
				doAlert('App will now PREVENT auto lock/auto dim. Please wait a 30-60 seconds to confirm.','cordova-powermanagement');
			}else{
				PWreenableAutoLock();
				autoLockIsDisabled = false;
				$('#powermgmt_status').html('AUTO DIM/LOCK: <b>ENABLED</b>');
				doAlert('App will now ALLOW auto lock/auto dim as normal. Please wait a 30-60 seconds to confirm.','cordova-powermanagement');
			}
			
		}catch(e){ catchError('test_PowerManagement()',e); }
	}
	*/

	/* ----------------------------------------------------------- /
	 test_Badge
	 / ----------------------------------------------------------- */
	/*
	function test_Badge(){
		
		try{
			
			if(!cordovaIsLoaded){
				doAlert('Sorry: The [Badge] plugin only works on an actual device.','Plugin Error');
				return false;
			}
			
			cdvBadge = window.plugins.badge;
			
			report('TEST','--> test_Badge().. [cdvBadge:' + cdvBadge + '?]');
			
			if(badgeToggledOn){
				if(cdvBadge != undefined){
					cdvBadge.set(0);
					cdvBadge.clear();
				}
				doAlert('App Icon Badge Removed!\n\nExit app to confirm.','cordova-badge');
				badgeToggledOn = false;
				
			}else{
				if(cdvBadge != undefined) cdvBadge.set(1);
				doAlert('App Icon Badge Added!\n\nExit app to confirm.','cordova-badge');
				badgeToggledOn = true;
			}
			
		}catch(e){ catchError('test_Badge()',e); }
	}
	*/

	/* DEBUG */ 
	// window.console.log('js/tests.js loaded...');

	/* --------------------------------------- */
	function doAlert(message, title){
		try{
			var alertText = message;
			var alertTitle = title;
			if(isValidString(alertTitle)==false) title = 'Default Native Message';
			if(usingMobileDevice() && isNativeAppMode()){
				navigator.notification.alert(
				alertText,  // message
				alertDismissed,         // callback
				alertTitle,            // title
				'OK'                  // buttonName
				);		
			}else{
				alert(alertTitle + "\n\n" + alertText);
			}	
			// alert('VERBOSE >> doAlert() --> [' + alertTitle + ' | ' + alertText);
			report('VERBOSE','doAlert() --> [' + alertTitle + ' | ' + alertText);
			return false;		
		}catch(ex){
			catchError('doAlert()',ex);
		}	
		
	}

	/* ---------------------------------------- */
	function alertDismissed(e){
		// nothing - just stub function
		return false;
	}



	/* --------------------------------------- */
	// NOTE: callback button index must be 1 (the first one)
	function doConfirm(confirmText, confirmTitle, confirmCallback, confirmButtonLabels){
		try{
			if(typeof(confirmButtonLabels) == 'undefined') confirmButtonLabels = ('Ja,Nein').split(",");
			report('doConfirm() [confirmText:' + confirmText + ', confirmCallback:' + confirmCallback + ']');
			if(usingMobileDevice() && isNativeAppMode()){
			  //fadePageContentOutBeforePopup();
			   navigator.notification.confirm(
					confirmText,
					confirmCallback,
					confirmTitle,
					confirmButtonLabels          
				);	
				//fadePageContentInAfterPopup();
			}else{
				var confirmDecisionIndex = 2; // represents "false"
				if(confirm(confirmText)) confirmDecisionIndex = 1;
				confirmCallback(confirmDecisionIndex);
			}		
		}catch(ex){
			catchError('doConfirm()',ex);
		}	
	}

	/* --------------------------------------- */	
	function isValidString(str){
		if(
			(typeof(str) != 'undefined') &&
			(str != '') &&
			(str != undefined) &&
			(str != null) &&
			(str != 'undefined')
		){
			return true;
		}else{
			return false;
		}
	}

	/* --------------------------------------- */
	function isIOSSimulatorMode(){
		var _isIOSSimulatorMode = false;; 
		try{
			if(!usingMobileDevice()) return false;
			var _platform = getDeviceType().toUpperCase();// device.name
			_isIOSSimulatorMode =(_platform.indexOf('SIMULATOR',0) > -1);		
		}catch(ex){
			catchError('isIOSSimulatorMode()',ex);
		}
		//window.console.log('isIOSSimulatorMode(' + _isIOSSimulatorMode + ') platform:' +  device.name);
		return _isIOSSimulatorMode;	
	}


	/* --------------------------------------- */
	function isNativeAppMode(){
		// re-test if/when using non-Apple devices
		var isNative;
		var isSafari = navigator.userAgent.match(/Safari/i) != null;
		if((document.location.href.toUpperCase().indexOf('FILE://',0) > -1) && (usingMobileDevice())){
			isNative = true;
		}else{
			isNative = false;
		}
		// report('\t\t isNativeAppMode() isSafari [' + isSafari + '] [isNative "FILE:" link?:' + isNative + ']');
		//*DEBUG */ report('--> isNativeAppMode(' + isNative + ')');
		return isNative;
	}

	function usingMobileDevice(){
		var _isMobile = isMobile.any(); // globals.js
		// var userAgent = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
		return _isMobile;
	}

	// DEVICE DETECTION: Device API mode
	function isiPhone(){
		return (
			//Detect iPhone
			(navigator.platform.indexOf("iPhone") != -1) ||
			//Detect iPod
			(navigator.platform.indexOf("iPod") != -1)
		);
	}

	function nullClickEvent(e){ 	e.stopPropagation(); }


	function getRandomID() {
		var dateNow = new Date();
		return String(dateNow * Number(dateNow.getMilliseconds() * dateNow.getSeconds()));
	}

	function getDeviceID(){
		try{
			if(cordovaIsLoaded){			
				// _id = device.uuid; uuid deprecated...
				
				// this only works if SecureDeviceIdentifier plugin is loaded into xcode/app
				var secureDeviceIdentifier = window.plugins.secureDeviceIdentifier;            
				/* DEBUG */ // doAlert('getDeviceID() [secureDeviceIdentifier:' + secureDeviceIdentifier + ']');
				
				secureDeviceIdentifier.get({
					domain: SDID_DOMAIN,
					key: SDID_KEY
				}, function(udid) {                
					/* DEBUG */ //   navigator.notification.alert("SecureUDID=" + udid);
					deviceSDID = udid;
					// navigator.notification.alert("SecureUDID=" + udid);
					// report('TEST','CORDOVA: DEVICE ID:' + deviceSDID);
					/* DEBUG */ //  alert(deviceSDID);
					return deviceSDID;
				})                        
				// report('TEST',"*** plugins.uniqueDeviceId.secureDeviceIdentifier() ID?:" + _id + "***");            	
				// report('TEST','WEB: DEVICE ID:' + deviceSDID);
			}else{
				deviceSDID = "UNKNOWN (" + getDeviceType() + ")";
			}
		}
		catch(e){
			report('ERROR','ERROR with getDeviceID() [' + e.message + ']');
		}
	}

	function getDeviceType(){
		var type;
		try{
			if(cordovaIsLoaded){
				type = device.model; // "name" deprecated after CDV 2.3 name;  // iPhone, iPad, iPod Touch
			}else{
				 type = "WebBrowser";
			}
		}
		catch(e){
			report('VERBOSE','ERROR','ERROR with getDeviceType() [' + e.message + ']');
		}
		return type;
	}

	function getOSVersionFromUserAgent(){
		report('TEST','--> getOSVersionFromUserAgent()..');	
		try{
			var _parts1 = navigator.userAgent.split("(");
			var _parts2 = _parts1[1].split(";");

			return _parts2[0];												
		}catch(e){ catchError('getOSVersionFromUserAgent()',e); }			
	}

	function getOS(){
		var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";	
		if((navigator.appVersion.indexOf("Mobile")!=-1)) OSName += " Mobile";
		if(cordovaIsLoaded){
			OSName = device.platform;
		}
		return OSName;	
	}

	function getDeviceVersion(){
		var version;
		// notworking?
		try{
			if(cordovaIsLoaded){
				version = getOS() + ' ' + device.version; // "name" deprecated after CDV 2.3 name;  // iPhone, iPad, iPod Touch
			}else{
				 version = getOSVersionFromUserAgent();		 	 
			}
		}
		catch(e){
			report('VERBOSE','ERROR','ERROR with getDeviceVersion() [' + e.message + ']');
		}
				
		return version;
	}

	function getDeviceModel(){
		var model;
		try{
			if(cordovaIsLoaded){
				model = device.model; // iPad 2,5			
			}else{
				model = getOS();
			}
		}
		catch(e){
			report('VERBOSE','ERROR','ERROR with getDeviceModel() [' + e.message + ']');
		}
		report('VERBOSE','DEVICE NAME:' + model);	
		return model; 
	}

	function getDevicePlatform(){
		var platform;
		try{
			if(cordovaIsLoaded){
				if(isIOSSimulatorMode()){
					platform = "iOS Simulator";
				}else{
					platform = device.platform; // iPad, iPhone	
				}
				
			}else{
				platform = getDeviceType(); // WebBrowser likely
			}
		}
		catch(e){
			report('VERBOSE','ERROR','ERROR with getDevicePlatform() [' + e.message + ']');
		}
		report('VERBOSE','DEVICE NAME:' + platform);	
		return platform; 
	}

	function removeNonAlphaNumericChars(str){	
		str = str.replace(/[ ]+/g,'_');
		str = str.replace(/[^a-zA-Z0-9_-]+/g,'');
		return str;	
	}

	function removeProtectedDelimeters(str){		
		str = str.replace(/[,;|]+/g,'');
		return str;	
	}

	function nothing() {
		// empty callback function
	}

	function openExternalURL(url) {
		// openExternal(url, usePhoneGap);
		try {
			// window.plugins.ChildBrowser.openExternal(url);
			cordova.exec(nothing, nothing, "OpenUrl", "openUrl", url);
			// openExternal('http://www.google.com');
			// window.plugins.childBrowser.openExternal('http://www.google.com');
		} catch (e) {
			alert(e);
		}    
	}

	function openExternalURL_save1(strURL) {	
		if (!isMobile.any()) {
			doAlert('You are not mobile at the moment...','Ohh');
			return(false);
		}
		// https://itunes.apple.com/us/app/isitlead/id637464156?ls=1&mt=8
		try{
			if(!isConnectedToInternet()){
				doGenericConnectionAlert();
				return false;
			}
			// doAlert('openExternalURL(' + strURL + ')... MODE (TBD)...');
			// window.open(strURL, '_system'); //, 'location=yes');	
			if(
				((isIOSSimulatorMode()) || (!isMobile.any())) &&
				(strURL.toUpperCase().indexOf('ITUNES.APPLE.COM',0)>-1)
				){
				alert('App Store links do not work in web browsers or device simulators. Please try this feature on a mobile device to confirm it is working properly.','App Store Link');
				return false;
			}
			// inAppBrowser method --> window.open(strURL, '_system'); //, 'location=yes');
			 // ChildBrowser Method // /*cb = child browser cordova plugin*/
			 if(cb != null)
			 {
				window.console.log('openExternalURL(' + strURL + ') [CORDOVA mode]..');
				 cb.onLocationChange = function(loc){ root.locChanged(loc); };
				 cb.onClose = function(){root.onCloseBrowser()};
				 cb.onOpenExternal = function(){root.onOpenExternal();};		
				 //window.console.log(strURL);
				 // cb.showWebPage(strURL);
				 // window.plugins.childBrowser.showWebPage(strURL);
				 window.open(strURL,'_blank','location=no'); 
			 }else{
				 // if(            	
				 // 	(!isNativeAppMode()) && 
				 // 	(usingMobileDevice())
				 // 	){
				window.console.log('openExternalURL(' + strURL + ') [TEST/BROWSER mode].. {isNativeAppMode:' + isNativeAppMode() + '| usingMobileDevice:' + usingMobileDevice() + '}');
				 if(confirm('HTML5 External URLs are not fully functional when viewing on the iOS Simulator - do you want to view the URL anyway?')){
					 document.location.href = strURL;
					 /* 20130716: window.open not working in CHrome??? */ // window.open(strURL,'_blank'); 
				 }else{
					return false;			
				 }		
				 //}                                   
			 }
		}catch(e){
			catchError('openExternalURL()...',e);
		}	
	} 


	/* ------------------------------------ */
	function onCloseBrowser()
	{    
		window.console.log('onCloseBrowser()...');
		if(iTunesUpdateURLLoaded) iTunesUpdateURLLoaded = false;
	}

	/* ------------------------------------ */
	function locChanged(loc) { window.console.log('locChanged()...');   }
	function onOpenExternal(){ window.console.log('onOpenExternal()...'); }    

	function isiPhone(){
		return (
			//Detect iPhone
			(navigator.platform.indexOf("iPhone") != -1) ||
			//Detect iPod
			(navigator.platform.indexOf("iPod") != -1)
		);
	}


	/*
	function scrollToTop(){
		$(window).scrollTop(0); //window.scrollTo(0,0);
	}
	*/

	function getURLParameter(name) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
		return "";
	  else
		return results[1];
	}


	function getUniqueIDString(){
		var time = new Date();
		return String(time.getMilliseconds() + time.getSeconds() + time.getDate());
	}


	function clearTimeoutVar(tVar){
		try{
			if(typeof(tVar) != 'undefined'){
				window.clearTimeout(tVar);
			}											
		}catch(e){ catchError('clearTimeoutVar()',e); }					
	}

	function clearIntervalVar(iVar){
		try{
			if(typeof(iVar) != 'undefined'){
				window.clearInterval(iVar);
			}											
		}catch(e){ catchError('clearIntervalVar()',e); }					
	}

	// onSuccess Callback
	//
	function cordovaOnSuccess() {
		console.log("playAudio():Audio Success");
	}

	// onError Callback 
	//
	function cordovaOnError(error) {
		alert('code: '    + error.code    + '\n' + 
			  'message: ' + error.message + '\n');
	}


	/* ----------------------------------------------------------- /
		isDisabled(element)	
	/ ----------------------------------------------------------- */
	function isDisabled(element){
		report('VERBOSE','--> isDisabled()..');	
		try{
			return ($(element).hasClass('disabled'));
													
		}catch(e){ catchError('isDisabled()',e); }			
	}



	function hideKeyboard(){
		document.activeElement.blur();
		$("input").blur();
		$("body").focus();
	};

	function validateEmail(email){
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	}

	function doGenericConnectionAlert(){
		doAlert('This feature requires an internet connection. Please connect this device to a WiFi or a 3G/4G network and try again.','Internet Connection Required');
	}	

	function secondsBetweenTwoDates(date1, date2){	
		var difference = (date2 - date1) / 1000;
		return difference;
	}


	/* ----------------------------------------------------------- /
		getBasicTimeString
		example: 5:23 PM
	/ ----------------------------------------------------------- */
	function getBasicTimeString(h,m,excludeSuffix){
		try{
			var _hour = h;
			var _min = m;
			var _ampm = "AM";
			if(_hour > 11){ _ampm = "PM";}		
			if(_hour > 12){ _hour -= 12;}		
			// integrate [excludeSuffix] later
			if(_min < 10) _min = "0" + m.toString();
			_timeString = _hour + ":" + _min + " " + _ampm;		
			report('TEST','--> getBasicTimeString(h:' + h + ',m:' + m + ',excludeSuffix:' + excludeSuffix + ').. [' + _timeString + ']');	
			return _timeString;
		}catch(e){ catchError('getBasicTimeString()',e); }			
	}		

	function isEmpty(value){
	  return (value == null || value.length === 0);
	}

	String.prototype.replaceAll = function(str1, str2, ignore){
		return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
	}


	function sendEmail(strTo,strSubject,strBody){
		if(isEmpty(strTo)) return;
		if(isEmpty(strSubject)) strSubject = '';
		if(isEmpty(strBody)) strBody = '';
		//strBody += '------------------------' + getEncodedLineBreakChar(); // + '---- contacts ----' + getEncodedLineBreakChar() + emailContactsList;	
		if(emailComposerConfiguredInApp && cordovaIsLoaded){
			var emailArgs = {
				toRecipients:strTo,
				subject:strSubject,
				body:strBody,
				isHTML:false
			};
			cordova.exec(null, null, "EmailComposer", "showEmailComposer", [emailArgs]);
		}else{
			document.location = "mailto:" + strTo + "?Subject=" + strSubject + "&Body=" + strBody;
		}
	}

	function isLocalHost(){ 
		return (document.location.href.indexOf('localhost',0) > -1); 
	}

	/* ----------------------------------------------------------- /
		PWpreventAutoLock
	/ ----------------------------------------------------------- */
	function PWpreventAutoLock(){
		if(cordovaIsLoaded) report('TEST','--> PWpreventAutoLock()..'); 
		try{
			if(cordovaIsLoaded && isMobile.any()) cordova.require('cordova/plugin/powermanagement').acquire( powerMgmtSuccess, powerMgmtError );                                                
		}catch(e){ catchError('PWpreventAutoLock()',e); }           
	}       

	/* ----------------------------------------------------------- /
		PWpreventAutoLockButAllowDim
	/ ----------------------------------------------------------- */
	function PWpreventAutoLockButAllowDim(){
		if(cordovaIsLoaded) report('TEST','--> PWpreventAutoLockButAllowDim()..');  
		try{
			if(cordovaIsLoaded && isMobile.any()) cordova.require('cordova/plugin/powermanagement').dim( powerMgmtSuccess, powerMgmtError ); 
		}catch(e){ catchError('PWpreventAutoLockButAllowDim()',e); }            
	}       

	/* ----------------------------------------------------------- /
		PWreenableAutoLock
	/ ----------------------------------------------------------- */
	function PWreenableAutoLock(){
		if(cordovaIsLoaded) report('TEST','--> PWreenableAutoLock()..');    
		try{
			if(cordovaIsLoaded && isMobile.any()) cordova.require('cordova/plugin/powermanagement').release( powerMgmtSuccess, powerMgmtError ); 
		}catch(e){ catchError('PWreenableAutoLock()',e); }          
	}      

	function powerMgmtError(error){ report('ERROR','powerMgmtError() [error(' + error + ')]'); }
	function powerMgmtSuccess(success){ report('TEST','powerMgmtSuccess() success: ' + powerMgmtSuccess + '...');}

	function catchError(f,e){
		// report('ERROR','ERROR in (' + f + ')[Error Message: ' + e.message + ']');
		doAlert('ERROR','ERROR in (' + f + ')[Error Message: ' + e.message + ']');
	}



	/*
	CAMERA AND VIDEO FUNCTIONS
	*/

	//-------------------------------------------------------------------------
	// Camera
	//-------------------------------------------------------------------------

	function clearStatus() {
		document.getElementById('camera_status').innerHTML = '';
		document.getElementById('camera_image').src = 'about:blank';
		var canvas = document.getElementById('canvas');
		canvas.width = canvas.height = 1;
		pictureUrl = null;
		fileObj = null;
		fileEntry = null;
	}

	function log(value) {
		console.log(value + '\n');
		document.getElementById('camera_status').textContent += (new Date() - pageStartTime) / 1000 + ': ' + value + '\n';
	}

	function setPicture(url, callback) {
		try {
			window.atob(url);
			// if we got here it is a base64 string (DATA_URL)
			url = "data:image/jpeg;base64," + url;
		} catch (e) {
			// not DATA_URL
			log('URL: ' + url.slice(0, 100));
		}    

		pictureUrl = url;
		var img = document.getElementById('camera_image');
		var startTime = new Date();
		img.src = url;
		
		alert(url);
		
		/*
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			alert("Root = " + fs.root.fullPath);
			log("Root = " + fs.root.fullPath);
			var directoryReader = fs.root.createReader();
			directoryReader.readEntries(function(entries) {
				var i;
				for (i=0; i<entries.length; i++) {
					log(entries[i].name);
				}
			}, function (error) {
				alert(error.code);
			})
		}, function (error) {
		alert(error.code);
		});
		*/

		if (isMobile.any()) {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
				  imagePath = fs.root.fullPath + "/photoshot.jpg"; // full file path
				  var fileTransfer = new FileTransfer();
				  fileTransfer.download(url, imagePath, function (entry) {
					// alert(imagePath);
					alert(entry.fullPath); // entry is fileEntry object
					document.getElementById('camera_image_b').src = entry.fullPath;
				  }, function (error) {
					alert("Some error");
				  });
			});
		}

		img.onloadend = function() {
			log('Image tag load time: ' + (new Date() - startTime));
			callback && callback();
		};
	}

	function onGetPictureError(e) {
		log('Error getting picture: ' + e.code);
	}

	function getPicture() {
		// clearStatus();
		var options = extractOptions();
		log('Getting picture with options: ' + JSON.stringify(options));
		var popoverHandle = navigator.camera.getPicture(getPictureWin, onGetPictureError, options);

		// Reposition the popover if the orientation changes.
		window.onorientationchange = function() {
			var newPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, 0);
			popoverHandle.setPosition(newPopoverOptions);
		}
	}

	function getPictureWin(data) {
		setPicture(data);
		// TODO: Fix resolveLocalFileSystemURI to work with native-uri.
		if (pictureUrl.indexOf('file:') == 0) {
			resolveLocalFileSystemURI(data, function(e) {
				fileEntry = e;
				logCallback('resolveLocalFileSystemURI()', true)(e);
			}, logCallback('resolveLocalFileSystemURI()', false));
		} else if (pictureUrl.indexOf('data:image/jpeg;base64' == 0)) {
			// do nothing
		} else {
			var path = pictureUrl.replace(/^file:\/\/(localhost)?/, '').replace(/%20/g, ' ');
			fileEntry = new FileEntry('image_name.png', path);
		}
	}

	function mediaOnSuccess(data) {
		// nothing yet
	}

	function mediaOnError(error) {
		// $("#playMediaProperties").empty();
		// $("#playMediaProperties").append("ERROR: Cannot play audio. Code: " + error.code + " Message: " + error.message + "<br/>");
		// clearInterval(mediaTimer);
		// mediaTimer = null;        
		// my_media.release();
		// my_media = null;
		console.log("Error playbacking media");
	}

	function captureVideoRecord() {
		var options = { limit: 1, duration: 600, quality: 10 };
		// nur audio aufnehmen: navigator.device.capture.captureAudio
		var popoverHandle = navigator.device.capture.captureVideo(getVideoWin, onGetVideoError, options);
		window.onorientationchange = function() {
			var newPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, 0);
			popoverHandle.setPosition(newPopoverOptions);
		}
	}

	function purchaseVideoConfirm(me,videoData) {
		this._me = me;
		this._videoData = videoData;
		if (this._videoData.price>0) doConfirm('Möchten Sie dieses Video für ' + this._videoData.price + ' APPinaut Coins ansehen?', 'Video ansehen', function (event) { 
			if (event=="1") {
				purchaseVideoStart(me,videoData);
			}
		}, undefined);
		else purchaseVideoStart(me,videoData);
	}

	function purchaseVideoStart(me,videoData) {
		var creditsAfterPurchase = parseFloat(me.credits) - parseFloat(videoData.price);
		this._videoData = videoData;
		this._creditsAfterPurchase = creditsAfterPurchase;
		// console.log(creditsAfterPurchase,'creditsAfterPurchase');
		// return(false);
		// alert('Video ' + videoData.id + ' wird über User ID ' + me.id + 'gekauft. Sie haben nun '+creditsAfterPurchase+' Credits.');
		var data = new Object();
		data.credits = ''+creditsAfterPurchase;
		data.purchases = me.purchases;
		this._newData = data;
		// console.log(_newData.purchases);
		
		this._me = me;
		$.ajax('http://dominik-lohmann.de:5000/users/?id='+me.id,{
			type:"GET",
			async: false,
		}).done(function(me) {
			// doAlert( "DONE!" );
			_me = me;
			if (_me.purchases==undefined) _me.purchases = new Array();
			// console.log('_me.purchases actual');
			// console.log(_me.purchases);
		}).fail(function() {
			doAlert( "Es ist leider ein Fehler passiert, der nicht passieren sollte.", "Entschuldigung..." );
		})
		.always(function() {
			// alert( "finished - nw redirecting" );
		});
		if ($.inArray(videoData.id, _me.purchases) >= 0) {
			// Do your stuff.
			doAlert('Sie haben dieses Video bereits gekauft.','Information');
		}
		else {
			if (_me.purchases==undefined) _me.purchases = new Array();
			// console.log(me.purchases);
			// me.push( videoData.id );
			// var el = new Object();
			// el.value = videoData.id;
			me.purchases.push(videoData.id);
			// var videoData = videoData;
			// console.log(me.purchases);
			// return(false);
			$.ajax('http://dominik-lohmann.de:5000/users/?id='+me.id,{
				type:"POST",
				contentType: "application/json",
				async: false,
				data: JSON.stringify({
					purchases: _newData.purchases,
					credits: creditsAfterPurchase
				}),
			}).done(function(uploaderdata) {
				// doAlert( "Das Video wurde gekauft." );
				var alertmsg = 'Sie können das Video nun vollständig ansehen.';
				if (_videoData.price>0) alertmsg += ' Für weitere Käufe sind noch '+creditsAfterPurchase+' Credits verfügbar.';
				doAlert(alertmsg,'Information');
				addFollower(me, _videoData.uploader);
				addOrder(me,_videoData.id,_videoData.uploader,_videoData.price);
			}).fail(function() {
				console.log( "Es ist leider ein Fehler passiert, der nicht passieren sollte.", "Entschuldigung..." );
			})
			.always(function() {
				window.me.purchases = _newData.purchases;
				window._thisViewVideoDetails.render();
			});
		}
	}

	function addFollower(me, toid) {
		// var query = {id:toid,$or:[{"sponsor":me.id},{"followers":me.id}],$sort:{fullname:1}};
		var query = {  followers: {$in: [me.id]}, id:toid };
		dpd.users.get(query, function (result,err) {
			if(err) dpd.users.put(toid, {"followers": {$push:$.trim(me.id)}} );
		});
		var query = {  following: {$in: [toid]}, id:me.id };
		dpd.users.get(query, function (result,err) {
			if(err) dpd.users.put(me.id, {"following": {$push:$.trim(toid)}} );
		});
	}

	function addVideoReport(me, videoid) {
		var query = {  reportedby: {$in: [me.id]}, id:videoid };
		dpd.videos.get(query, function (result,err) {
			if(err) dpd.videos.put(videoid, {"reportedby": {$push:$.trim(me.id)}} );
		});
	}

	function addOrder(me,videoid,creatorid,price) {
		dpd.orders.post({"userid":""+me.id,"videoid":""+videoid,"creatorid":""+creatorid,"price":""+price}, function(result, err) {
			if(err) return console.log(err);
		});
	}

	function onGetVideoError(e) {
		// log('Error getting picture: ' + e.code);
		// alert('bla3');
		console.log('Video capture failed');
	}

	function getVideoWin(mediaFiles) {
		// console.log('captureVideoRecord');
		// console.log(mediaFiles);
		try {
			var i, path, len;
			for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				// name: The name of the file, without path information. (DOMString)
				// fullPath: The full path of the file, including the name. (DOMString)
				// type: The file's mime type (DOMString)
				// lastModifiedDate: The date and time when the file was last modified. (Date)
				// size: The size of the file, in bytes. (Number)
				// mediaFiles[0].getFormatData(function(data) {
					// if(data.duration > 30) {
						// Tell the user the video is too long
					// } else {
						// Video is less than the max duration...all good
					// }
				// });
				// do something interesting with the file
				// captureVideoUpload(mediaFiles[i]);
				// log('video will now be played');
				// my_media = new Media(path, mediaOnSuccess, mediaOnError);
				// my_media.play();
				// var blax = JSON.stringify(mediaFiles);
				// alert(path);
				// doAlert('Klicken Sie zum Fortsetzen auf weiter.','Aufnahme erfolgreich');
				// doAlert(mediaFiles[i].fullPath,'DEBUG FULLPATH');
				mediaFiles[i].getFormatData(function(data) {
					// alert(data.duration);
					window.system.videolength = Math.ceil(data.duration);
					// alert(window.system.videolength);
				});
				
				attachVideoToPlayer(mediaFiles[i].fullPath);
				// _thisViewRecordVideoNested.switchPage();
				// alert('Bitte klicken Sie auf hochladen.');
			}
		} catch (e) {
			// not DATA_URL
			// log('mediaFiles: ' + mediaFiles.slice(0, 100));
		}    
		// console.log('set video function end');
	}

	// TODO: File Transfer onProgress DOWNload
	// http://www.raymondcamden.com/index.cfm/2013/5/1/Using-the-Progress-event-in-PhoneGap-file-transfers

	function sendLocalStorageToElements(videoRecordLocalStorage) {
		// console.log('************');
		var models = videoRecordLocalStorage;
		var keys = new Array();
		for(var key in models) {
		   keys[keys.length] = key;
		   var modelsattribute = models[key].attributes;
			for(var modelkey in modelsattribute) {
				if($('#'+modelkey).is("textarea")) {
					$('#'+modelkey).html(modelsattribute[modelkey]);
					// console.log(modelkey+' >> '+modelsattribute[modelkey]);
				}
				else if($('#'+modelkey).is("select")) {
					// alert(modelkey + ' is a select');
					if (modelkey=='interest') {
						// $('#'+modelkey).val(modelsattribute[modelkey]);
						// console.log(modelkey+' >> '+modelsattribute[modelkey]);
					}
					else {
						// $('#'+modelkey).val(modelsattribute[modelkey]);
						// console.log(modelkey+' >> '+modelsattribute[modelkey]);
					}
				}
				else {
					$('#'+modelkey).val(modelsattribute[modelkey]);
					console.log(modelkey+' >> '+modelsattribute[modelkey]);
				}
			}
		}
		// console.log('************');
	}


	function attachVideoToPlayer(mediaFilePath) {
		// var path = mediaFile.fullPath;
		// var path = mediaFilePath;
		// console.log('attachVideoToPlayer: '+mediaFilePath);
		// alert('attachVideoToPlayer: '+mediaFilePath);
		var video_player = $('#video_player');
		// $("#video_player").attr("src", "file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4").get(0).play();
		if (mediaFilePath==undefined) {
			// console.log('hide');
			// $('#videobox').hide();
			return(false);
		}
		else {
			// console.log('attaching to video player: ' + mediaFilePath);
			// alert('attaching to video player: ' + mediaFilePath);
			$('#camera_file').val(mediaFilePath);
		}
		if (mediaFilePath!='') {
			// console.log('setting video player src');
			var startTime = new Date();
			// video_player.src = mediaFilePath;
			// video_player.attr("src", "file:///D:/cordova/Backbone-Require-Boilerplate-master/public_VIDEOS/testvideo.mp4").get(0).pause();
			video_player.attr("src", mediaFilePath).get(0).pause();
			video_player.onloadend = function() {
				// console.log('Video load time: ' + (new Date() - startTime));
				// alert('Video load time: ' + (new Date() - startTime));
			};
		}
		if (mediaFilePath=='') {
			// console.log('mediaFilePath empty','DEBUG');
			// $('#captureVideoUploadButton').button('disable');
			// $('#submitbutton').button('disable');
		}
	}

	// Upload files to server
	function captureVideoUpload(videoRecordLocalStorage) {
		var _this = this;
		// alert('captureVideoUpload');
		// console.log('^^');
		// console.log(videoRecordLocalStorage);
		// console.log('^^');
		// console.log('^^^^^^^^^^^^');
		var models = videoRecordLocalStorage.models;
		var formValues = new Array();
		for(var key in models) {
		   // formValues[formValues.length] = key;
		   var modelsattribute = models[key].attributes;
		   // console.log(modelsattribute);
			for(var modelkey in modelsattribute) {
				// console.log(modelkey+' >> '+modelsattribute[modelkey]);
				formValues[modelkey] = modelsattribute[modelkey];
			}
		}
		var mediaFile = formValues.camera_file;
		try {
			showModal();
			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent) {
				// $('#uploadstatusbar').html(round((progressEvent.loaded/progressEvent.total)*10000)+' % (' + progressEvent.loaded + ' / ' + progressEvent.total + ')');
				// $('#uploadstatusbar').html(progressEvent.loaded + " / " + progressEvent.total);
				// $('#modaltxt').html( (Math.round((progressEvent.loaded / progressEvent.total) * 100)) + " %" );
				$('#modaltxt').html( progressEvent.loaded + " / " + progressEvent.total );
			};
			var options = new FileUploadOptions();
			// options.fileName = new Date().getTime();
			options.fileName = getRandomID();
			options.mimeType = "video/mp4";
			options.chunkedMode = false;
			ft.upload(mediaFile,
				// "http://management-consulting.marcel-durchholz.de/secure/upload.php",
				"http://prelaunch002.appinaut.de/secure/upload.php",
				function(r) {
					// console.log("Code = " + r.responseCode);
					// console.log("Response = " + r.response);
					// console.log("Sent = " + r.bytesSent);
					// alert(r.bytesSent);
					// dpd.videos.post({"vsize":Math.ceil(r.bytesSent).toString(),"vlength":window.system.videolength.toString(),"uploader":""+_this._thisViewRecordVideoNested.me.id,"videourl":""+options.fileName,"active":true,"cdate":""+dateYmdHis(),"topic":""+formValues.interest,"title":""+formValues.title,"subtitle":""+formValues.subtitle,"description":""+formValues.description,"price":formValues.sliderprice}, function(result, err) {
					dpd.videos.post({"vsize":Math.ceil(r.bytesSent).toString(),"vlength":window.system.videolength.toString(),"uploader":""+_this._thisViewRecordVideoNested.me.id,"videourl":""+options.fileName,"active":formValues.flipactivate,"cdate":""+dateYmdHis(),"topic":""+formValues.interest,"title":""+formValues.title,"subtitle":""+formValues.subtitle,"description":""+formValues.description,"price":formValues.sliderprice}, function(result, err) {
						if(err) {
							hideModal();
							// doAlert('Es ist ein Fehler passiert, der nicht passieren sollte. Bitte versuchen Sie Ihre Aktion erneut oder wenden Sie sich direkt an das APPinaut Support Team.','Ups! Fehler beim Upload!');
							return console.log(err);
						}
						// if (result) {
							hideModal();
							/*
							if (formValues.flipactivate==false) {
								doAlert('Nach Freigabe wird Ihr Video allen Wissensdurstigen angezeigt.','Upload erfolgreich!');
							}
							*/
							// system.redirectToUrl('#learningstreamview');
							window.location.href = '#learningstreamview';
						// }
					});
				},
				function(error) {
					// $.mobile.loading('hide');
					hideModal();
					// alert("An error has occurred: Code = " = error.code);
					// console.log('Error uploading file ' + mediaFile + ': ' + error.code);
				},
				options
			);
		} catch (e) {
			// not DATA_URL
			// console.log('class new FileTransfer not possible');
		}
		// console.log('class captureVideoUpload ended');
	}




	function uploadImage() {
		var ft = new FileTransfer(),
		uploadcomplete=0,
		progress = 0,
		options = new FileUploadOptions();
		options.fileKey="photo";
		options.fileName='test.jpg';
		options.mimeType="image/jpeg";
		ft.onprogress = function(progressEvent) {
			log('progress: ' + progressEvent.loaded + ' of ' + progressEvent.total);
		};
		var server = "aaaaaaaaaaaahttp://cordova-filetransfer.jitsu.com";

		ft.upload(pictureUrl, server + '/upload', win, fail, options);
		function win(information_back){
			log('upload complete');
		}
		function fail(message) {
			log('upload failed: ' + JSON.stringify(message));
		}
	}

	function logCallback(apiName, success) {
		return function() {
			log('Call to ' + apiName + (success ? ' success: ' : ' failed: ') + JSON.stringify([].slice.call(arguments)));
		};
	}

	// Select image from library using a NATIVE_URI destination type
	// This calls FileEntry.getMetadata, FileEntry.setMetadata, FileEntry.getParent, FileEntry.file, and FileReader.readAsDataURL.
	function readFile() {
		function onFileReadAsDataURL(evt) {
			var img = document.getElementById('camera_image');
			img.style.visibility = "visible";
			img.style.display = "block";
			img.src = evt.target.result;
			log("FileReader.readAsDataURL success");
		};

		function onFileReceived(file) {
			log('Got file: ' + JSON.stringify(file));
			fileObj = file;

			var reader = new FileReader();
			reader.onload = function() {
				log('FileReader.readAsDataURL() - length = ' + reader.result.length);
			};
			reader.onerror = logCallback('FileReader.readAsDataURL', false);
			reader.readAsDataURL(file);
		};
		// Test out onFileReceived when the file object was set via a native <input> elements.
		if (fileObj) {
			onFileReceived(fileObj);
		} else {
			fileEntry.file(onFileReceived, logCallback('FileEntry.file', false));
		}
	}
	function getFileInfo() {
		// Test FileEntry API here.
		fileEntry.getMetadata(logCallback('FileEntry.getMetadata', true), logCallback('FileEntry.getMetadata', false));
		fileEntry.setMetadata(logCallback('FileEntry.setMetadata', true), logCallback('FileEntry.setMetadata', false), { "com.apple.MobileBackup": 1 });
		fileEntry.getParent(logCallback('FileEntry.getParent', true), logCallback('FileEntry.getParent', false));
		fileEntry.getParent(logCallback('FileEntry.getParent', true), logCallback('FileEntry.getParent', false));
	};

	// Copy image from library using a NATIVE_URI destination type
	// This calls FileEntry.copyTo and FileEntry.moveTo.
	function copyImage() {
		var onFileSystemReceived = function(fileSystem) {
			var destDirEntry = fileSystem.root;

			// Test FileEntry API here.
			fileEntry.copyTo(destDirEntry, 'copied_file.png', logCallback('FileEntry.copyTo', true), logCallback('FileEntry.copyTo', false));
			fileEntry.moveTo(destDirEntry, 'moved_file.png', logCallback('FileEntry.moveTo', true), logCallback('FileEntry.moveTo', false));
		};

		if (isMobile.any()) {
			window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onFileSystemReceived, null);
		}
	};

	function extractOptions() {
		var els = document.querySelectorAll('#image-options select');
		var ret = {};
		for (var i = 0, el; el = els[i]; ++i) {
			var value = el.value;
			if (value === '') continue;
			if (el.isBool) {
				ret[el.keyName] = !!value;
			} else {
				ret[el.keyName] = +value;
			}
		}
		return ret;
	}

	function createOptionsEl(name, values, selectionDefault) {
		var container = document.createElement('div');
		container.style.display = 'inline-block';
		container.appendChild(document.createTextNode(name + ': '));
		var select = document.createElement('select');
		select.keyName = name;
		container.appendChild(select);
		
		// if we didn't get a default value, insert the blank <default> entry
		if (selectionDefault == undefined) {
			var opt = document.createElement('option');
			opt.value = '';
			opt.text = '<default>';
			select.appendChild(opt);
		}
		
		select.isBool = typeof values == 'boolean';
		if (select.isBool) {
			values = {'true': 1, 'false': 0};
		}
		
		for (var k in values) {
			var opt = document.createElement('option');
			opt.value = values[k];
			opt.textContent = k;
			if (selectionDefault) {
				if (selectionDefault[0] == k) {
					opt.selected = true;
				}
			}
			select.appendChild(opt);
		}
		var optionsDiv = document.getElementById('image-options');
		/*
		if (typeof (optionsDiv) != undefined && typeof (optionsDiv) != null && typeof (optionsDiv) != 'undefined') {
			// console.log('optionsDiv exists');
		}
		else {
			//  create a new option div
			var optionsDivCreate = document.createElement('div');
			optionsDivCreate.id = 'image-options';
			document.body.appendChild(optionsDivCreate);
			// container.appendChild(optionsDivCreate);
			// console.log('optionsDiv NOT exists');
		}
		*/
		optionsDiv.appendChild(container);
	}

	//* DEBUG */ window.console.log('js/global.js loaded...');

	function resizeElement(elementid) {
		// console.log('resizeElement: '+elementid);
		// var thumbnail_width = this.$el.outerWidth();
		var elwidth = $(elementid).width();
		// console.log(elwidth);
		var elheight = $(elementid).height();
		var elfactor = (elheight/elwidth);
		// console.log(elfactor);
		var window_width = $(window).width();
		var window_height = $(window).height();
		var maxheight = $(window).height() / 5*2;
		// console.log(window_width);
		// var remaining = window_width - Math.floor(window_width / 128)  * 128;
		var newwidthwborder = window_width;
		var newheightwfactor = (window_width)*elfactor;
		if (newheightwfactor>maxheight) newheightwfactor = maxheight;
		// console.log(elfactor);
		// this.$el.css('right', remaining / 2);
		// console.log('newwidthwborder '+newwidthwborder);
		$(elementid).css("width", newwidthwborder);
		$(elementid).css("height", newheightwfactor);
		// alert('jup');
	};

	function createVideoPreview(videoObj,videoId,videoUrl,showVideoLength) {
		_thisVideoId = videoId;
		// console.log(videoId);
		// alert(videoUrl);
		_thisVideoUrl = videoUrl;
		// console.log(videoUrl);
		for( vid in _V_.players ){ 
			// console.log('>>> '+vid.toString()); 
			if(vid.toString() == "video_player_1") {
			   delete _V_.players[vid];
			   // console.log('deteleted');
			} 
		}
		var myvideoJS = videojs("video_player_1", { "controls": true, "autoplay": false, "preload": "off" }, function(){});
		var myPlayer = _V_("video_player_1");
		_V_("video_player_1").ready(function(){
			if (_thisVideoUrl.length <= 50) {
				myPlayer.src([
					{ type: "video/mp4", src: "http://prelaunch002.appinaut.de/secure/index.php?showvideo="+_thisVideoUrl+".mp4" },
					{ type: "video/webm", src: "http://prelaunch002.appinaut.de/secure/index.php?showvideo="+_thisVideoUrl+".webm" },
					{ type: "video/ogg", src: "http://prelaunch002.appinaut.de/secure/index.php?showvideo="+_thisVideoUrl+".ogv" }
				]);
			}
			else {
				myPlayer.src([
					{ type: "video/mp4", src: _thisVideoUrl },
					{ type: "video/webm", src: _thisVideoUrl },
					{ type: "video/ogg", src: _thisVideoUrl }
				]);
			}
			// console.log(myPlayer);
			myPlayer.controlBar.hide();  
			myPlayer.bigPlayButton.hide();
			myPlayer.on('timeupdate', function() {
				if (myPlayer.currentTime() > showVideoLength) {
					if (showVideoLength!=0) {
						myPlayer.posterImage.hide();  
						myPlayer.currentTime(0);  
						myPlayer.pause();
						doAlert('Wenn Sie dieses Video kaufen, können Sie mehr als diese Vorschau sehen.','Sie finden das interesant?');
					}
				}
			});
			
		resizeElement('#video_player_1');
		});	
	}

	var app = {
		initialize: function() {
			
			_thisApp = this;
			$.when( _thisApp.fetchMe() ).then(
				  function( deviceisready ) {
					// if(isMobile.any()) {
					$('#body').show();
					showModal();
					if(isPhoneGap()) {
						initStore();
						window.plugins.insomnia.keepAwake();
					}
					else {
						window.system.showtutorial = true;
					}
					$("body").css("-webkit-user-select","none");
					$("body").css("-moz-user-select","none");
					$("body").css("-ms-user-select","none");
					$("body").css("-o-user-select","none");
					$("body").css("user-select","none");
					window.dao.initialize();
					new window.MobileRouter();
				  },
				  function( status ) {
					console.log( "you fail this time" );
				  },
				  function( status ) {
					console.log('still fetchWorking app');
				  }
			);
		},
		/*
		onResume: function() {
			// alert('app resumed');
			// dpd.users.me(function(user) {
			dpd('users').get(window.system.uid, function(me, err) {
				if (user) { }
				else {
					console.log('You are not logged in!');
					window.location.href = "#noaccess";
				}
			});

		},
		*/
		fetchWorking: function() {
			var setTimeoutWatcher = setTimeout(function foo() {
				if ( _thisApp.dfd.state() === "pending" ) {
					// _thisApp.dfd.notify( "working... " );
					setTimeout( _thisApp.fetchWorking, 1000 );
				}
			}, 1 );
		},
		fetchMe: function() {
			_thisApp = this;
			// console.log('fetchMe app');
			_thisApp.dfd = new $.Deferred();
			_thisApp.fetchWorking();
			if(!isMobile.any()) {
				window.setTimeout(function blay() {
					// alert('resolve');
					_thisApp.dfd.resolve(true);
				}, 1000);
			}
			else {
				// document.addEventListener('load', this.onDeviceReady, false);
				// document.addEventListener('offline', this.onDeviceReady, false);
				// document.addEventListener('online', this.onDeviceReady, false);
				if (top.location != self.location) {
					// alert("breaking frame B");
					// cordovaIsLoaded
					top.location.replace(self.location);
					// alert('bla');
				}
				else {
					// alert('mobile and in parent frame');
					if ( isPhoneGap() ) {
						// alert("Running on PhoneGap!");
						document.addEventListener('deviceready', this.receivedEvent, false);
					} else {
						// alert("Not running on PhoneGap!");
						window.setTimeout(function blaz() {
							// alert('resolve on ios');
							_thisApp.dfd.resolve(true);
						}, 1000);
						// this.receivedEvent();
					}
				}
			}
			return this.dfd.promise();
		},
		fetch: function() {	
			_thisApp = this;
			// console.log('fetching _thisApp.js');
		},
		receivedEvent: function(event) {
			// alert('deviceready');
			// var foox = window.setTimeout(function blax() {
			cordovaIsLoaded = true;
			_thisApp.dfd.resolve(true);
			// }, 1000);
			// _thisApp.dfd.resolve(true);		
		}
	};

	function bindSwipeBack() {
		// alert('bindSwipeBack');
		$('#body').off( "swiperight", "#page-content").on( "swiperight", "#page-content", function( e ) {
			e.preventDefault();
			// alert('swiped on body');
			history.back();
			return(false);
		});
	}

	window.addEventListener('load', function () {
		new FastClick(document.body);
	}, false);

	$(window).bind('hashchange', function(){
		showModal();
		modifyiOS7StatusBar();
		checkTopNaviRoles();
		bindSwipeBack();
		showDeleteBar(false);
		$("#flexiblecontent").animate({
			marginLeft: "0px",
		}, 500, function () {
			menuStatus = false;
			menuSwitched(false);
		});
	});

	$('body').off('click','#closewelcomepopupbtn').on('click','#closewelcomepopupbtn',function(e) { 
		e.preventDefault();
		setTimeout(function() {
			$( "#welcomepopup" ).popup( "close" );
		},1);
	});
	
	// $( "#tutorialpopup" ).popup( "open", {transition: 'fade'} );
	$( "#welcomepopup" ).bind({
		popupafterclose: function(event, ui) { 
			$( "#tutorialpopup" ).popup( "open", {transition: 'fade'} );
		}
	});

	$('body').off('click','#closepopupbtn').on('click','#closepopupbtn',function(e) { 
		e.preventDefault();
		setTimeout(function() {
			$( "#tutorialpopup" ).popup( "close" );
			window.system.showtutorial = false;
		},1);
	});
	
	$('body').off('click','#showPageOptionsLink').on('click','#showPageOptionsLink',function(e) { 
		e.preventDefault();
		// alert('bla');
		showPageOptions();
		checkTopNaviRoles();
	});
	
	
	$('body').off( "swipeleft", ".swipeToDelete").on( "swipeleft", ".swipeToDelete", function( e ) {
	// $('body').off( "click", ".swipeToDelete").on( "click", ".swipeToDelete", function( e ) {
		e.preventDefault();
		// alert('swiped on element');
		var listitem = $(this);
		deleteMessageSwitch(listitem);
	});
	
	function deleteMessageSwitch(el) {
		var listitem = el;
		el.toggleClass( 'ui-btn-up-d' );
		var selected = 0;
		$('.swipeToDelete').each(function () {
			if ($(this).hasClass( "ui-btn-up-d" )) {
				selected = selected + 1;
			}
		});
		if (selected>0) showDeleteBar(true);
		else showDeleteBar(false);
	}

	$('body').off( "click", ".deleteBarLink").on( "click", ".deleteBarLink", function( e ) {
		e.preventDefault();
		// alert('swiped on element');
		doConfirm('Der Eintrag kann nicht wiederhergestellt werden!', 'Wirklich löschen?', function (clickevent) { 
			if (clickevent=="1") {
				$.when( deleteMessageFlow() ).done(
					function( result ) {
						console.log('end deleteMessageFlow');
					}
				);
			}
		}, "Ja,Nein");
	});
	
	/*
	$('abody').off( "swipeleft", ".swipeToDelete").on( "swipeleft", ".swipeToDelete", function( e ) {
		e.preventDefault();
		// alert('swiped on element');
		var listitem = $(this);
		doConfirm('Der Eintrag kann nicht wiederhergestellt werden!', 'Wirklich löschen?', function (clickevent) { 
			if (clickevent=="1") {
				deleteMessageFlow(listitem);
			}
		}, "Ja,Nein");
	});
	*/
	
	function deleteMessageFlow() {
		// alert('deleteMessageFlow');
		// alert('deleteMessageFlow');
		showModal();
		var deferred = $.Deferred();
		var count = 0;
		$('.swipeToDelete').each(function () {
			// aaa
			// console.log($(this).attr('class'));
			var this_id = $(this).attr('data-id');
			$(this).remove();
			var this_cat = $(this).attr('data-cat');
			if ($(this).hasClass( "ui-btn-up-d" )) {
				// selected = selected + 1;
				// console.log('deleting flow id: '+this_id);
				dpd.messages.get(this_id, function (result) {
					// console.log(result);
					var query = { $or:[{"sender":result.receiver,"receiver":result.sender}  ,  {"sender":result.sender,"receiver":result.receiver}] };
					dpd.messages.get(query, function (messages) {
						// console.log();
						// $.each( messages, function( key, message ) {
						for(key = 0; key < messages.length; key++) {
							var message = messages[key];
							// console.log(key);
							// console.log(message);
							dpd.messages.del(message.id, function (err) {
								count++;
								if(err) {
									if (count==messages.length) deleteMessageFlowDone();
								}
								else {
									if (count==messages.length) deleteMessageFlowDone();
								}
							});
						}
						// $('#MessagesNestedViewDiv').html('');
						// window._thisMessagesViewNested.fetch();
					});
				});
			}
		});
		// deferred.resolve(count);
		// window._thisMessagesViewNested.fetch();
		// return deferred.promise();
		// alert(this_id);
	}
	
	function deleteMessageFlowDone() {
		console.log('done');
		hideModal();
		window._thisMessagesViewNested.fetch();
		showDeleteBar(false);
	}
	
	
	
	bindSwipeBack();
	$('body').off( "click", ".messagesendbutton").on( "click", ".messagesendbutton", function( e ) {
		e.preventDefault();
		// alert('bla');
		$("#newmessageform").submit();
	});

	$('body').off( "submit", ".newmessageform").on( "submit", ".newmessageform", function( e ) {
		e.preventDefault();
		// alert('foo');
		// var data = $('.newmessageform').serialize();
		// console.log(data);
		if($('#messagetextarea').val().length==0) return(false);
		var sender = window.me.id;
		var receiver = $('#receiver').val();
		if (receiver=='') {
			doAlert('Es ist kein Empfänger definiert...','Ups. Entschuldigung!');
			return(false);
		}
		var content = $('#messagetextarea').val();
		// console.log(sender);
		// console.log(receiver);
		// console.log(content);
		// var cdate = dateYmdHis();
		// alert(getTimestamp());
		$('.newmessageform').css({'opacity':'0.6'});
		$('#messagesendbutton').addClass( 'ui-disabled' );
		$('#messagetextarea').addClass( 'ui-disabled' );
		// alert(sender);
		// alert(receiver);
		// alert(content);
		// alert(system.timestamp);
		var postvals = {sender: sender, receiver: receiver, content: content, cdate: system.timestamp};
		dpd.messages.post(postvals, function(result, err) {
			if(err) {
				$('#messagesendbutton').removeClass( 'ui-disabled' );
				$('#messagetextarea').removeClass( 'ui-disabled' );
				$('.newmessageform').css({'opacity':'0.7'});
				alert(err.message);
				return console.log(err);
			}
			$('.newmessageform').css({'opacity':'0.7'});
			$('#messagesendbutton').removeClass( 'ui-disabled' );
			$('#messagetextarea').removeClass( 'ui-disabled' );
			$('#messagetextarea').val( '' );
			$('#messagesendbutton').css({'color':'#707070'});
			$('#messagetextarea').css({'max-height':'40px'});
			// console.log(result, result.id);
		});
		return(false);
	});
	
	/*
	$('#page-content').scroll(function () {
		$('.newmessageform').each(function () {
			// $(this).height();
			// $(this).css({'position':'fixed'});
			$(this).css({'bottom':'0px'});
			// $(this).css({'opacity':'0.7'});
		});
	});
	*/
	
	// resize:false;height: 40px !important;

	function checkTextareaValue() {
		// console.log($('#messagetextarea').val().length);
		if ($('#messagetextarea').val() && $('#messagetextarea').val().length > 0) {
			// console.log('b');
			$('#messagesendbutton').css({'color':'#0645AD'});
			// $('#messagesendbutton').removeClass( 'ui-disabled' );
		}
		else {
			// console.log('c');
			$('#messagesendbutton').css({'color':'#707070'});
			// $('#messagesendbutton').addClass( 'ui-disabled' );
		}
	}
	
	
	$('#body').off( "keyup", "#messagetextarea").on( "keyup", "#messagetextarea", function( e ) {
		/*
		if (e.which == 13) {
			e.preventDefault();
			return(false);
		}
		*/
		e.preventDefault();
		// console.log('keyup');
		$('.newmessageform').css({'opacity':'0.9'});
		var txt = $('#messagetextarea').val();
		$('#messagetextarea').val(txt.replace(/[\n\r]+/g, ""));
		$('#newmessageform').css({'bottom':'0px'});
		$('#page-content').stop().animate({
		  scrollTop: $("#page-content")[0].scrollHeight
		}, 1000);
		
		// $('#messagetextarea').css({'height':''});
		// console.log($(this));
		// console.log($('#messagetextarea').val());
		checkTextareaValue();
	});
	
	$('#body').off( "focus", "#messagetextarea").on( "focus", "#messagetextarea", function( e ) {
		e.preventDefault();
		$('.newmessageform').css({'opacity':'0.9'});
		$('#messagetextarea').css({'max-height':'80px'});
		checkTextareaValue();
		// console.log(o);
		// $('#messagetextarea').height(0);
		// console.log(e.currentTarget.height());
		// $('#messagesendbuttondiv').show();
		$('#page-content').stop().animate({
		  scrollTop: $("#page-content")[0].scrollHeight
		}, 1000);
		// console.log('focussed textarea');
	});
	$('#body').off( "blur", "#messagetextarea").on( "blur", "#messagetextarea", function( e ) {
		e.preventDefault();
		$('.newmessageform').css({'opacity':'0.7'});
		// $('#messagetextarea').css({'max-height':'40px'});
		checkTextareaValue();
		// hideKeyboard();
		// $('#messagetextarea').height(40);
		// $('#messagetextarea').css("height","20px");
		// $( '#messagetextarea' ).height( 20 );
		// console.log($('#messagetextarea'));
		// $('#messagesendbuttondiv').hide();
		// console.log('blurred textarea');
	});
	
	/*
	$('#body').off( "keyup", "#messagetextarea").on( "keyup", "#messagetextarea", function( event ) {
		if (event.keyCode == 13) {
			event.preventDefault();
			console.log('keyup');
			return(false);
		}
	});
	*/
	
	$(document).on('click', ".external", function (e) {
		e.preventDefault();
		// alert('bla');
		var targetURL = $(this).attr("href");
		window.open(targetURL, "_system");
	});

	// $(window).bind('resize', function() {
	$(window).resize(function() {
		// fontResize();
	});
	
	 
	function checkTopNaviRoles() {
		// alert('foo');
		// dpd.users.me(function(me) {
		 try {
			$( "#pageOptions li" ).each(function(index, value) {
				var lirole = $(this).attr('data-roles');
				// console.log(value);
				// console.log(lirole);
				// console.log(checkRole(lirole));
				if (lirole == '' || lirole == 'public' || lirole == undefined) { 
					$(this).css('visibility','visible');
					$(this).css('display','block');
				}
				else {
					if (lirole != undefined) {
						//  && checkRole(lirole)==true
						// var bla = checkRole(lirole);
						// alert(bla);
						if (checkRole(lirole)==true) {
							$(this).css('visibility','visible');
							$(this).css('display','block');
						}
						else {
							$(this).css('visibility','hidden');
							$(this).css('display','none');
						}
					}
				}
			});
		// });
		} catch (e) {
			// alert(e);
			// $( "#showPageOptions" ).hide();
		}

	}

	function checkRole(role) {
		var show = false;
		if ($.inArray('user', window.me.roles) > -1) show = true;
		// if (role=='provider' || role=='seeker') show = true;
		// else 
		else if (window.me.roles!=undefined) {
			$.each( window.me.roles, function( key, value ) {
				if (role==value) {
					show = true;
					return(show);
				}
			});
		}
		return(show);
	}
	function checkRoles(smroles) {
		var show = false;
		$.each( smroles, function( keysm, rolesm ) {
			if (checkRole(rolesm)==true) {
				show = true;
				return(show);
			}
		});
		return(show);
	}
	
	function checkAppConfig(role) {
		var show = false;
		console.log(role);
		if (role=='user') show = true;
		else if (window.system.owner.appviews!=undefined) {
			console.log(window.system.owner.appviews);
			$.each( window.system.owner.appviews, function( key, value ) {
				if (role==value) {
					console.log(role+' ?= '+value);
					show = true;
					return(show);
				}
			});
		}
		return(show);
	}
	function checkAppConfigs(roles) {
		var show = false;
		if (window.system.owner.appviews!=undefined) {
			$.each( roles, function( key, role ) {
				if (checkAppConfig(role)==true) {
					show = true;
					return(show);
				}
			});
		}
		return(show);
	}
	
	$('#footervideolink').on("vclick", function (e) {
		// report('footer clicked');
		if (footervideoStatus != true) {
			$("#footer").animate({
				height: "40%",
			}, 500, function () {
				footervideoStatus = true;
			});
		}
		else {
			$("#footer").animate({
				height: "20px",
			}, 500, function () {
				footervideoStatus = false;
			});
		}
		return false;
	});

	$('#showMenu').on("click", function (e) {
		e.preventDefault();
		if (menuStatus != true) {
			$("#flexiblecontent").animate({
				marginLeft: "220px",
			}, 500, function () {
				menuStatus = true;
				menuSwitched(true);
			});
		} else {
			$("#flexiblecontent").animate({
				marginLeft: "0px",
			}, 500, function () {
				menuStatus = false;
				menuSwitched(false);
			});
		}
		return false;
	});
	$('#sidebarListViewDiv').on("vclick", "#menuelement a.contentLink", function (event) {
		event.preventDefault();
		$("#flexiblecontent").animate({
			marginLeft: "0px",
		}, 500, function () {
			menuStatus = false;
			menuSwitched(false);
			// console.log(event.target.hash);
			// system.redirectToUrl(event.target.hash);
			// console.log(event);
			// console.log(event.target.getAttribute('data-href'));
			var tgt = event.target.getAttribute('data-href');
			var type = event.target.getAttribute('data-type');
			// alert(tgt);
			// console.log(tgt);
			// .getAttribute('data-fruit');
			// window.location.href = event.target.hash;
			if (type=="popup") {
				$( ""+tgt ).popup().trigger('create').css("height","auto").css("width","auto");
				$( ""+tgt ).popup().trigger('create').css("max-height","300").css("max-width","auto");
				$( ""+tgt ).popup( "open", {transition: 'fade'} );
			}
			else window.location.href = tgt;
			// alert('getURLParameter(window.location.href): ' + getURLParameter(window.location.href));
			// $.mobile.changePage( "#aboutus", { transition: "slideup", changeHash: true });
			// $.mobile.changePage( "#aboutus" , { reverse: false, changeHash: false } );
		});
	});

	var menuSwitched = function(status) {
		var menuSwitchedDeferred = $.Deferred();
		var menuSwitchedDeferredWatcher = menuSwitchedDeferred.then(function( value ) {
			return status;
		});
		menuSwitchedDeferred.resolve();
		menuSwitchedDeferredWatcher.done(function( value ) {
			// alert(value);
			// console.log(value);
		});
	};

	function showModal() {
		// if ($('.modalWindow')) return(false);
		// console.log('showModal');
		window.system.modaltimeout = 5000;
		window.clearInterval(window.modaltimeoutvar);
		window.modaltimeoutvar = window.setInterval(function() {
			// console.log(window.system.modaltimeout);
			window.system.modaltimeout = window.system.modaltimeout - 1000;
			if (window.system.modaltimeout<=0) {
				var breaktoDashboardText = '<br>Die Aktion<br>dauert ungewöhnlich lange.<br><br><u style="cursor:pointer;">ausblenden</u>';
				$('#breaktoDashboard').html(breaktoDashboardText);
				$('#breaktoDashboard').show();
				window.clearInterval(window.modaltimeoutvar);
				window.system.modaltimeout = 5000;
			}
		},1000);
		$("#body").append('<div class="modalWindow"/>');
		var breakLoading = '';
		// if (window.system.contentHelper==1) breakLoading = 'ausblenden';
		breakLoading = 'ausblenden';
		$.mobile.loading( 'show', { theme: 'b', textVisible: true, textonly: true, html: '<div class="blink_me" style="text-align:center;float:none;clear:both;">APPinaut lädt...</div><div id="modaltxt" style="text-align:center;float:none;clear:both;"></div><div id="modaltxt" style="text-align:center;float:none;clear:both;color:#909090;"><a class="breaktoDashboard" id="breaktoDashboard" style="display:none;">'+breakLoading+'</a></div>' });
		$(".breaktoDashboard").off('click').on('click',function(event){
			// alert('bla');
			hideModal();
			// window.location.href = '#dashboard';
		});
		// $('#sidebarListViewDiv').on("vclick", "#menuelement a.contentLink", function (event) {
		// $('#sidebarListViewDiv').on("vclick", "#menuelement a.contentLink", function (event) {
		// setTimeout('hideModal()', 60000);
	}

	function hideModal() {
		window.clearInterval(window.modaltimeoutvar);
		window.system.modaltimeout = 0;
		$(".modalWindow").remove();
		$.mobile.loading( 'hide' );
	}

	window.system = {
		master: window.master,
		kdnr: window.kdnr,
		owner: new Object(),
		appoptions: new Array(),
		me: new Object(),
		aoid: window.aoid,
		uid: window.uid,
		showtutorial: false,
		contentHelper: 0,
		timestamp: 0,
		modaltimeout: 0,
		videolength: 0,
		// this.routerSwitched(false);
		toggleLoading: function(status) {
			console.log(status);
			if (status==true) showModal();
			else {
				hideModal();
			}
		},
		redirectToUrl: function(targetUrl) {
			var url = targetUrl;
			// IE8 and lower fix
			if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
				var referLink = document.createElement("a");
				referLink.href = url;
				document.body.appendChild(referLink);
				referLink.click();
			}
			// All other browsers
			else { 
				window.location.replace(url); 
			}
		}
	}
	
	
	function getOwnerData() {
		// get owner data and roles
		$.ajax('http://dominik-lohmann.de:5000/users/?kdnr='+window.system.kdnr,{
			type:"GET",
			async: false,
		}).done(function(result) {
			var owner = result[0];
			window.system.app = {title:owner.slogan, calltoaction:"Registrieren oder Einloggen um zu entdecken"};
			window.system.owner = owner;
			window.system.aoid = owner.id;
			window.system.master = owner.master;
		});
	}
	getOwnerData();

	function getAppOptions() {
		// get app data and roles
		$.ajax('http://dominik-lohmann.de:5000/appoptions/',{
			type:"GET",
			async: false,
		}).done(function(result) {
			window.system.appoptions = result[0];
		});
	}
	getAppOptions();

	/*
	function checkLogin() {
		// get owner data and roles
		$.ajax('http://dominik-lohmann.de:5000/users/?kdnr='+window.system.kdnr,{
			type:"GET",
			async: false,
		}).done(function(result) {
			var owner = result[0];
			window.system.app = {title:owner.slogan, calltoaction:"Registrieren oder Einloggen um zu entdecken"};
			window.system.owner = owner;
			window.system.aoid = owner.id;
			window.system.master = owner.master;
		});
	}
	*/

	// alert(system.contentHelper);

	function checkEmail(email){
	  // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  var regex = /^[a-zA-Z0-9]+$/;
	  // /^\w+$/;
	  return regex.test(email);
	}

	function checkString(str){
	  // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  var regex = /^[a-zA-Z0-9_.+-\@]+$/;
	  // /^\w+$/;
	  return regex.test(str);
	}

	// var showPageOptionsIconDeg = 0;
	function rotatePageOptionsIcon() {
		// window.showPageOptionsIconDeg += 180;
		// $("#showPageOptionsIcon").css({'transform': 'rotate('+window.showPageOptionsIconDeg+'deg)'});
	}

	function showPageOptions() {
		// alert('roles');
		// alert(roles);
		
		$( "#pageOptions" ).toggle( "fast", function() {
			// $( "#page-content" ).toggle();
			// $( "#showPageOptionsIcon" ).rotate({animateTo:360});
			// rotatePageOptionsIcon();
			// Animation complete.
			// alert('done!');
		});
		/*
		1000,function() {
			$(this).css("border", "2px red inset")
			.filter(".middle")
			.css("background", "yellow")
			.focus();
			$("div").css("visibility", "hidden");
		});
		*/
	}

	/*
	$("#body > *").off('click').on('click',function(event){
		// event.preventDefault();
		// window.location.href = event.currentTarget.hash;
		console.log(event);
		console.log(event.currentTarget.attributes);
		alert(event.currentTarget.id);
		alert(event.currentTarget);
	});
	*/

	function dateYmdHis() {
		var date = new Date();
		var s = date.getSeconds();
		var i = date.getMinutes();
		var H = date.getHours();
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		var val = '' + y + '' + (m<=9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d) + '' + (H<=9 ? '0' + H : H)  + '' + (i<=9 ? '0' + i : i)  + '' + (s<=9 ? '0' + s : s);
		return(val);
	}

	function dateYmdHisToGerman(date) {
		// var s = date.getSeconds();
		// var i = date.getMinutes();
		// var H = date.getHours();
		// var d = date.substr(6,2);
		if (date==undefined) date = "??????????????";
		var d = (undefined ? "" : date.substr(6,2));
		var m = (undefined ? "" : date.substr(4,2));
		var y = (undefined ? "" : date.substr(0,4));
		// var val = '' + y + '' + (m<=9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d) + '' + (H<=9 ? '0' + H : H)  + '' + (i<=9 ? '0' + i : i)  + '' + (s<=9 ? '0' + s : s);
		var val = '' + d + '.' + m + '.' + y;
		return(val);
	}

	/*
	function handleOpenURL(url) {
	  setTimeout(function() {
		// alert("received url: " + url);
		alert("received url");
	  }, 0);
	}
	*/

	function are_arrs_equal(arr1, arr2){
		return arr1.sort().toString() === arr2.sort().toString()
	}

	/**
	 * Tests two data structures for equality
	 * @param {object} x
	 * @param {object} y
	 * @returns {boolean}
	 */
	var equal = function(x, y) {
		if (typeof x !== typeof y) return false;
		if (x instanceof Array && y instanceof Array && x.length !== y.length) return false;
		if (typeof x === 'object') {
			for (var p in x) if (x.hasOwnProperty(p)) {
				if (typeof x[p] === 'function' && typeof y[p] === 'function') continue;
				if (x[p] instanceof Array && y[p] instanceof Array && x[p].length !== y[p].length) return false;
				if (typeof x[p] !== typeof y[p]) return false;
				if (typeof x[p] === 'object' && typeof y[p] === 'object') { if (!equal(x[p], y[p])) return false; } else
				if (x[p] !== y[p]) return false;
			}
		} else return x === y;
		return true;
	};

	function elementResizeByScreenHeight() {
		var screenheight = $(window).height();
		$('.elementResizeByScreenHeight').each(function( index, bla ) {
			var percentheight = $(this).attr('data-percentheight');
			$(this).css("height", (screenheight*percentheight/100)+"px");
		});
	}

	function fontResize() {
		// alert('font-resizing');
		//Set default resolution and font size
		// var resolution = 1024;
		// var height = 1024;
		var height = $(window).height();
		var width = $(window).width();
		
		var font = 10;
		//Get window width

		//Set new font size
		var fullpixel = width*height;
		// alert(width);
		// alert(height);
		// alert(fullpixel);
		// 150000
		var factor = (fullpixel/180000);
		// alert(factor);
		if (factor<0.8) factor = 0.8;
		if (factor>1.4) factor = 1.4;
		var newFont = font * factor;
		/*
		$('#body').each(function( index ) {
			// alert($(this).css('font-size').substr($( this ).css('font-size').len-2,2));
			if ($(this).css('font-size').substr($( this ).css('font-size').len-2,2)>22 || newFont>22) newFont = 22;
			// $('body').css('font-size', newFont);
			$( this ).css('font-size', newFont);
			// alert($(this).css('font-size'));
			// alert(newFont);
		});
		*/	
		$('.resizetext').each(function( index, bla ) {
			// alert($(this).html());
			var font = $(this).css('font-size').substr($( this ).css('font-size').len-2,2);
			newFont = font*factor;
			if (newFont<12) newFont = 12;
			if (newFont>24) newFont = 24;
			// alert(newFont);
			$(this).css("font-size", newFont+"px");
		});
		
		
	};

	function getTimestamp() {
		alert(system.timestamp);
	}

	function agetTimestamp() {
		navigator.geolocation.getCurrentPosition(TSonSuccess, TSonError);
	}
	var TSonSuccess = function(position) {
		/*
		alert('Latitude: '          + position.coords.latitude          + '\n' +
			  'Longitude: '         + position.coords.longitude         + '\n' +
			  'Altitude: '          + position.coords.altitude          + '\n' +
			  'Accuracy: '          + position.coords.accuracy          + '\n' +
			  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			  'Heading: '           + position.coords.heading           + '\n' +
			  'Speed: '             + position.coords.speed             + '\n' +
			  'Timestamp: '         + new Date(position.timestamp)      + '\n');
		alert(position.timestamp);
		*/
		return(position.timestamp);
	};

	// onError Callback receives a PositionError object
	//
	function TSonError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}

	function scrollBottom() {
		// $('#page-content').stop().animate({
		setTimeout(function() {
			$('#page-content').animate({
				scrollTop: $("#page-content")[0].scrollHeight
			}, "fast", function() {
				// animation done
				$('#page-content').focus();
			});
		}, 1000);
	}

	var showDeleteBar = function(status) {
		var deleteBarDeferred = $.Deferred();
		var deleteBarDeferredWatcher = deleteBarDeferred.then(function( value ) {
			return status;
		});
		deleteBarDeferred.resolve();
		deleteBarDeferredWatcher.done(function( value ) {
			if (value==true) {
				$('#deleteBar').show();
				$('.ui-listview-filter').hide();
				// alert(value);
			}
			else {
				$('#deleteBar').hide();
				$('.ui-listview-filter').show();
			}
			// console.log(value);
		});
	};

} catch (e) {
	console.log('error in js script');
}