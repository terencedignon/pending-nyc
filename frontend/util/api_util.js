var SearchActions = require('../actions/search_actions.js');
var StoreActions = require('../actions/store_actions.js');
var MapActions = require('../actions/map_actions.js');

var ApiUtil = {

  fetchBrowse: function(query) {
    $.ajax({
      method: "GET",
      url: "api/stores/browse_search",
      data: { query: query },
      success: function(data) {
        StoreActions.getBrowse(data);
      },
      error: function() {
        console.log("error in fetchFilters");
      }
    });
  },

  fetchTrending: function() {
    $.ajax({
      method: "GET",
      url: "api/stores/trending",
      success: function(data) {
        StoreActions.getTrending(data);
      },
      error: function() {
        console.log("error in fetchTrending");
      }
    });
  },

  fetchFilters: function() {
    $.ajax({
      method: "GET",
      url: "api/stores/filters",
      success: function(data) {
        StoreActions.fetchFilters(data);
      },
      error: function() {
        console.log("error in fetchFilters");
      }
    });
  },
  autoComplete: function (params) {
    $.ajax({
      method: "GET",
      url: "api/stores/auto_complete",
      data: params,
      success: function(data) {
        SearchActions.autoComplete(data);
      },
      error: function (e) {
        console.log("error in fetchMostVisited");
      }
    });
    },

  fetchMostVisited: function() {
    $.ajax({
      method: "GET",
      url: "api/stores/most_visited",
      success: function(data) {
        StoreActions.getMostVisited(data);
      },
      error: function (e) {
        console.log("error in fetchMostVisited");
      }
    });
  },

  fetchMainMap: function(options) {
    $.ajax({
      method: "POST",
      url: "api/stores/main_map",
      data: { main: true, bounds: options.bounds, query: options.query },
      success: function(data) {
        MapActions.fetchMainMap(data);
      },
      error: function (e) {
        console.log("error in fetchMainMap");
      }
    });
  },

  fetchMap: function(options) {
    $.ajax({
      method: "GET",
      url: "api/stores",
      data: { map_query: true, bounds: options.bounds, cuisine_type: options.cuisine_type },
      success: function(data) {
        MapActions.fetchMap(data);

      },
      error: function() {
        console.log("error in updateMap");
      }
    });
  },
  fetchStore: function (id, callback) {

    $.ajax({
      method: "GET",
      url: "api/stores/" + id,
      success: function(data) {
        StoreActions.getStore(data);
        // if (callback) callback();
      },
      error: function () {
        console.log("error in fetchStore");
      }

    });
  },
  fetchComparison: function (id, type) {
    $.ajax({
      method: "GET",
      url: "api/stores/comparison",
      data: {id: id},
      success: function(data) {
        StoreActions.getComparison(data, type);

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

  fetchMost: function (query) {
    $.ajax({
      method: "POST",
      url: "api/stores/most",
      data: query,
      success: function(data) {
        StoreActions.getMost(data);
      },
      error: function () {
        console.log("error in fetchMost function");
      }
    });
  },

  search: function (query, callback) {
    $.ajax({
      method: "GET",
      url: "api/stores/search?q=" + query,
      success: function(data) {
        SearchActions.fetchSearch(data);
        callback && callback(data);
      },
      error: function() {
        console.log("search api_util error");
      }
    });
  }
};


module.exports = ApiUtil;
