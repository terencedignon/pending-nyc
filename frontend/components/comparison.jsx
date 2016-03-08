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
    return { legend: "", data: {}, query: "", comparisons: [], comparisonText: "", comparison: {} };
  },
  componentDidMount: function () {
    setTimeout(function () {

      StoreActions.getComparison(this.props.store.cuisine_calc, "all other restaurants that serve " + this.props.store.cuisine_type);
      this.setState({ comparisonText: "all other restaurants that serve " + this.props.store.cuisine_type });
      // this.setState({ comparison: this.props.store.zipcode_calc });
    }.bind(this), 500);


    setTimeout(function () {
      this.chartUpdate();
    }.bind(this), 1000);

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
  getComparisonText: function (comparison) {
  },
  onStoreChange: function () {
    var comparison = StoreStore.getComparison();


    if (comparison !== []) {
      this.setState({ comparison: StoreStore.getComparison(), comparisonText: StoreStore.getComparisonType() });
      this.setUpChart();
      // this.refs.comparison.clear();
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
    chart.datasets[1].label = this.state.comparison.name;

    // this.setState({ legend: chart.generateLabels()})
    var colors = {
      A: "rgba(70, 130, 180, 0.5)",
      Ah: "rgba(70, 130, 180, 1)",
      B: "rgba(59,187,48, 0.5)",
      Bh: "rgba(59,187,48, 1)",
      C: "rgba(128, 0, 0, 0.75)",
      Ch: "rgba(128, 0, 0, 1)"
    }

    chart.datasets[0].bars.forEach(function(bar, index) {
      if (bar.value > chart.datasets[1].bars[index].value) {
            bar.fillColor = colors["C"];
            bar.strokeColor = colors["C"];
            bar.highlightFill = colors["Ch"];
            bar.highlightStroke = colors["Ch"];
      } else {
        bar.fillColor = "white";
        bar.strokeColor = "#777777";
        bar.highlightFill = "white";
        bar.highlightStroke = "#222222";

      }

    //   if (bar.value <= 13) {
    //     bar.fillColor = colors["A"];
    //     bar.strokeColor = colors["A"];
    //     bar.highlightFill = colors["Ah"];
    //     bar.highlightStroke = colors["Ah"];
    //   } else if (bar.value <= 27) {
    //     bar.fillColor = colors["B"];
    //     bar.strokeColor = colors["B"];
    //     bar.highlightFill = colors["Bh"];
    //     bar.highlightStroke = colors["Bh"];
    //   } else {
    //     bar.fillColor = colors["C"];
    //     bar.strokeColor = colors["C"];
    //     bar.highlightFill = colors["Ch"];
    //     bar.highlightStroke = colors["Ch"];
    // }
  });
  chart.update();
  this.forceUpdate();
  this.setState({ legend: chart.generateLegend()})
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
      store.mice_percentage,
      store.flies_percentage,
      store.roach_percentage
    ];
    var comparison = this.state.comparison;
    if (typeof comparison.average === "undefined") comparison = this.state.comparison.calc;
    var compData = [
      comparison.average,
      comparison.first_average,
      Math.round((comparison.mice / comparison.inspections) * 100),
      Math.round((comparison.flies / comparison.inspections) * 100),
      Math.round((comparison.roaches / comparison.inspections) * 100)
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
          label: this.props.store.name,
          fillColor: "white",
           strokeColor: "#222",
           highlightFill: "white",
         highlightStroke: "black",
          data: storeData
        },
        {
          label: this.state.comparison.name,
          fillColor: "#f7f7f7",
           strokeColor: "#777",
           highlightFill: "#eeeeee",
         highlightStroke: "black",
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
    // var chart = new Chart($('div')).Bar(dataset, optionHash);
    // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    // // scaleShowGridLines: false,
    // debugger
    return <BarChart ref="comparison" key="comparison" className="comparison-chart" data={dataset} width={500} height={325} options={optionHash}/>;
    // this.setState({ data: dataset })
},
  resetComparison: function () {
    this.setState({comparison: []});
    SearchActions.clearComparison();
    StoreActions.clearComparison();
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

  // scoreProcessing: function ()

  render: function () {
    // if (typeof window.comparisonChart !== "undefined") comparisonChart.destroy();
    var input = <input type="text" placeholder="Restaurant" onChange={this.inputChange} value={this.state.query}/>;
    var compare = <div/>;
    var chart = <div></div>;
    var score = <div/>;

    if (this.state.comparison && typeof this.state.comparison.name !== "undefined") {

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

    var comparisonNameOrLink;
    if (this.state.comparison && typeof this.state.comparison.calc !== "undefined") {
      comparisonNameOrLink = <a href={"#/rest/" + this.state.comparison.id} onClick={this.linkHandler}>{this.state.comparisonText}</a>;
    } else {
      comparisonNameOrLink = this.state.comparisonText;
    }

    $('document').ready(function() {

      // window.comparisonChart && window.comparisonChart.clear() && window.comparisonChart.destroy();
      // $('#comparison-chart').remove();
      // $('.canvas-holder').append("<canvas id='comparison-chart' width='500' height='325'></canvas>");

      setTimeout(function () {
      var ctx = document.getElementById("comparison-chart").getContext("2d");
      // console.log(window.comparisonChart);
      ctx.canvas.width = 500;
      ctx.canvas.height = 350;
      window.comparisonChart = new Chart(ctx).Bar(this.state.data, {
        animationSteps: 45,
        responsive: false,
        scaleShowGridLines: false,
        barStrokeWidth: 0.5,
        barDatasetSpacing: 3,
        barValueSpacing: 10
      });
      // window.comparisonChart.destroy();

      var colors = {
        A: "rgba(70, 130, 180, 1)",
        B: "rgba(0,128,128, 1)",
        C: "rgba(128, 0, 0, 0.9)"
      }

      comparisonChart.datasets[0].bars.forEach(function(bar, index) {
        if (bar.value <= comparisonChart.datasets[1].bars[index].value) {

        } else {
          // bar.fillColor = colors["C"];
          // bar.strokeColor = colors["C"];
          // bar.highlightFill = colors["C"];
          // bar.highlightStroke = colors["C"];
        }
      });


      // comparisonChart.update();
    }.bind(this), 0);

  }.bind(this));


    return (
      <div className="comparison">
        <span key={Math.random()} className="store-name">Relative to {comparisonNameOrLink} </span>
           <span className="comparison-results">{score}</span><br/>

        Compare with <a href="#" id="cuisine_calc" onClick={this.setDefaultComparison}>Cuisine</a>, <a href="#" id="zipcode_calc" onClick={this.setDefaultComparison}>Zipcode</a>, or <a href="#" id="boro_calc" onClick={this.setDefaultComparison}>Boro</a>.

    <p/>
      <span className="comparison-legend" key={Math.random()} dangerouslySetInnerHTML={{ __html: this.state.legend }} />
      {chart}
      <ul>
          {searchLIS}
        </ul>
        </div>
  );
}

});

module.exports = Comparison;
