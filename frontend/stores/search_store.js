var AppDispatcher = require('../dispatcher/dispatcher.js');
var SearchConstants = require('../constants/search_constants.js');
var Store = require('flux/utils').Store;
var SearchStore = new Store(AppDispatcher);

_results = [];
_comparison = [];

SearchStore.all = function () {
  return _results.slice();
};

SearchStore.comparison = function () {
  return _comparison;
};

SearchStore.__onDispatch = function (payload) {
  if (payload.actionType === SearchConstants.FETCH_SEARCH) {
    _results = payload.data;
    this.__emitChange();
  } else if (payload.actionType === SearchConstants.CLEAR_RESULTS) {
    _results = [];
  } else if (payload.actionType === SearchConstants.FETCH_COMPARISON) {
    _comparison = payload.data;
    this.__emitChange();
  } else if (payload.actionType === SearchConstants.CLEAR_COMPARISON) {
    _comparison = [];
  }

};

module.exports = SearchStore;
