var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var SearchActions = require('../actions/search_actions.js');
var Map = require('./main_map.jsx');

var StoreIndex = React.createClass({
  getInitialState: function () {
    return { mostVisited: [], trending: [] };
  // },
},
  componentDidMount: function () {
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchMostVisited();
    ApiUtil.fetchTrending();
    this.trendingInterval = setInterval(function () {
      ApiUtil.fetchTrending();
    }, 60000);
    // this.searchListener = SearchStore.addListener(this._onSearchChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
    clearInterval(this.trendingInterval);

    // this.searchListener.remove();
  },
  _onStoreChange: function () {
    this.setState({ mostVisited: StoreStore.getMostVisited(), trending: StoreStore.getTrending() });
  },
  // _onSearchChange: function () {
  //   this.setState({ results: SearchStore.all() });
  // },
  hoverImage: function (e) {
    // var store = this.state.mostVisited[e.currentTarget.id];
    // $(e.currentTarget).css("opacity", "0.75");
    // $(e.target.parentElement).append("<span class='image-hover-info'>" + store.name + "</span>");
  },
  render: function () {
    // <text>zag</text>
    // <rect/>
    // <input type="text"/>
    // <span>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</span>
    // <Map />
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
      // mostVisitedList = this.state.mostVisited.map(function(store, index) {
      //   var url = "";
      //   if (store.image_url) {
      //     url = store.image_url.replace("ms.jpg", "ls.jpg");
      //   } else {
      //     url = "https://cocoavillagepublishing.com/sites/cocoavillagepublishing.com/files/legacy/images/square250-sizeexample-250x250.jpg";
      //   }
      //   return <li key={Math.random()}>
      //     <a href={"#/rest/" + store.id}><img id={index} onMouseOver={this.hoverImage} src={url}/>
      //     <span className='image-hover-info'>{store.name}</span></a>
      //     </li>;
    }
    return (
      <div>
        <div className="trend-holder">

          <span className="trending">Most Active:</span>
          {mostVisitedItems}<hr/>

          <span className="trending">Trending:</span>
          {trendItems}<p/>

      </div>
      <div className="show-index">
        <div className="intro-header">
          <span className="big-header">NYC restaurant analytics</span><p/>
        </div>
        </div>
        </div>
   );
  }
});

module.exports = StoreIndex;
