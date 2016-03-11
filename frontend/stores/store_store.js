var AppDispatcher = require('../dispatcher/dispatcher');
var StoreConstants = require('../constants/store_constants');
var Store = require('flux/utils').Store;

var StoreStore = new Store(AppDispatcher);

_location = {};
_store = {};
_yelp = {};
_comparison = {};
_getMost = [];
_map = [];
_mostVisited = [];
_trending = [];
_browse = [];
_filters = [];
_comparisonType = "";

StoreStore.getComparison = function () {
  return _comparison;
};

StoreStore.getComparisonType = function () {
  return _comparisonType;
};

StoreStore.getTrending = function () {
  return _trending;
};

StoreStore.getMost = function () {
  return _most;
};

StoreStore.getFilters = function () {
  return _filters;
};

StoreStore.getMostVisited = function () {
  return _mostVisited;
};

StoreStore.getStore = function () {
  return _store;
};

StoreStore.getBrowse = function () {
  return _browse;
};

StoreStore.getMap = function () {
  return _map;
};

StoreStore.getYelp = function () {
  return _yelp;
};

StoreStore.__onDispatch = function (payload) {

  switch (payload.actionType) {

    case StoreConstants.GET_STORE:
      _store = payload.data;
      this.__emitChange();
      break;

    case StoreConstants.USER_LOCATION:
      var location = payload.data.coords;
      _location = { lat: location.latitude, lng: location.longitude };
      // var json = $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCeMPHcWvEYRmPBI5XyeBS9vPsAvqxLD7I", function(data) {
        //user geolocation -- nothing yet
      // });
      this.__emitChange();
      break;

    case StoreConstants.GET_BROWSE:
      _browse = payload.data;
      this.__emitChange();
      break;

    case StoreConstants.GET_COMPARISON:
    if (payload.data instanceof Array) payload.data = payload.data[0];
      _comparison = payload.data;
      _comparisonType = payload.type;
      this.__emitChange();
      break;

    case StoreConstants.GET_TRENDING:
      _trending = payload.data;
      this.__emitChange();
      break;

    case StoreConstants.GET_MOST:
      _most = payload.data;
      this.__emitChange();
      break;

    case StoreConstants.GET_FILTERS:
      _filters = payload.data;
      this.__emitChange();
      break;

    case StoreConstants.CLEAR_COMPARISON:
      _comparison = {};
      this.__emitChange();
      break;

  }
};

module.exports = StoreStore;
