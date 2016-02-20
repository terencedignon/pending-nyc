var StoreStore = require('../stores/store_store.js');
var Dispatcher = require('../dispatcher/dispatcher.js');
var StoreConstants = require('../constants/store_constants.js');

var StoreActions = {

  fetchFilters: function (data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.FETCH_FILTERS,
      data: data
    });
  },
  updateMap: function (data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.UPDATE_MAP,
      data: data
    });
  },

  clearComparison: function () {
    Dispatcher.dispatch({
      actionType: StoreConstants.CLEAR_COMPARISON

    });
  },

  getComparison: function (data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.GET_COMPARISON,
      data: data
    });
  },
  getBrowse: function(data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.GET_BROWSE,
      data: data
    });
  },
  getStore: function (data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.GET_STORE,
      data: data
    });
  },
  getYelp: function (data) {
    Dispatcher.dispatch({
      actionType: StoreConstants.GET_YELP,
      data: data
    });
  }
};

module.exports = StoreActions;
