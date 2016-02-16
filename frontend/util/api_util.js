var SearchActions = require('../actions/search_actions.js');
var StoreActions = require('../actions/store_actions.js');

var ApiUtil = {
  fetchStore: function (id, callback) {
    $.ajax({
      method: "GET",
      url: "api/stores/" + id,
      success: function(data) {
        StoreActions.getStore(data);

        if (callback) callback(data.phone);
      },
      error: function () {
        console.log("error in fetchStore");
      }

    });
  },
  fetchComparison: function (id) {
    $.ajax({
      method: "GET",
      url: "api/stores/" + id,
      success: function(data) {
        StoreActions.getComparison(data);
        // if (callback) callback(data.phone);
      },
      error: function () {
        console.log("error in fetchStore");
      }

    });
  },
  getYelp: function (phone) {
    $.ajax({
      method: "GET",
      url: "api/yelps/" + phone,
      success: function(data) {
        StoreActions.getYelp(data.businesses[0]);
      },
      error: function () {
        console.log("error in getYelp");
      }
    });
  },

  comparison: function(query) {
    $.ajax({
      method: "GET",
      url: "api/stores/search?q=" + query,
      success: function(data) {
        SearchActions.fetchComparison(data);
      },
      error: function () {
        console.log("comparison api_util error");
      }
    });
  },

  search: function (query) {
    $.ajax({
      method: "GET",
      url: "api/stores/search?q=" + query,
      success: function(data) {
        SearchActions.fetchSearch(data);
      },
      error: function() {
        console.log("search api_util error");
      }
    });
  }
};


module.exports = ApiUtil;
