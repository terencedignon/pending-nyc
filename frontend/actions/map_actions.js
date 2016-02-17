var Dispatcher = require('../dispatcher/dispatcher.js');
var MapConstants = require('../constants/map_constants.js');

var MapActions = {
  fetchMap: function (data) {
    Dispatcher.dispatch({
      actionType: MapConstants.FETCH_MAP,
      data: data
    });
  }

};

module.exports = MapActions;
