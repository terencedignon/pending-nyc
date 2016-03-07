var AppDispatcher = require('../dispatcher/dispatcher.js');
var SearchConstants = require('../constants/search_constants.js');
var Store = require('flux/utils').Store;
var SearchStore = new Store(AppDispatcher);

_autoComplete = [];
_most = [];
_results = [];
_comparison = [];

SearchStore.all = function () {
  return _results.slice();
};

SearchStore.autoComplete = function () {
  return _autoComplete;
};

SearchStore.comparison = function () {
  return _comparison;
};

SearchStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case SearchConstants.FETCH_SEARCH:
      _results = payload.data;
      this.__emitChange();
      break;
    case SearchConstants.CLEAR_RESULTS:
      _results = [];
      this.__emitChange();
      break;
    case SearchConstants.FETCH_COMPARISON:
      _comparison = [];
      break;
    case SearchConstants.CLEAR_COMPARISON:
      _comparison = [];
      break;
    case SearchConstants.AUTO_COMPLETE:
      _autoComplete = payload.data;
      this.__emitChange();
      break;
    case SearchConstants.FETCH_MOST:
      _most = [];
      this.__emitChange();
      break;
  }
  //
  // if (payload.actionType === SearchConstants.FETCH_SEARCH) {
  //   _results = payload.data;
  //   this.__emitChange();
  // } else if (payload.actionType === SearchConstants.CLEAR_RESULTS) {
  //   _results = [];
  //   this.__emitChange();
  // } else if (payload.actionType === SearchConstants.FETCH_COMPARISON) {
  //   _comparison = payload.data;
  //   this.__emitChange();
  // } else if (payload.actionType === SearchConstants.CLEAR_COMPARISON) {
  //   _comparison = [];
  // } else if (payload.actionType === SearchConstants.AUTO_COMPLETE) {
  //   _autoComplete = payload.data;
  //   this.__emitChange();
  //
  // } else if (payload.actionType === SearchConstants.FETCH_MOST) {
  //   _most = [];
  //   this.__emitChange();
  // }

};

module.exports = SearchStore;
