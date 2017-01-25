'use strict';

/* Adlib API Query Services Module */

var RestConfig = {
    "baseURL":"https://wksrest.hephaistos.arz.oeaw.ac.at/",
    "pagesize": 40,
    "sortField":"title",
    "sortOrder":"ascending",
    "currentView":"list",
    "localStorage":"WKSStorage",
    "geoNamesID":"oeaw_adlib"
}

var MongoDBservices = angular.module('MongoDBservices', ['ngStorage']);
MongoDBservices.service('mongorest', ['$http', '$localStorage' ,function($http,$localStorage){
	if(!$localStorage[RestConfig.localStorage]) $localStorage[RestConfig.localStorage] = {};
	if($localStorage[RestConfig.localStorage]['history']) var history = $localStorage[RestConfig.localStorage]['history'];
	else {
		var obj = {"history":{"querystring":[],"query":[],"result":[]}}
		$localStorage[RestConfig.localStorage] = obj;
		var history = $localStorage[RestConfig.localStorage]['history'];
	}
	var pagesize = RestConfig.pagesize;
	var sortField = RestConfig.sortField;
	var sortOrder = RestConfig.sortOrder;
	//////////Parameter Parsers///////////////////////////////
		var parseFields = function(fields){
			var fieldstring = "";
			if(fields && fields != []) {
				fieldstring +="&fields=";
				fields.forEach(function(field){
					fieldstring += field+",%20"
				})
			}
			return fieldstring;
		}
		var parseLimit = function(limit,page){
			var limitstring = "";
			if (!limit) var limit = this.pagesize;
			if (!page) var page = 1;
			var skip = (page-1) * limit + 1;
			limitstring = "&limit="+limit+"&startfrom="+skip;
			return limitstring;
		}
		var parseSorting = function(){
			var sortString = "";
			return "%20sort%20"+this.sortField+"%20"+this.sortOrder;
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
		var updateSize = function(newsize){console.log('updateSize: ', newsize);
			this.pagesize = newsize;
			$localStorage[RestConfig.localStorage]['history']['result'] = [];
			this.history = $localStorage[RestConfig.localStorage]['history'];
		};
		var updateSorting = function(sort, field){console.log('updateSorting: ', sort, field);
			this.sortOrder = sort;
			this.sortField = field;
			this.history.result = [];
		}
	///////////////// return Object //////////////////////////////////////////
	return {
		parseFields: parseFields,
		parseLimit: parseLimit,
		parseSorting: parseSorting,
  	getDBList: getDBList,
    getCollList: getCollList,
    getColl: getColl,
    getDoc: getDoc,
  	updateHistory: updateHistory,
  	clearHistory: clearHistory,
  	updatePage: updatePage,
  	updateSize: updateSize,
  	pagesize: pagesize,
  	updateSorting: updateSorting,
  	sortField: sortField,
  	sortOrder: sortOrder,
		history: history
  	};
}]);

///////////////// GeoNames Service Module
//TODO: move to separate file
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
