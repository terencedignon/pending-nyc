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
    this.searchListener = SearchStore.addListener(this._onSearchChange);
  },

  linkHandler: function (e) {
    e.preventDefault();
    this.setState({ search: "", results: [] });

    ApiUtil.fetchStore(e.currentTarget.id);
    SearchActions.clearResults();
    this.history.pushState(null, "/rest/" + e.currentTarget.id, {});

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

  _onStoreChange: function () { },

  _onSearchChange: function () {

    this.setState({ results: SearchStore.all() });

  },

  redirectHome: function () {
    this.history.pushState(null, "/", {});
  },

  hover: function (e) { },

  mouseLeave: function (e) {
    $(e.currentTarget).find('div').css("display", "none");
  },

  search: function (e) {
    clearInterval(this.searchInterval);

    this.setState({ searching: <i className="fa fa-circle-o-notch fa-spin fa-lg"></i>})
    query = e.currentTarget.value;
    this.setState({ search: query });
    this.searchInterval = setInterval(this.autoSearch, 1000);
  },

  autoSearch: function () {
    function callback (data) {
      this.setState({ searching: <i className="fa fa-check fa-lg"></i>});
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

  setHeaderAnimation: function () {

    $(window).scroll(function() {
      if ($(this).scrollTop() > 1) {
        $('header').css("opacity", "0.9");
        $('.header-wrapper').css("height", "50px");
        $('header').css("border-bottom", "2px solid #f7f7f7");
      } else {
        $('header').css("opacity", "1");
        $('header').css("border-bottom", "0");
        $('.header-wrapper').css("padding-top", "5px");
      }
    });

  },

  render: function () {
    this.setHeaderAnimation();
    var listedResults = this.populateSearch();

    // <a href="#" onMouseOut={this.mouseLeave} onMouseOver={this.hover.bind(this, "Internals")}><img src="http://i.imgur.com/Wu8hnv7.png"/></a>
    // {headerLinks}

    return (
      <header>
        <div className="header-wrapper">
        <div className="logo">
          <a onClick={this.redirectHome} href="#">
            <img className="logo" src="http://i.imgur.com/IkSfQsy.png"/>
          </a>
        </div>
        <div className="header-search">
          <input type="text" onChange={this.search} placeholder="Search..." value={this.state.search} />
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
        <span onMouseOut={this.mouseLeave} onMouseOver={this.hover}> <a href="#/top"><img alt="list" src="http://i.imgur.com/ot7zRtV.png"></img></a>
          <div className='arrow-up'>
          </div>
          <div className='mouseover'>
            Top 50
          </div>
        </span>
        <span onMouseOut={this.mouseLeave} onMouseOver={this.hover}><a href="#/map"><img src="http://i.imgur.com/cGhtK9a.png"/></a>
          <div className='arrow-up'>
          </div>
          <div className='mouseover'>
            Map
          </div>
        </span>
       </div>
     </div>
   </header>
    );
  }
});

module.exports = Header;
