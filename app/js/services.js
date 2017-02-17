'use strict';

/* MongoDB Services Module */

var RestConfig = {
    "baseURL":"https://wksrest.hephaistos.arz.oeaw.ac.at/",
    "localStorage":"MongoRestStorage"
}

var MongoDBservices = angular.module('MongoDBservices', ['ngStorage']);
MongoDBservices.service('mongorest', ['$http', '$localStorage', '$q',function($http,$localStorage, $q){
	//////////Callable retrieval functions///////////////////////////////
    this.initStorage = function(){console.log('initializing local storage');
      if($localStorage[RestConfig.localStorage] && $localStorage[RestConfig.localStorage]['history'] && $localStorage[RestConfig.localStorage]['session']) var s = $localStorage[RestConfig.localStorage];
      else {
        $localStorage[RestConfig.localStorage] = {};
        $localStorage[RestConfig.localStorage]['history'] = {"querystring":[],"query":[],"result":[]};
        $localStorage[RestConfig.localStorage]['session'] = {"token":"","exp":"","user":""};
        var s = $localStorage[RestConfig.localStorage];
      }
      return s;
    }
    this.restLogin = function(user, password){console.log('logging in as user ', user);
      var that = this;
      if(user && password) {
        return $q(function(resolve,reject) {
          var req = $http.post(RestConfig.baseURL+"login", {username: user, password: password}, {headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, withCredentials : false});
            req.then(function(res){
              that.s.session.token = res.data.token;
              that.s.session.exp = res.data.created;
              resolve(res.data);
            },
            function(err){
              reject(err);
            }
          )
        });
      }
    }
    this.logout = function(){
      $localStorage[RestConfig.localStorage]['session'] = {"token":"","exp":"","user":""};
    }
    this.auth = function(){
      if(this.s.session.token != "") return true;
      else return false;
    }
    this.parseToken = function(){

    }
		this.getDBList = function(){console.log('getDBList Query: ', RestConfig.baseURL);
			return $http.get(RestConfig.baseURL+"dbs");
		}
    this.getCollList = function(db){console.log('getCollectionList Query: ', RestConfig.baseURL, db);
			return $http.get(RestConfig.baseURL+db);
		}
    this.getColl = function(db, collection){console.log('getCollection Query: ', RestConfig.baseURL, db, collection);
			return $http.get(RestConfig.baseURL+db+"/"+collection);
		}
    this.getDoc = function(db, collection, docid){console.log('getDocument Query: ', RestConfig.baseURL, db, collection, docid);
      return $http.get(RestConfig.baseURL+db+"/"+collection+"/"+docid);
    }
	//////////// Parameter getters / setters ///////////////////////////////
		this.updateHistory = function(string, query, page, result){console.log('addtoHistory: ', query, result);
			this.history.querystring.unshift(string);
			this.history.query.unshift(query);
			if(page && result) {
				var obj = {};
				obj[page] = result;
				this.history.result.unshift(obj);
			}
			else this.history.result.unshift({});
		}
		this.clearHistory = function(){console.log('clearing History upon user request.');
			$localStorage[RestConfig.localStorage]['history'] = {};
			this.s = $localStorage[RestConfig.localStorage];
		}
		this.updatePage = function(queryno, page, result){console.log('updatePage: ', queryno, page, result);
			if(this.history.result[queryno]) {
				this.history.result[queryno][page] = result;
			}
			else {
				var obj = {};
				obj[page] = result;
				this.history.result[queryno] = obj;
			}
		}
    this.s = this.initStorage();
    console.log(this.s);
}]);

