var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var SearchActions = require('../actions/search_actions.js');

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
    return (
      <div></div>
   );
  }
});

module.exports = StoreIndex;
