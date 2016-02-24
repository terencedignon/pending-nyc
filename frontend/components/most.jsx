var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');

var Most = React.createClass({
  getInitialState: function () {
    return { query: "roach_percentage", most: [], boro: "", zipcode: "", cuisine_type: ""}
  },
  componentDidMount: function () {
    ApiUtil.fetchMost(this.state);
    this.storeListener = StoreStore.addListener(this._onStoreChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },

  boroInput: function (e) {
    this.setState({ boro: e.currentTarget.value });
    this.updateList();
  },

  cuisineInput: function (e) {
    this.setState({ cuisine_type: e.currentTarget.value });
    this.updateList();
  },

  zipcodeInput: function (e) {
    this.setState({ zipcode: e.currentTarget.value });
    setTimeout(function () {
      this.updateList();
    }.bind(this), 200);
  },

  _onStoreChange: function () {
    this.setState({ most: StoreStore.getMost() });
  },
  updateList: function () {
    ApiUtil.fetchMost(this.state);
  },
  changeQuery: function (e) {
    e.preventDefault();
    ApiUtil.fetchMost(this.state);
    this.setState({ query: e.currentTarget.id });
  },
  render: function () {
    var mostList = <div/>;
    if (this.state.most.length > 1) {
      mostList = this.state.most.map(function (store) {

        return <li key={Math.random()}> <a href={"#/rest/" + store.id}>{store.name}</a> => {store.calc[this.state.query]} </li>;
        }.bind(this));
    }



    return (
      <div>
        <div className="filter-by">
          <h2>Filter By: </h2> <input onChange={this.zipcodeInput} type="text" placeholder="Zipcode"/> <input id="cuisine_type"  onChange={this.cuisineInput} type="text" placeholder="Cuisine"/>
          <input id="boro" onChange={this.boroInput} type="text" placeholder="Boro"/>
        </div>
      <div className="most-header">
      <a id="score" onClick={this.changeQuery} href="#">Pending.nyc Aggregate Score</a> • 
        <a id="average" onClick={this.changeQuery} href="#">Average</a> •
          <a id="first_average" onClick={this.changeQuery} href="#">Surprise Inspection Average</a> • 
            <a id="worst" onClick={this.changeQuery} href="#">Worst</a><br/>
      Mice: <a id="mice_percentage" onClick={this.changeQuery} href="#">Percent</a> or <a id="mice" onClick={this.changeQuery} href="#">Number</a> •
      Roaches: <a id="roach_percentage" onClick={this.changeQuery} href="#">Percent</a> or <a id="roaches" onClick={this.changeQuery} href="#">Number</a> •
      Flies: <a id="flies_percentage" onClick={this.changeQuery} href="#">Percent</a> or <a id="flies" onClick={this.changeQuery} href="#">Number</a>
    </div>
    <ul className="filter-links">
      {mostList}
    </ul>
    </div>
    );
  }
});

module.exports = Most;
