var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var MapStore = new Store(AppDispatcher);
var MapConstants = require('../constants/map_constants.js');

_map = [];
_mainMap = [];

MapStore.all = function () {
  return _map;
};

MapStore.getMainMap = function () {
  return _mainMap;
};

MapStore.__onDispatch = function (payload) {

  switch (payload.actionType) {

    case MapConstants.FETCH_MAP:
      _map = payload.data;
      this.__emitChange();
      break;

    case MapConstants.FETCH_MAIN_MAP:
      _mainMap = payload.data;
      break;

  }
};

module.exports = MapStore;