var GooseConfig = {
    "baseURL":"https://wksrest.hephaistos.arz.oeaw.ac.at/",
    "pagesize": 40,
    "sortField":"title",
    "sortOrder":"ascending",
    "currentView":"list",
    "localStorage":"MongooseStorage",
}
MongoDBservices.service('mongoose', ['$http', '$localStorage' ,function($http,$localStorage){
	if(!$localStorage[RestConfig.localStorage]) $localStorage[RestConfig.localStorage] = {};
	if($localStorage[RestConfig.localStorage]['history']) var history = $localStorage[RestConfig.localStorage]['history'];
	else {
		var obj = {"history":{"querystring":[],"query":[],"result":[]}}
		$localStorage[RestConfig.localStorage] = obj;
		var history = $localStorage[RestConfig.localStorage]['history'];
	}
	//////////Callable retrieval functions///////////////////////////////
		var getDBList = function(){console.log('getDBList Query: ', RestConfig.baseURL);
			return $http.get(RestConfig.baseURL+"dbs");
		}
    var getCollList = function(db){console.log('getCollectionList Query: ', RestConfig.baseURL, db);
			return $http.get(RestConfig.baseURL+db);
		}
    var getColl = function(db, collection){console.log('getCollection Query: ', RestConfig.baseURL, db, collection);
			return $http.get(RestConfig.baseURL+db+"/"+collection);
		}
    var getDoc = function(db, collection, docid){console.log('getDocument Query: ', RestConfig.baseURL, db, collection, docid);
      return $http.get(RestConfig.baseURL+db+"/"+collection+"/"+docid);
    }
  /////////////Callable Parser functions
  var mapSchema = function(schemaObj, path){
    var o = {};
    for(var key in schemaObj){
      var cpath = path.slice();
      //simple property
      if(schemaObj[key].type) {
        o[key] = schemaObj[key];
        o[key]['repeatable'] = false;
        o[key]['path'] = path.join('.');
      }
      //repeatable property
      if(angular.isArray(schemaObj[key]) && schemaObj[key][0].type) {
        o[key] = schemaObj[key][0];
        o[key]['repeatable'] = true;
        o[key]['path'] = path;
      }
      //nested object
      else if(!angular.isArray(schemaObj[key]) && !schemaObj[key].type){
        cpath.push(key);
        o[key] = this.mapSchema(schemaObj[key],cpath);
        o[key]['repeatable'] = false;
        o[key]['path'] = path;
      }
      //repeatable nested object
      else if(angular.isArray(schemaObj[key]) && !schemaObj[key][0].type){
        cpath.push(key);
        o[key] = this.mapSchema(schemaObj[key][0],cpath);
        o[key]['repeatable'] = true;
        o[key]['path'] = path;
      }
    }
    return o;
  }
  var parseObject = function(mapObj){
    var m = {};
    for(var key in mapObj){
      //simple property
      if(mapObj[key].type && !mapObj[key].repeatable) {
        delete mapObj[key].repeatable;
        delete mapObj[key].path;
        m[key] = mapObj[key];
      }
      //repeatable property
      if(mapObj[key].type && mapObj[key].repeatable) {
        delete mapObj[key].repeatable;
        delete mapObj[key].path;
        m[key] = [mapObj[key]];
      }
      //nested object
      else if(!mapObj[key].type && !mapObj[key].repeatable){
        delete mapObj[key].repeatable;
        delete mapObj[key].path;
        m[key] = this.parseObject(mapObj[key]);
      }
      //repeatable nested object
      else if(!mapObj[key].type && mapObj[key].repeatable){
        delete mapObj[key].repeatable;
        delete mapObj[key].path;
        m[key] = [this.parseObject(mapObj[key])];
      }
    }
    return m;
  }
	//////////// Parameter getters / setters ///////////////////////////////
		var updateHistory = function(string, query, page, result){console.log('addtoHistory: ', query, result);
			this.history.querystring.unshift(string);
			this.history.query.unshift(query);
			if(page && result) {
				var obj = {};
				obj[page] = result;
				this.history.result.unshift(obj);
			}
			else this.history.result.unshift({});
		}
		var clearHistory = function(){console.log('clearing History upon user request.');
			$localStorage[RestConfig.localStorage]['history'] = {"querystring":[],"query":[],"result":[]};
			this.history = $localStorage[RestConfig.localStorage]['history'];
		}
		var updatePage = function(queryno, page, result){console.log('updatePage: ', queryno, page, result);
			if(this.history.result[queryno]) {
				this.history.result[queryno][page] = result;
			}
			else {
				var obj = {};
				obj[page] = result;
				this.history.result[queryno] = obj;
			}
		}
	///////////////// return Object //////////////////////////////////////////
	return {
  	getDBList: getDBList,
    getCollList: getCollList,
    getColl: getColl,
    getDoc: getDoc,
    mapSchema: mapSchema,
    parseObject: parseObject,
  	updateHistory: updateHistory,
  	clearHistory: clearHistory,
  	updatePage: updatePage,
		history: history
  	};
}]);



///////////////// GeoNames Service Module
var GeoNamesServices = angular.module('GeoNamesServices', ['ngStorage']);

GeoNamesServices.service('GeoNamesServices', ['$http', '$localStorage', '$q', function($http, $localStorage, $q){
	if(!$localStorage[Config.localStorage]) $localStorage[Config.localStorage] = {};
	if($localStorage[Config.localStorage]['geocache']) var geocache = $localStorage[Config.localStorage]['geocache'];
	else {
		$localStorage[Config.localStorage]['geocache'] = {};
		var geocache = $localStorage[Config.localStorage]['cache'];
	}
	var getByID = function(id){console.log('GeoNames getByID: ', id);
		if(Number.isInteger(parseInt(id)) && (!this.geocache[id] || !this.geocache[id]['$$status'])) {
			var promise = $http.get("http://api.geonames.org/getJSON?formatted=true&geonameId="+id+"&username="+Config.geoNamesID);
			return promise;
		}
		if(id && this.geocache.id) return this.geocache.id;
		if(!Number.isInteger(id)) return $q.reject("invalid Parameters");
	}
	var addtoCache = function(ID, promise){console.log('addtoCache', promise);
		if(ID && promise ){
			this.geocache[ID] = promise;
		}
	}
	var clearCache = function(){console.log('clearing geocache upon user request');
		if($localStorage[Config.localStorage]['geocache']) $localStorage[Config.localStorage]['geocache'] = {};
		this.geocache = $localStorage[Config.localStorage]['geocache'];
	}
	return {
	  	getByID: getByID,
	  	addtoCache: addtoCache,
	  	geocache: geocache,
	  	clearCache: clearCache
  	};
}]);
