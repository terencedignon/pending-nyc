var Dispatcher = require('../dispatcher/dispatcher.js');
var SearchConstants = require('../constants/search_constants.js');

var SearchActions = {

  clearComparison: function () {
    Dispatcher.dispatch({
      actionType: SearchConstants.CLEAR_COMPARISON
    });
  },

  fetchComparison: function (data) {
    Dispatcher.dispatch({
      actionType: SearchConstants.FETCH_COMPARISON,
      data: data
    });
  },

  fetchMost: function (data) {
    Dispatcher.dispatch({
      actionType: SearchConstants.FETCH_SEARCH,
      data: data
    });
  },

  fetchSearch: function (data) {
    Dispatcher.dispatch({
      actionType: SearchConstants.FETCH_SEARCH,
      data: data
    });
  },
  clearResults: function () {
    Dispatcher.dispatch({
    actionType: SearchConstants.CLEAR_RESULTS
  });
  }
};

module.exports = SearchActions;
