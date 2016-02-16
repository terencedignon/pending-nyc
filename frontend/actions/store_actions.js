var StoreStore = require('../stores/store_store.js');
var Dispatcher = require('../dispatcher/dispatcher.js');
var StoreConstants = require('../constants/store_constants.js');

var StoreActions = {
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
