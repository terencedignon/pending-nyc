var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var MapStore = new Store(AppDispatcher);
var MapConstants = require('../constants/map_constants.js');

_map = [];

MapStore.all = function () {
  return _map;
};

MapStore.__onDispatch = function (payload) {
  if (payload.actionType === MapConstants.FETCH_MAP) {
    _map = payload.data;
    this.__emitChange();
  }

};

module.exports = MapStore;
