var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var BarChart = require("react-chartjs").Bar;
var PieChart = require("react-chartjs").Pie;
var Comparison = require('./comparison.jsx');
var Map = require('./map.jsx');
var Overview = require('./overview.jsx');


var StoreShow = React.createClass({
  getInitialState: function () {
    return { grade: "P", store: {}, yelp: {} };
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
    if (typeof this.state.yelp.image_url !== "undefined") {
      var url = this.state.yelp.image_url.replace("ms.jpg", "348s.jpg");


      return <img className="show-image" src={url} />;
  } else {
      return <div className="empty-image"></div>;
    }
  },
  _onStoreChange: function () {

    this.setState({ store: StoreStore.getStore(), yelp: StoreStore.getYelp() });
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
           highlightFill: "#f7f7f7",
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
  translate(number) {
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
//   createOverview: function () {
//     var name = this.state.store.name.toLowerCase().split(" ").map(function (word) {
//       return word[0].toUpperCase() + word.slice(1);
//     }).join(" ");
//     var calc = this.state.store.calc;
//     var bestDate = new Date(calc.best_date);
//     var worstDate = new Date(calc.worst_date);
//     var flies = (calc.flies > 0 ? Math.round((calc.flies / calc.inspections) * 100) + "%" : "0")
//     var mice = (calc.mice > 0 ? Math.round((calc.mice / calc.inspections) * 100) + "%" : "0")
//     var roaches = (calc.roaches > 0 ? Math.round((calc.roaches / calc.inspections) * 100) + "%" : "0")
//
//     overview = <span>
//       <span className="store-name"><strong className="overview-emphasis">{name} Overview</strong></span><p/>
//       <i className="fa fa-user"></i>{name} has an average inspection score of <strong className={this.colorAverage(calc.average)}> {calc.average}</strong>, the equivalent of {this.translate(calc.average)}. <br/>
//       <i className="fa fa-user-secret"></i>Its average score for unannounced inspections is <strong className={this.colorAverage(calc.first_average)}>{calc.first_average}</strong>, or {this.translate(calc.first_average)}.<br/>
//       <i className="fa fa-bug"></i>Of those <strong className="emphasis">{calc.inspections}</strong> inspections,  <strong className="emphasis">{mice}</strong> found mice, <strong className="emphasis">{flies}</strong> found flies, and <strong className="emphasis">{roaches}</strong> found roaches.<br/>
//       <i className="fa fa-calendar-times-o"></i>Its worst inspection was <strong className={this.colorAverage(calc.worst)}>{calc.worst}</strong> on {worstDate.toDateString()}.<br/>
//       <i className="fa fa-calendar-check-o"></i>Its best inspection was <strong className={this.colorAverage(calc.best)}>{calc.best}</strong> on {bestDate.toDateString()}.<p/>
//           <span className="store-name"><strong className="overview-emphasis">Analyze</strong></span><br/>
//           BY <a href="#" onClick={this.analyzeBy}>{this.state.store.cuisine_type.trim() + " Cuisine"}</a>  <a href="#">{this.state.store.zipcode}</a>  <a href="#">{this.state.store.boro[0] + this.state.store.boro.slice(1).toLowerCase()}</a><br/>
//
// </span>;
//   return overview;
//
//   },

  render: function () {


    var data;
    var circleChart = <div></div>;
    var barChart = <div></div>;
    var overview = <div></div>;
    var violations;
    var store = this.state.store;

    if (typeof this.state.store !== "undefined" && typeof this.state.store.inspections !== "undefined") {
      ///OVERVIEW

      this.map = <Map key={Math.random()} camis={this.state.store.camis} cuisine_type={this.state.store.cuisine_type} name={this.state.store.name} lat={this.state.store.lat} lng={this.state.store.lng}/>;
      // overview = this.createOverview();
      overview = <Overview store={this.state.store}/>
      //VIOLATION LIST

      violations = this.state.store.inspections
      .map(function(inspection) {
        date = new Date(inspection.inspection_date);
        return <ul key={Math.random()}><h3>Inspection Date: {date.getMonth() + "/" + (date.getYear() + 1900) }<br/>
            Score: {inspection.score}

        </h3>{ inspection.violations.map(function(violation) {
          if (violation.critical) {
          return <li key={Math.random()} className="critical">{violation.description.split(".")[0] + "."}</li>;
          } else {
          return <li key={Math.random()} className="not-critical">{violation.description}</li>;
          }
          }) }</ul>
        });

        //CHART

      var circleData = this.violationChart();

      circleChart = <PieChart data={circleData} width={200} height={200}/>;

      data = this.chartData();
      // scaleShowLabels: false
      var options = {
        scaleShowGridLines: false
      }
      barChart = <BarChart data={data} width={400} height={420} options={options} fill={'#3182bd'}    />;
      var grade = <img src={this.selectGrade()}/>;
    }


    // if (typeof this.state.yelp.location !== "undefined") {
    //   var open = (this.state.yelp.is_closed ? <span className="closed">Closed</span> :
    //               <span className="open">Open</span>)
    // // initMap();
    var image = this.returnImage();
    var address = <div></div>;
      // {this.state.yelp.location.display_address[1]}<br/>
      // {this.state.yelp.location.display_address[0]}
      // {this.state.yelp.location.display_address[1]}
      // {this.state.yelp.location.display_address[2]}

    address = <div>
      <h2>{this.state.store.name}</h2>

  </div>;



  // <LineChart className="chart" data={data} width="600" height="250" />
  // {barChart}

  var legend =  <div className="legend"><span className="a">A:</span> <span className="range">0-13 / </span>&nbsp;
    <span className="b">B:</span> <span className="range">14-27 / </span>&nbsp;
      <span className="c">C:</span> <span className="range">28 and up </span></div>;

        // <div className="violation-chart">
        //   {circleChart}
        // </div>

        // <div className="legend">
        //   {legend}
        // </div>
  return (
  <section>
  <div className="show">
    <div className="overview">
      {overview}
    </div>
    <div>
      {this.map}
    </div>
  </div>
  <div>
    <div className="show-header">
    <div className="compare">
    </div>
  </div>
    <div className="show-info">
      {address}
    </div>
    <div className="show-row">
      <div className="show-holder">
        {image}
        <div className="show-grade">
          {grade}
        </div>
      </div>
    </div>
    <div className="show-row">
      <div className="chart">
        {barChart}
      </div>
    </div>
    <div className="show-row">
  </div>
  <div className="violations">
    {violations}
  </div>
  </div>
</section>

      );
  }
});

module.exports = StoreShow;
