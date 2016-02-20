var AppDispatcher = require('../dispatcher/dispatcher.js');
var StoreConstants = require('../constants/store_constants.js');
var Store = require('flux/utils').Store;

var StoreStore = new Store(AppDispatcher);

_store = {};
_yelp = {};
_comparison = {};
_map = [];
_browse = [];
_filters = [];

StoreStore.getComparison = function () {
  return _comparison;
};

StoreStore.getFilters = function () {
  return _filters;
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
  
  if (payload.actionType === StoreConstants.GET_STORE) {
    _store = payload.data;
    this.__emitChange();
    }

  else if (payload.actionType === StoreConstants.GET_BROWSE) {
    _browse = payload.data;
    this.__emitChange();
  }

  else if (payload.actionType === StoreConstants.UPDATE_MAP) {
    _map = payload.data;

  }

  else if (payload.actionType === StoreConstants.GET_COMPARISON) {
    _comparison = payload.data;
    this.__emitChange();
  }

  else if (payload.actionType === StoreConstants.GET_YELP) {
    _yelp = payload.data;
    this.__emitChange();
  }

  else if (payload.actionType === StoreConstants.FETCH_FILTERS) {
    _filters = payload.data;
    this.__emitChange();
  }

  else if (payload.actionType === StoreConstants.CLEAR_COMPARISON) {
    _comparison = {};
    this.__emitChange();
  }

};

module.exports = StoreStore;
