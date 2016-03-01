var React = require('react');
var ApiUtil = require('../util/api_util.js');
var SearchStore = require('../stores/search_store.js');
var SearchActions = require('../actions/search_actions.js');
var History = require('react-router').History;

var Header = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return { search: "", searching: "", results: [] };
  },
  componentDidMount: function () {
    // this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.searchListener = SearchStore.addListener(this._onSearchChange);
},
  linkHandler: function (e) {
    function yelpCallback () {
      // this.setState({ searching: "Done!"});
    };
    this.setState({ search: "", results: [] });
    this.history.pushState(null, "#/rest/" + e.currentTarget.id, {});
    ApiUtil.fetchStore(e.currentTarget.id, yelpCallback.bind(this));
    SearchActions.clearResults();

    $('.drop-down').css("display", "none");
  },
  componentWillUnmount: function () {
    // this.storeListener.remove();
    this.searchListener.remove();
  },
  populateSearch: function () {
    if (this.state.results.length > 0) {
      $('.drop-down').css("display", "flex");
      $('body').on("click", function (e) {
        if (e.target.tagName !== "LI") {
          $('.drop-down').css("display", "none");
          $('body').off("click");
          SearchActions.clearResults();
          this.setState({ search: "" });
        }
      }.bind(this));

      return this.state.results.map(function(result) {
        return <a href key={Math.random()} onClick={this.linkHandler} id={result.id} href={"#/rest/" + result.id}><li key={Math.random()}>{result.name}</li></a>;
        }.bind(this));
      } else {
        return <li></li>;
      }
  },
  hideSettings: function () {

    $('.settings-drop-down').css("display", "none");
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

    this.setState({ searching: "Thinking"})
    query = e.currentTarget.value;
    this.setState({ search: query });
    this.searchInterval = setInterval(this.autoSearch, 1000);
  },
  autoSearch: function () {
    function callback (data) {
      this.setState({ searching: "Done!"});
      setTimeout(function () {
        this.setState({ searching: ""});
      }.bind(this), 1000);
    }
    // this.setState({ searching: "Searching..."});
    ApiUtil.search(query, callback.bind(this));
    clearInterval(this.searchInterval);
  },
  settingsDropDown: function (e) {
    if (e.target.tagName === "I") $('.settings-drop-down').css("display", "block") ;
  },
  render: function () {

    $(window).scroll(function() {
      if ($(this).scrollTop() > 1) {
        $('header').css("opacity", "0.9");
        $('.header-wrapper').css("height", "50px");
        // $('.header-wrapper').css("padding", "0px");
        // $('.header-search > input').css("background", "#777");
        $('header').css("border-bottom", "2px solid #f7f7f7");
        // $('.show-info').css("height", "100%");

      } else {
        $('header').css("opacity", "1");
        $('header').css("border-bottom", "0");
        // $('.header-wrapper').css("height", "60px");
        $('.header-wrapper').css("padding-top", "5px");
      }
    });

    var headerLinks = <div className="header-links">
       <a href="#/about">About</a>
      <a href="#/top">Top 50/Browse</a>
        <a href="#/map">Map</a>
      </div>;


    var listedResults = this.populateSearch();

    return (
      <header>
        <div className="header-wrapper">
        <div className="logo">
        <a onClick={this.redirectHome} href="#">
          <img className="logo" src="http://i.imgur.com/Ky6jpCP.png"/>
        </a>
      </div>
       <div className="header-search">
         <input type="text" onChange={this.search} value={this.state.search} />
         <span className="searching">
           {this.state.searching}
         </span>
         <div className="drop-down">
           <ul>
             {listedResults}
           </ul>
         </div>
     </div>
     <div className="header-images">
     <a href="#/top"><img alt="list" src="http://i.imgur.com/ot7zRtV.png"/></a> <a href="#/map"><img src="http://i.imgur.com/cGhtK9a.png"/></a>
     </div>
 </div>
    </header>
    );
    // {headerLinks}
  }
});

module.exports = Header;
