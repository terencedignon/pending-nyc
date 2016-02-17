var React = require('react');
var ApiUtil = require('../util/api_util.js');
var SearchStore = require('../stores/search_store.js');
var SearchActions = require('../actions/search_actions.js');
var History = require('react-router').History;

var Header = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return { search: "", results: [] };
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
    this.setState({ search: "", results: [] });
    SearchActions.clearResults();

    $('.drop-down').css("display", "none");
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
  redirectHome: function () {
    this.history.pushState(null, "/", {});
  },
  search: function (e) {
    clearInterval(this.searchInterval);
    query = e.currentTarget.value;
    this.setState({ search: query })
    this.searchInterval = setInterval(this.autoSearch, 1000);
  },
  autoSearch: function () {
    ApiUtil.search(query);
    clearInterval(this.searchInterval);
  },


  render: function () {
    var listedResults;
    if (this.state.results.length > 0) {
      $('.drop-down').css("display", "flex");
      listedResults = this.state.results.map(function(result) {
        return <li key={Math.random()}><a href onClick={this.linkHandler} href="#" id={result.id} href={"#/rest/" + result.id}>{result.name}</a></li>;
        }.bind(this));
      } else {
        listedResults = <li></li>;
      }


    return (
      <header>
      <div className="wrapper">
      <svg className="header-banner">
         <text><a onClick={this.redirectHome} href="#">zagrat</a></text>
       </svg>
       <div className="header-search">
         <input type="text" onChange={this.search} value={this.state.search} />
         <i className="fa fa-question"></i>
         <div className="drop-down">
           <ul>
             {listedResults}
           </ul>
         </div>
     </div>
     </div>
    </header>
    );
  }
});

module.exports = Header;
