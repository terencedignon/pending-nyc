var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var BarChart = require("react-chartjs").Bar;
var Comparison = require('./comparison.jsx');
var Map = require('./map.jsx');
var Overview = require('./overview.jsx');
var Violations = require('./violations.jsx');

var StoreShow = React.createClass({
  getInitialState: function () {
    return { grade: "P", store: {}, yelp: {}, key: "map",  data: {} };
  },
  componentDidMount: function () {
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchStore(this.props.params.id);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  setImage: function () {
    if (this.state.store.image_url !== null) {
      var url = this.state.store.image_url.replace("ms.jpg", "348s.jpg");
      return <img className="show-image" src={url} />;
    } else {
      return <div className="empty-image"></div>;
    }
  },
  _onStoreChange: function () {
    if (this.state.store !== StoreStore.getStore()) {
      this.setState({ comparisonKey: Math.random(), mapKey: Math.random(), store: StoreStore.getStore(), yelp: StoreStore.getYelp() });
      this.chartUpdate();
    };
  },
  chartUpdate: function () {
    var chart = this.refs.chart.getChart();
    // this.setState({ legend: chart.generateLabels()})
    var colors = {
      default: "white",
      A: "rgba(70, 130, 180, 0.5)",
      Ah: "rgba(70, 130, 180, 1)",
      B: "rgba(128, 0, 0, 0.5)",
      C: "rgba(128, 0, 0, 0.85)",
      Cf: "rgba(128, 0, 0, 0.9)"
    }
    // B: "rgba(59,187,48, 0.5)",
    // Bh: "rgba(59,187,48, 1)",
    // C: "rgba(251, 149, 23, 0.5)",
    // Ch: "rgba(251, 149, 23, 1)"

    chart.datasets[0].bars.forEach(function(bar) {
      if (bar.value <= 13) {
        // bar.fillColor = "white";
        // bar.strokeColor = "#777777";
        // bar.highlightFill = white;
        // bar.highlightStroke = "#222222";
      } else if (bar.value <= 27) {
        // bar.fillColor = "white";
        // bar.strokeColor = "#777777";
        // bar.highlightFill = "white";
        // bar.highlightStroke = "#222222";
      } else {
        bar.fillColor = colors["C"];
        bar.strokeColor = colors["C"];
        bar.highlightFill = colors["Cf"];
        bar.highlightStroke = colors["Cf"];
    }
  });
  chart.update();
  },

  chartData: function () {
    var labels = [];
    var data = [];

    this.state.store.inspections.forEach(function(inspect) {

      var date = new Date(inspect.inspection_date);
      var month = date.getMonth() + 1;
      var year = date.getYear() - 100;
      labels.push(month + "/" + year);
      // if (typeof inspect.score !== "number") { inspect.score = 0; }
      data.push(inspect.score);
      // return {x: month + "/" + year, y: inspect.score};
    }.bind(this));

    var dataset = {
      labels: labels,
      datasets: [
        {
          label: "My first dataset",
          fillColor: "white",
           strokeColor: "#777",
           highlightFill: "white",
         highlightStroke: "black",
          data: data
        }
      ]
    };
    return dataset;
  },
  selectGrade: function () {

    imageObject = {
      A: "http://i.imgur.com/8PkvwVo.jpg",
      B: "http://i.imgur.com/pt3dIsE.jpg",
      C: "http://i.imgur.com/NUoquVG.jpg",
      P: "http://i.imgur.com/fksRyj5.jpg",
      Z: "http://i.imgur.com/fksRyj5.jpg"
    };

      return imageObject[this.state.store.calc.grade]

  },

  setChart: function () {

    setTimeout(function () {

    //  $('#chart').remove();
    //  $('.canvas-holder').append("<canvas key='chartery' id='chart' width='500' height='150'></canvas>");

    var ctx = document.getElementById("chart").getContext("2d");
    ctx.canvas.width = 500;
    ctx.canvas.height = 150;
   //  animation: false,
   if (typeof window.myObjBar !== "undefined") myObjBar.destroy();
    window.myObjBar = new Chart(ctx).Bar(this.state.data, {
      scaleShowGridLines: false,
      barStrokeWidth: 0.5
    });

    var colors = {
      A: "rgba(70, 130, 180, 1)",
      B: "rgba(0,128,128, 1)",
      Bfill: "rgba(150, 150, 150, 1)",
      C: "rgba(251, 149, 23, 0.9)",
      Cfill: "rgba(128, 0, 0, 1)"
    }

    myObjBar.datasets[0].bars.forEach(function(bar) {

      if (bar.value <= 13) {

     } else if (bar.value <= 27) {

      } else {
        bar.fillColor = colors["C"];
        bar.strokeColor = colors["C"];
        // bar.highlightFill = "rgba(128, 0, 0, 1)";
        bar.highlightStroke = colors["C"];
      }
    });
    myObjBar.update();
  }, 2000);


  },

  render: function () {
    var data;
    // var legend = <div/>;
    var comparison = <div/>;
    var circleChart = <div></div>;
    var barChart = <div></div>;
    var overview = <div></div>;
    var violations;
    var store = this.state.store;

    if (typeof this.state.store !== "undefined" && typeof this.state.store.calc !== "undefined") {


      ///OVERVIEW
      this.map = <Map key={this.state.mapKey} camis={this.state.store.camis} cuisine_type={this.state.store.cuisine_type} name={this.state.store.name} lat={this.state.store.lat} lng={this.state.store.lng}/>;
      // overview = this.createOverview();
      comparison = <Comparison key={this.state.comparisonKey} store={this.state.store} />;
      overview = <Overview store={this.state.store}/>
      violations = <Violations key={Math.random()} inspections={this.state.store.inspections} />
        //CHART
        data = this.chartData();
        var options = { scaleShowGridLines: false, barStrokeWidth: 0.5};
        // legend = <span dangerouslySetInnerHTML={{ __html: this.state.legend }} />;
        barChart = <BarChart ref="chart" className="bar-chart" data={data} options={options} width={500} height={150}fill={'#3182bd'} />
  var grade = <img src={this.selectGrade()}/>;
      var image = this.setImage();
    }
    var address = <div></div>;

    address = <div>
      <h2>{this.state.store.name}</h2>
      {this.state.store.display_phone}

  </div>;



  // <LineChart className="chart" data={data} width="600" height="250" />
  // {barChart}

        // <div className="violation-chart">
        //   {circleChart}
        // </div>

  // if (typeof window.myObjBar === "undefined") this.setChart();


  var showDisplay =  <div className="most-loading"><i className="fa fa-circle-o-notch fa-pulse most-spin"></i></div>;

  if (typeof this.state.store.calc !== "undefined") {
    showDisplay =
      <div>
        <div className="show-row">
            <div className="overview">
              {overview}
              <hr/>
              <span className="store-name">Inspections over time</span>
            
              <hr/>
                {barChart}
              <hr/>
              {comparison}
            </div>
            <div>
            <div key={Math.random()} className="show-holder">
        {image}
      <div className="show-grade">
          {grade}
    </div>
    </div>
      <div>
          {this.map}
      </div>
    </div>
  </div>
  <span className="store-name">Violation Record</span><br/>
  <div className="violations">
    Total: {this.state.store.calc.violations} : Critical: {this.state.store.calc.critical}
    {violations}
  </div>

    </div>;
  }
  return (
  <section className="show-container">
    {showDisplay}
</section>

      );
  }
});

module.exports = StoreShow;
