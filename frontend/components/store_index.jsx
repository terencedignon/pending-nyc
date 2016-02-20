var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var SearchActions = require('../actions/search_actions.js');
var Map = require('./main_map.jsx');

var StoreIndex = React.createClass({
  // getInitialState: function () {
  //   return { };
  // },
  componentDidMount: function () {
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    // this.searchListener = SearchStore.addListener(this._onSearchChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
    // this.searchListener.remove();
  },
  _onStoreChange: function () {
  },
  // _onSearchChange: function () {
  //   this.setState({ results: SearchStore.all() });
  // },
  render: function () {
    // <text>zag</text>
    // <rect/>
    // <input type="text"/>
    // <Map />
    // <span>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</span>
    return (
      <div className="show-index">
        <div className="intro-header">
          <span className="big-header">NYC restaurant grade analytics </span><p/>
        </div>
        <div className="most-visited"><h1>MOST VISITED</h1>
        </div>
        </div>
   );
  }
});

module.exports = StoreIndex;
