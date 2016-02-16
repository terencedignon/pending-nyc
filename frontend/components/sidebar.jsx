var React = require('react');
var SearchStore = require('../stores/search_store.js');
// var History = require('react-router').History;
var ApiUtil = require('../util/api_util.js');

var SideBar = React.createClass({
  // mixins: [History],
  getInitialState: function () {
    return { results: [] };
  },
  componentDidMount: function () {
    // this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.searchListener = SearchStore.addListener(this._onSearchChange);
  },
  linkHandler: function (e) {
    function yelpCallback (phone) {
      ApiUtil.getYelp(phone);
    };
    ApiUtil.fetchStore(e.currentTarget.id, yelpCallback.bind(this)  );
  },
  componentWillUnmount: function () {
    // this.storeListener.remove();
    this.searchListener.remove();
  },
  _onStoreChange: function () {
  },
  _onSearchChange: function () {
    this.setState({ results: SearchStore.all() });
  },

  render: function () {
  var listedResults;
  if (this.state.results.length > 0) {
    listedResults = this.state.results.map(function(result) {
      return <li key={Math.random()}><a href onClick={this.linkHandler} href="#" id={result.id} href={"#/rest/" + result.id}>{result.name}</a></li>;
      }.bind(this));
    } else {
      listedResults = <li></li>;
    }

      return (
        <div className="sidebar">
          <ul>
            {listedResults}
          </ul>
        </div>
      );
  },

});

module.exports = SideBar;
