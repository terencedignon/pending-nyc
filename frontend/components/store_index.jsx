var React = require('react');
var ApiUtil = require('../util/api_util');
var StoreStore = require('../stores/store_store.js');
var SearchStore = require('../stores/search_store.js');
var SearchActions = require('../actions/search_actions.js');
var StoreActions = require('../actions/store_actions.js');

var StoreIndex = React.createClass({
  getInitialState: function () {
    return { mostVisited: [], trending: [] };
  // },
},

  componentDidMount: function () {
    // navigator.geolocation.getCurrentPosition(function (data) {
    //   StoreActions.getUserLocation(data);
    // });

    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchMostVisited();
    ApiUtil.fetchTrending();
    this.trendingInterval = setInterval(function () {
      ApiUtil.fetchTrending();
    }, 60000);
    this.searchListener = SearchStore.addListener(this._onSearchChange);
  },

  componentWillUnmount: function () {
    this.storeListener.remove();
    clearInterval(this.trendingInterval);
    this.searchListener.remove();
  },

  _onStoreChange: function () {
    this.setState({ mostVisited: StoreStore.getMostVisited(), trending: StoreStore.getTrending() });
  },

  hoverImage: function (e) {
    // var store = this.state.mostVisited[e.currentTarget.id];
    // $(e.currentTarget).css("opacity", "0.75");
    // $(e.target.parentElement).append("<span class='image-hover-info'>" + store.name + "</span>");
  },

  render: function () {
    var trendItems = <span></span>;

    if (this.state.trending) {
      trendItems = this.state.trending.map(function(trend) {
        return <a key={Math.random()} href={"#/rest/" + trend.id}><span className="trending-item" key={Math.random()}>{trend.name}</span></a>;
      });
    }

    var mostVisitedList = <div/>;

    var mostVisitedItems   = <div></div>;

    if (this.state.mostVisited.length > 0) {
      mostVisitedItems = this.state.mostVisited.map(function(visited) {
        return <a key={Math.random()} href={"#/rest/" + visited.id}><span className="trending-item" key={Math.random()}>{visited.name}</span></a>;
      });

      mostVisitedList = this.state.mostVisited.map(function(store, index) {
        console.log("inside");
        console.log(this.StoreStore.getMostVisited());
        var url = "";
        if (store.image_url) {
          url = store.image_url.replace("ms.jpg", "ls.jpg");
        } else {
          url = "https://cocoavillagepublishing.com/sites/cocoavillagepublishing.com/files/legacy/images/square250-sizeexample-250x250.jpg";
        }

        return (
          <li key={Math.random()}>
          <a href={"#/rest/" + store.id}><img id={index} onMouseOver={this.hoverImage} src={url}/>
          <span className='image-hover-info'>{store.name}</span></a>
          </li>
        );
      });
    }


    return (
      <div>
        <div className="trend-holder">

          <span className="trending">Most Active:</span>
        <hr/>

          <span className="trending">Trending:</span>
          {trendItems}<p/>

      </div>
      <div className="show-index">
        {mostVisitedList}
        <div className="intro-header">

          <span className="big-header">NYC restaurant grade analytics</span><p/>
            <div className="about">

              <h1>


                22,488   restaurants</h1>
              <h1> 154,159  inspections </h1>
              <h1> 463,245 violations</h1>

      </div>
      </div>
        </div>

        </div>
   );
  }
});
// A quantitative look at all of NYC's 23,000 restaurants.  Data is drawn from 150,000+ inspections and 450,000+ violations.<p/>Search by name, location, or cuisine type.</h1>

module.exports = StoreIndex;
