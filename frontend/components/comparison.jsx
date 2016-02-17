var React = require('react');
var SearchStore = require('../stores/search_store.js');
var ApiUtil = require('../util/api_util.js');
var SearchStore = require('../stores/search_store.js');
var StoreStore = require('../stores/store_store.js');
var SearchActions = require('../actions/search_actions.js');
var StoreActions = require('../actions/store_actions.js');
var BarChart = require('react-chartjs').Bar;
var LineChart = require('react-chartjs').Line;
// var BarChart = require('react-chartjs').Bar;

var Comparison = React.createClass({
  getInitialState: function () {
    return { query: "", comparisons: [], comparison: {} };
  },
  componentDidMount: function () {
    this.searchListener = SearchStore.addListener(this.onSearchChange);
    this.storeListener = StoreStore.addListener(this.onStoreChange);
  },
  componentWillUnmount: function () {
    this.searchListener.remove();
    this.storeListener.remove();
  },
  onSearchChange: function () {
    this.setState({ comparisons: SearchStore.comparison() });
  },
  onStoreChange: function () {
    if (StoreStore.getComparison() !== []) {
    this.setState({ comparison: StoreStore.getComparison() });
  }
  },
  inputChange: function (e) {
    clearInterval(this.comparisonQuery);
    this.setState({ query: e.currentTarget.value });
    this.comparisonQuery = setInterval(this.autoSearch, 500);

  },
  autoSearch: function () {
    ApiUtil.comparison(this.state.query);
    clearInterval(this.comparisonQuery);
  },
  comparisonHandler: function (e) {
    e.preventDefault();
    ApiUtil.fetchComparison(e.currentTarget.id);
  },
  setUpChart: function () {
    var labelStore = [];
    var dataStore = [];

    var labelComparison = [];
    var dataComparison = [];

    this.props.store.inspections.forEach(function(inspect) {
      var date = new Date(inspect.inspection_date);
      var month = date.getMonth() + 1;
      var year = date.getYear() + 1900;
      labelStore.unshift(month + "/" + year);
      // if (typeof inspect.score !== "number") { inspect.score = 0; }
      dataStore.unshift(inspect.score);
      // return {x: month + "/" + year, y: inspect.score};
    }.bind(this));


    this.state.comparison.inspections.forEach(function(inspect) {
      var date = new Date(inspect.inspection_date);
      var month = date.getMonth() + 1;
      var year = date.getYear() + 1900;
      labelComparison.unshift(month + "/" + year);
      // if (typeof inspect.score !== "number") { inspect.score = 0; }
      dataComparison.unshift(inspect.score);
      // return {x: month + "/" + year, y: inspect.score};
    }.bind(this));



    var dataset = {
      labels: labelStore,
      datasets: [
        {
          label: "",
          fillColor: "salmon",
           strokeColor: "maroon",
           highlightFill: "maroon",
         highlightStroke: "maroon",
          data: dataStore
        },
        {
          label: "",
          fillColor: "lightblue",
           strokeColor: "black",
           highlightFill: "steelblue",
         highlightStroke: "steelblue",
          data: dataComparison
        }
      ]
    };

    var optionHash = {
      barDatasetSpacing: 5,
      scaleShowGridLines: false
    }

    var chart = <BarChart data={dataset} width={600} height={350} options={optionHash}/>;

    return chart;
  },
  resetComparison: function () {
    this.setState({comparison: []});
    SearchActions.clearComparison();
    StoreActions.clearComparison();
  },

  render: function () {


    var input = <input type="text" placeholder="Restaraunt..." onChange={this.inputChange} value={this.state.query}/>;
    var compare = <div/>;
    var chart = <div/>;
    if (this.state.comparison.name) {

        chart = this.setUpChart();
       compare = <h3>{this.state.comparison.name}</h3>;
        input = <span>{this.state.comparison.name} <i onClick={this.resetComparison} className="fa fa-times"></i></span>;


    }


    var searchLIS = <div></div>;
    if (SearchStore.comparison().length > 0) {
      var searchResults = SearchStore.comparison();
      searchLIS = searchResults.map(function(store) {
        return <li key={Math.random()}><a onClick={this.comparisonHandler} id={store.id} href="#">{store.name}</a></li>;
      }.bind(this));
    };

    return (
      <div>
      <span className="compare-name">Compare with: {input}
        </span><br/>
        <span className="compare-sub-header">Zipcode / Boro / Cuisine Type</span>
        {chart}
      <ul>

          {searchLIS}
        </ul>
        </div>
  );

  }

});

module.exports = Comparison;
