var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');

var Most = React.createClass({
  getInitialState: function () {
    return { query: "mice", most: []}
  },
  componentDidMount: function () {
    ApiUtil.fetchMost(this.state.query);
    this.storeListener = StoreStore.addListener(this._onStoreChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  _onStoreChange: function () {

    this.setState({ most: StoreStore.getMost() });
  },
  render: function () {
    var mostList = <div/>;
    if (this.state.most.length > 1) {

      mostList = this.state.most.map(function (store) {

        return <li key={Math.random()}>{store.name} => {store.calc.mice} => {(store.calc.mice / store.calc.inspections) * 100}</li>;
        }.bind(this));
    }


    return (
      <div>
      Highest Percentage Mice
      {mostList}
    </div>
    );
  }
});

module.exports = Most;
