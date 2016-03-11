var React = require('react');
var SearchStore = require('../stores/search_store.js');
var ApiUtil = require('../util/api_util.js');
var SearchStore = require('../stores/search_store.js');
var StoreStore = require('../stores/store_store.js');
var SearchActions = require('../actions/search_actions.js');
var StoreActions = require('../actions/store_actions.js');
var BarChart = require('react-chartjs').Bar;

var Comparison = React.createClass({

  getInitialState: function () {
    return { legend: "", data: {}, query: "", comparisons: [], comparisonText: "", comparison: {} };
  },

  componentDidMount: function () {

    setTimeout(function () {
      StoreActions.getComparison(this.props.store.cuisine_calc, "all other restaurants that serve " + this.props.store.cuisine_type);
      this.setState({ comparisonText: "all other restaurants that serve " + this.props.store.cuisine_type });
      this.chartUpdate();
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

  onStoreChange: function () {
    var comparison = StoreStore.getComparison();

    if (comparison !== []) {
      this.setState({ comparison: StoreStore.getComparison(), comparisonText: StoreStore.getComparisonType() });
      this.setUpChart();
      this.chartUpdate();
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

  chartUpdate: function () {

    var chart = this.refs.comparison.getChart();
    //set new label
    chart.datasets[1].label = this.state.comparison.name;

    var colors = {
      cFill: "rgba(128, 0, 0, 0.75)",
      cStroke: "rgba(128, 0, 0, 1)"
    }

    chart.datasets[0].bars.forEach(function(bar, index) {
      if (bar.value > chart.datasets[1].bars[index].value) {
            bar.fillColor = colors["cFill"];
            bar.strokeColor = colors["cFill"];
            bar.highlightFill = colors["cStroke"];
            bar.highlightStroke = colors["cStroke"];
      } else {
        bar.fillColor = "white";
        bar.strokeColor = "#777777";
        bar.highlightFill = "white";
        bar.highlightStroke = "#222222";
      }
  });
  chart.update();
  this.forceUpdate();
  this.setState({ legend: chart.generateLegend()})
  },

  setUpChart: function () {

    var labelStore, dataStore, labelComparison, dataComparison;
    var labels = ["AVG", "SURPRISE", "MICE", "FLIES", "ROACHES"];
    var store = this.props.store.calc;
    var comparison = this.state.comparison;

    var storeData = [
      store.average,
      store.first_average,
      store.mice_percentage,
      store.flies_percentage,
      store.roach_percentage
    ];

    if (typeof comparison.average === "undefined") comparison = this.state.comparison.calc;
      var compData = [
        comparison.average,
        comparison.first_average,
        Math.round((comparison.mice / comparison.inspections) * 100),
        Math.round((comparison.flies / comparison.inspections) * 100),
        Math.round((comparison.roaches / comparison.inspections) * 100)
      ];

    var dataset = {
      labels: labels,
       datasets: [
        {
          label: this.props.store.name,
          data: storeData
        },
        {
          label: this.state.comparison.name,
          data: compData
        }
      ]
    };

    // omitXLabels: true,
    var optionHash = {
      barDatasetSpacing: 5,
      barValueSpacing: 5,
      animationSteps: 60,
      responsive: false,
      scaleShowGridLines: false,
      barStrokeWidth: 0.5,
      barDatasetSpacing: 3,
      barValueSpacing: 10,
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>kb"
    }

    return (
      <BarChart ref="comparison" key="comparison" className="comparison-chart" data={dataset} width={500} height={325} options={optionHash}/>
    );
  },

  linkHandler: function (e) {
    ApiUtil.fetchStore(this.state.comparison.id);
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
    setTimeout(function () {
      this.chartUpdate();
    }.bind(this), 0)

  },

  setScore: function () {

    var comparisonScore = (typeof this.state.comparison.calc === "undefined" ? this.state.comparison.score : this.state.comparison.calc.score);
    var score = this.props.store.calc.score - comparisonScore;

    if (score > 0) { return <span className="positive-score">{"+ " + score}</span>; } else
    if (score > 0) { return <span className="negative-score">{score}</span>; }
    else { return <span className="neutral-score">{score}</span>; }

  },

  render: function () {

    var input = <input type="text" placeholder="Restaurant" onChange={this.inputChange} value={this.state.query}/>;
    var compare = <div/>;
    var chart = <div></div>;
    var score = <div/>;

    if (this.state.comparison && typeof this.state.comparison.name !== "undefined") {
        chart = this.setUpChart();
        score = this.setScore();
      }



    var comparisonNameOrLink;
    if (this.state.comparison && typeof this.state.comparison.calc !== "undefined") {
      comparisonNameOrLink = <a href={"#/rest/" + this.state.comparison.id} onClick={this.linkHandler}>{this.state.comparisonText}</a>;
    } else {
      comparisonNameOrLink = this.state.comparisonText;
    }


    return (
      <div className="comparison">
        <span key={Math.random()} className="store-name">Relative to {comparisonNameOrLink} </span>
           <span className="comparison-results">{score}</span><br/>

        Compare with <a href="#" id="cuisine_calc" onClick={this.setDefaultComparison}>Cuisine</a>, <a href="#" id="zipcode_calc" onClick={this.setDefaultComparison}>Zipcode</a>, or <a href="#" id="boro_calc" onClick={this.setDefaultComparison}>Boro</a>.

    <p/>
      <span className="comparison-legend" key={Math.random()} dangerouslySetInnerHTML={{ __html: this.state.legend }} />
      {chart}

        </div>
  );
}

});

module.exports = Comparison;
