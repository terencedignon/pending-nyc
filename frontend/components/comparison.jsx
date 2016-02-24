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
    return { query: "", comparisons: [], comparisonText: "", comparison: {} };
  },
  componentDidMount: function () {
    setTimeout(function () {
      StoreActions.getComparison(this.props.store.cuisine_calc, "all other restaurants that serve " + this.props.store.cuisine_type);
      this.setState({ comparisonText: "all other restaurants that serve " + this.props.store.cuisine_type });
      // this.setState({ comparison: this.props.store.zipcode_calc });
    }.bind(this), 500);
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
  getComparisonText(comparison) {
  },
  onStoreChange: function () {
    var comparison = StoreStore.getComparison();
    if (comparison !== []) {
      this.setState({ comparison: StoreStore.getComparison(), comparisonText: StoreStore.getComparisonType() });
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

    var labels = [
      "AVG", "FIRST AVG", "MICE", "FLIES", "ROACHES"
    ];

    var store = this.props.store.calc;

    var storeData = [
      store.average,
      store.first_average,
      (store.mice / store.inspections) * 100,
      (store.flies / store.inspections) * 100,
      (store.roaches / store.inspections) * 100
    ];
    var comparison = this.state.comparison;
    if (typeof comparison.average === "undefined") comparison = this.state.comparison.calc;
    var compData = [
      comparison.average,
      comparison.first_average,
      ((comparison.mice / comparison.inspections) * 100),
      ((comparison.flies / comparison.inspections) * 100),
      ((comparison.roaches / comparison.inspections) * 100)
    ];


    // this.props.store.inspections.forEach(function(inspect) {
    //   var date = new Date(inspect.inspection_date);
    //   var month = date.getMonth() + 1;
    //   var year = date.getYear() + 1900;
    //   labelStore.unshift(month + "/" + year);
    //   // if (typeof inspect.score !== "number") { inspect.score = 0; }
    //   dataStore.unshift(inspect.score);
    //   // return {x: month + "/" + year, y: inspect.score};
    // }.bind(this));
    //
    //
    //
    // this.state.comparison.inspections.forEach(function(inspect) {
    //   var date = new Date(inspect.inspection_date);
    //   var month = date.getMonth() + 1;
    //   var year = date.getYear() + 1900;
    //   labelComparison.unshift(month + "/" + year);
    //   // if (typeof inspect.score !== "number") { inspect.score = 0; }
    //   dataComparison.unshift(inspect.score);
    //   // return {x: month + "/" + year, y: inspect.score};
    // }.bind(this));


    var dataset = {

      labels: labels,
      datasets: [
        {
          label: "",
          fillColor: "white",
           strokeColor: "black",
           highlightFill: "#f7f7f7",
         highlightStroke: "black",
          data: storeData
        },
        {
          label: "",
          fillColor: "#eeeeee",
           strokeColor: "black",
           highlightFill: "#cccccc",
         highlightStroke: "black",
          data: compData
        }
      ]
    };


    // omitXLabels: true,
    var optionHash = {
      barDatasetSpacing: 5,
      // scaleShowGridLines: false,
    }
    // var chart = new Chart($('div')).Bar(dataset, optionHash);
    // debugger
    var chart = <BarChart ref="barGraph" redraw key={Math.random()} className="comparison-chart" data={dataset} width={500} height={350} options={optionHash}/>;

    return chart;
},
  resetComparison: function () {
    this.setState({comparison: []});
    SearchActions.clearComparison();
    StoreActions.clearComparison();
  },
  setDefaultComparison: function (e) {
    e.preventDefault();
    var comparisonText;
    var comparison = this.props.store[e.currentTarget.id]
    if (e.currentTarget.id.includes("zipcode")) {
      comparisonText = "all other restaurants in " + this.props.store.zipcode;
    } else if (e.currentTarget.id.includes("cuisine")) {
      comparisonText = "all other restaurants that serve " + this.props.store.cuisine_type;
    } else {
      comparisonText = "all other restaurants in " + this.props.store.boro;
    }
    this.setState({ comparison: comparison, comparisonText: comparisonText });
  },

  // scoreProcessing: function ()

  render: function () {
    console.log(this.state.comparison);

    var input = <input type="text" placeholder="Restaurant" onChange={this.inputChange} value={this.state.query}/>;
    var compare = <div/>;
    var chart = <div>hello</div>;
    var score = <div/>;

    if (typeof this.state.comparison.name !== "undefined") {

        chart = this.setUpChart();
        if (this.state.comparison.calc) {
        score = this.props.store.calc.score - this.state.comparison.calc.score;
        if (score > 0) {
          score = <span className="positive-score">{"+ " + score}</span>;
        } else if (score < 0) {
          score = <span className="negative-score">{score}</span>;
        } else {
          score = <span className="neutral-score">{score}</span>;
        }
      } else {
        score = this.props.store.calc.score - this.state.comparison.score;
        if (score > 0) {
          score = <span className="positive-score">{"+ " + score}</span>;
        } else if (score < 0) {
          score = <span className="negative-score">{score}</span>;
        } else {
          score = <span className="neutral-score">{score}</span>;
        }
      }
       compare = <h3>{this.state.comparison.name}</h3>;
        input = <span>{this.state.comparison.name} <i onClick={this.resetComparison} className="fa fa-times"></i></span>;
    }

    var searchLIS = <div></div>;
    // if (SearchStore.comparison().length > 0) {
    //   var searchResults = SearchStore.comparison();
    //   searchLIS = searchResults.map(function(store) {
    //     return <li key={Math.random()}><a onClick={this.comparisonHandler} id={store.id} href="#">{store.name}</a></li>;
    //   }.bind(this));
    // };
    // <span className="compare-name">Compare With: {input}

    return (
      <div className="comparison">
        <span key={Math.random()} className="store-name">Relative to  {this.state.comparisonText} </span>
          <span className="comparison-results">{score}</span>
          <br/>
        Select By <a href="#" id="cuisine_calc" onClick={this.setDefaultComparison}>Cuisine</a>, <a href="#" id="zipcode_calc" onClick={this.setDefaultComparison}>Zipcode</a>, or <a href="#" id="boro_calc" onClick={this.setDefaultComparison}>Boro</a>.  Click markers on map for further comparison.<p/>

    <p/>
        {chart}
      <ul>
          {searchLIS}
        </ul>
        </div>
  );
}

});

module.exports = Comparison;
