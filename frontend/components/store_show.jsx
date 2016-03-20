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
    return { grade: "P", store: {}, pie: "", hash: window.location.hash, mapKey: Math.random(), yelp: {}, key: "map",  data: {} };
  },
  componentDidMount: function () {

    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchStore(this.props.params.id);
  },
  componentWillUnmount: function () {
    clearInterval(this.backButtonListener);
    this.storeListener.remove();

  },
  setImage: function () {
    if (this.state.store.image_url !== null) {

      var url = this.state.store.image_url.replace("ms.jpg", "o.jpg");
      setTimeout(function() {
          $('.show-holder').parallax({imageSrc: url, speed: 0.2});
      }, 0);
    } else {
      setTimeout(function () {
        $('.show-holder').parallax({
          imageSrc: "https://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=" + this.state.store.lat + "," + this.state.store.lng + "&fov=90&heading=151.78&pitch=0&key=AIzaSyCeMPHcWvEYRmPBI5XyeBS9vPsAvqxLD7I",
          speed: 0.2
        });
      }.bind(this), 0);
    }
  },
  
  _onStoreChange: function () {
    if (this.state.store !== StoreStore.getStore()) {
      this.setState({ comparisonKey: Math.random(), pie: StoreStore.getChart(), mapKey: Math.random(), store: StoreStore.getStore(), yelp: StoreStore.getYelp() });
      // this.setChart();
      this.chartUpdate();
    }
  },

  chartUpdate: function () {
    var chart = this.refs.chart.getChart();
    // this.setState({ legend: chart.generateLabels()})
    var colors = {
      default: "white",
      A: "rgba(70, 130, 180, 0.5)",
      Ah: "rgba(70, 130, 180, 1)",
      B: "rgba(128, 0, 0, 0.5)",
      C: "rgba(128, 0, 0, 0.75)",
      Cf: "rgba(128, 0, 0, 1)"
    }
    // B: "rgba(59,187,48, 0.5)",
    // Bh: "rgba(59,187,48, 1)",
    // C: "rgba(251, 149, 23, 0.5)",
    // Ch: "rgba(251, 149, 23, 1)"

    chart.datasets[0].bars.forEach(function(bar) {
      if (bar.value <= 27) {
         bar.fillColor = "white";
         bar.strokeColor = "#777777";
         bar.highlightFill = "white"
         bar.highlightStroke = "#222222";
      } else {
        bar.fillColor = colors["C"];
        bar.strokeColor = colors["C"];
        bar.highlightFill = colors["C"]
        bar.highlightStroke = colors["C"];
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

  openMap: function () {
    $('.load-map').hide();
    $('.map-holder').css("height", "1000");
    // this.forceUpdate();
  },

  selectGrade: function () {

    imageObject = {
      A: "http://i.imgur.com/8PkvwVo.jpg",
      B: "http://i.imgur.com/pt3dIsE.jpg",
      C: "http://i.imgur.com/NUoquVG.jpg",
      P: "http://i.imgur.com/fksRyj5.jpg",
      Z: "http://i.imgur.com/fksRyj5.jpg"
    };

      return imageObject[this.state.store.calc.grade];

  },


  render: function () {


    var data;
    this.map = <Map key={this.state.mapKey} camis={this.state.store.camis} cuisine_type={this.state.store.cuisine_type} name={this.state.store.name} lat={this.state.store.lat} lng={this.state.store.lng}/>;
    $('footer').hide();
    // var legend = <div/>;
    var comparison = <div/>;
    var circleChart = <div></div>;
    var barChart = <div></div>;
    var overview = <div></div>;
    var violations;
    var store = this.state.store;

    if (typeof this.state.store !== "undefined" && typeof this.state.store.calc !== "undefined") {
      $('footer').show();

      ///OVERVIEW

      // overview = this.createOverview();
      comparison = <Comparison key={this.state.comparisonKey} store={this.state.store} />;
      overview = <Overview store={this.state.store}/>
      violations = <Violations key={Math.random()} inspections={this.state.store.inspections} />
        //CHART
        data = this.chartData();
        // cornerRadius: 0
        // tooltipCaretSize: 8,
        var options = {
          scaleShowGridLines: false,
          barStrokeWidth: 0.5,
          tooltipFontFamily: "Helvetica",

        };
        // legend = <span dangerouslySetInnerHTML={{ __html: this.state.legend }} />;
        barChart = <BarChart ref="chart" className="bar-chart" data={data} options={options} width={350} height={200} fill={'#3182bd'} />
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

              <span className="store-name">Inspections over time</span>
              <br/>
                {barChart}


              {comparison}
            </div>

            <div className="right-holder">
              <div key={Math.random()} className="show-holder">
                {image}
                <div className="show-grade">
                  {grade}
                </div>
              </div>
              <div className="pie-chart">
                {this.state.pie}
              </div>
              <div className="load-map">
                <span onClick={this.openMap} className="store-name-header">Load Map</span>
              </div>
              <div>
                {this.map}
              </div>
            </div>

  </div>

    </div>;
  }
  // <span className="store-name">Violation Record</span><br/>
  // <div className="violations">
  //   Total: {this.state.store.calc.violations} : Critical: {this.state.store.calc.critical}
  //   {violations}
  // </div>
  return (
  <div className="show-container">
      {showDisplay}
</div>

      );
  }
});

module.exports = StoreShow;
