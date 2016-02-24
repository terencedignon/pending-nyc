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
  populateSearch: function () {
    if (this.state.results.length > 0) {
      $('.drop-down').css("display", "flex");
      $('body').on("click", function () {
        $('.drop-down').css("display", "none");
        $('body').off("click");
        SearchActions.clearResults();
        // this.setState({ search: "" });
      }.bind(this));

      return this.state.results.map(function(result) {
        return <a href key={Math.random()} onClick={this.linkHandler} href="#" id={result.id} href={"#/rest/" + result.id}><li key={Math.random()}>{result.name}</li></a>;
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
    query = e.currentTarget.value;
    this.setState({ search: query })
    this.searchInterval = setInterval(this.autoSearch, 1000);
  },
  autoSearch: function () {
    ApiUtil.search(query);
    clearInterval(this.searchInterval);
  },
  settingsDropDown: function (e) {
    if (e.target.tagName === "I") $('.settings-drop-down').css("display", "block") ;
  },
  render: function () {

    $(window).scroll(function() {
      if ($(this).scrollTop() > 1) {
        // $('.header-banner').css("opacity", "0.75");
        $('.header-banner text').css("opacity", "1");
        // $('.header-search').css("opacity", "0.75");
        $('.header-banner').css("height", "20px");
        $('.header-banner').css("box-shadow", "2px 2px 0 0 #eee");
        $('.show-info').css("height", "100%");

        $('.show-info').css("border-radius", "0")
        // $('.show-info').css("color", "#222222");
        // $('.show-info').css("background", "transparent");
        // $('.show-info').css("background", "#f7f7f7");
        $('.show-info').css("width", "200px");
        $('.show-info').css("right", "20");

        $('.show-info').on("click", function() {
          $(this).css("height", "100%");
        });
        // $('.header-banner').css("background", "#f7f7f7");
        // $('.show-info').css("opacity", "0.75");
      } else {
        $('.header-banner').css("opacity", "1");
        // $('.show-info').css("height", "100px");
        // $('.show-info').css("width", "300px");
        $('.show-info').css("cursor", "pointer");

        // $('.show-info').css("right", "20px");
        $('.show-info').css("border-radius", "0 0 20px 0");
        $('.header-search').css("opacity", "1");
        $('.show-info').css("right", "20px");
        $('.header-banner').css("box-shadow", "2px 2px 0 0 #ffffff");
        $('.header-banner').css("height", "40px");
        // $('.show-info').css("opacity", "1");
      }
    });

    // if (window.location.hash.includes("rest")) {
    //   headerLinks = <i onClick={this.settingsDropDown} className="fa fa-cog">
    //     <div className="settings-drop-down">
    //       <a onClick={this.hideSettings} href="#/browse/">Browse </a><br/>
    //       <a onClick={this.hideSettings} href="#/leaderBoard">Leader Board</a><br/>
    //     </div>
    //   </i>;
    // <a href="#/browse">Browse</a>
    // <a href="#/overview">Overview</a>
    var headerLinks = <div className="header-links">
        <a href="#/map">Map</a>
      </div>;


    var listedResults = this.populateSearch();

      // <div className="header-links">
      //   <a href="#">Browse</a>
      //   <a href="#">Metrics</a>
      //   <a href="#">Map View</a>
      // </div>

    return (
      <header>
      <div className="wrapper">
      <svg className="header-banner">
         <text><a onClick={this.redirectHome} href="#">pending</a></text>
       </svg>
       {headerLinks}
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
