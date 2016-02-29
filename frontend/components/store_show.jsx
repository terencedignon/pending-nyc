var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var BarChart = require("react-chartjs").Bar;
var PieChart = require("react-chartjs").Pie;
var Comparison = require('./comparison.jsx');
var Map = require('./map.jsx');
var Overview = require('./overview.jsx');
var Violations = require('./violations.jsx');

var StoreShow = React.createClass({
  getInitialState: function () {
    return { grade: "P", store: {}, yelp: {}, key: "map" };
  },
  componentDidMount: function () {
    function yelpCallback (phone) {
      ApiUtil.getYelp(phone);
    };
    this.storeListener = StoreStore.addListener(this._onStoreChange);
    ApiUtil.fetchStore(this.props.params.id, yelpCallback.bind(this));
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  returnImage: function () {
    var url;
    // console.log(this.state.store.image_url);
    if (this.state.store.image_url !== null) {
      url = this.state.store.image_url.replace("ms.jpg", "l.jpg");
      return <img className="show-image" src={url} />;
    // } else if (typeof this.state.yelp.image_url !== "undefined") {
    //   console.log(this.state.yelp.image_url);
    //   url = this.state.yelp.image_url.replace("ms.jpg", "348s.jpg");
    //   return <img className="show-image" src={url} />;
  } else {
      return <div className="empty-image"></div>;
    }
  },
  _onStoreChange: function () {
    if (this.state.store !== StoreStore.getStore()) {
    this.setState({ comparisonKey: Math.random(), mapKey: Math.random(), store: StoreStore.getStore(), yelp: StoreStore.getYelp() });
  };
    // console.log(this.state.store.name);
    // this.setState(this.state);
  },

  violationChart: function () {

    var store = this.state.store;
    var data = [
      {
        value: (store.calc.violations - store.calc.critical),
        color: "#f7f7f7",
        hightlight: "#eee",
        label: "Not-Critical"
      },
      {
        value: store.calc.critical,
        color: "salmon",
        hightlight: "salmon",
        label: "Critical"

      }
    ];
    return data;
  },

  colorAverage: function(num) {
    if (num <= 13) {
      return "a";
    } else if (num <= 27) {
      return "b";
    } else {
      return "c";
    }
  },

  chartData: function () {
    var labels = [];
    var data = [];

    this.state.store.inspections.forEach(function(inspect) {

      var date = new Date(inspect.inspection_date);
      var month = date.getMonth() + 1;
      var year = date.getYear() + 1900;
      labels.unshift(month + "/" + year);
      // if (typeof inspect.score !== "number") { inspect.score = 0; }
      data.unshift(inspect.score);
      // return {x: month + "/" + year, y: inspect.score};
    }.bind(this));

    var dataset = {
      labels: labels,
      datasets: [
        {
          label: "My first dataset",
          fillColor: "white",
           strokeColor: "black",
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

    if (typeof this.state.store.inspections[0].grade !== "undefined") {
      return imageObject[this.state.store.inspections[0].grade]
    } else {
      return imageObject["P"];
    }
  },
  translate: function (number) {
    if (number <= 13) {
      return "an A";
    } else if (number <= 27) {
      return "a B";
    } else {
      return "a C"
    }

  },
  analyzeBy: function () {

  },
  render: function () {


    var data;
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
      //VIOLATION LIST

      violations = <Violations key={Math.random()} inspections={this.state.store.inspections} />
        //CHART

      // var circleData = this.violationChart();
      // circleChart = <PieChart data={circleData} width={200} height={200}/>;
      data = this.chartData();
      // scaleShowLabels: false
      var options = {
        scaleShowGridLines: true
      }
      barChart = <BarChart className="bar-chart" data={data} width={500} height={200} options={options} fill={'#3182bd'}    />;
    var grade = <img src={this.selectGrade()}/>;
      var image = this.returnImage();
    }


    // if (typeof this.state.yelp.location !== "undefined") {
    //   var open = (this.state.yelp.is_closed ? <span className="closed">Closed</span> :
    //               <span className="open">Open</span>)
    // // initMap();

    var address = <div></div>;
      // {this.state.yelp.location.display_address[1]}<br/>
      // {this.state.yelp.location.display_address[0]}
      // {this.state.yelp.location.display_address[1]}
      // {this.state.yelp.location.display_address[2]}

    address = <div>
      <h2>{this.state.store.name}</h2>
      {this.state.store.display_phone}

  </div>;



  // <LineChart className="chart" data={data} width="600" height="250" />
  // {barChart}

        // <div className="violation-chart">
        //   {circleChart}
        // </div>
  var showDisplay;
  if (typeof this.state.store.calc !== "undefined") {
    showDisplay =
    <div>
  <div className="show-row">
    <div className="overview">
      {overview}
      <hr/>
      <span className="store-name">Inspections over time</span>
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
  } else {
    showDisplay = <div/>;
  }

  return (
  <section className="show-container">
    {showDisplay}
</section>

      );
  }
});

module.exports = StoreShow;
