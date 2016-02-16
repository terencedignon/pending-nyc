var Dispatcher = require('../dispatcher/dispatcher.js');
var StoreConstants = require('../constants/store_constants.js');
var Store = requre('flux/utils').Store;

var StoreStore = new Store(AppDispatcher);

module.exports = StoreStore;
