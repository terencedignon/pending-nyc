var React = require('react');
var ApiUtil = require('../util/api_util.js');
var StoreStore = require('../stores/store_store.js');
var BarChart = require("react-chartjs").Bar;

var Most = React.createClass({
  getInitialState: function () {
    return { queryText: "Aggregrate Score", pagination: 10, best: "highest", query: "score", most: [], boro: "", autoZip: "", result: "50", zipcode: "", cuisine_type: ""}
  },
  componentDidMount: function () {
    ApiUtil.fetchMost(this.state);
    this.storeListener = StoreStore.addListener(this._onStoreChange);
  },
  componentWillUnmount: function () {
    this.storeListener.remove();
  },
  formatPhone: function(n) {
    if (!n) return "";
    return [
      n.slice(0, 3),
      n.slice(3, 6),
      n.slice(6)
    ].join("-")
  },
  boroInput: function (e) {
    e.preventDefault();
    var boro = e.currentTarget.value;
    if (e.currentTarget.id !== "boro") boro = e.currentTarget.id;
    this.setState({ boro: boro });
    if (this.parse) clearInterval(this.parse);
    this.parse = setInterval(this.updateList, 1500)
    this.updateList();
  },

  cuisineInput: function (e) {
    e.preventDefault();
    var cuisine = e.currentTarget.value;
    if (e.currentTarget.id !== "cuisine_type") cuisine = e.currentTarget.id;
    this.setState({ cuisine_type: cuisine });
    if (this.parse) clearInterval(this.parse);
    this.parse = setInterval(this.updateList, 1500)
  },
  chartUpdate: function (ref) {
    var chart = this.refs[ref].getChart();

    // this.setState({ legend: chart.generateLabels()})
    var colors = {
      default: "white",
      A: "rgba(70, 130, 180, 0.5)",
      Ah: "rgba(70, 130, 180, 1)",
      B: "rgba(128, 0, 0, 0.5)",
      C: "rgba(0, 0, 0, 0.9)",
      Cf: "rgba(128, 0, 0, 0.8)"
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
  toggleBest: function () {
    var best = "highest";
    if (this.state.best === "highest") best = "lowest";
    this.setState({ best: best });
    setTimeout(function () {
      this.updateList();
    }.bind(this), 200)
  },
  expand: function(e) {
    $(e.currentTarget.parentElement).find(".wrapper").css("display", "flex");
    $(e.currentTarget.parentElement).find(".fa-minus").css("display", "inline");
    $(e.currentTarget).css("display", "none");
    $(e.currentTarget.parentElement).find(".mini-chart").show();
    $(e.currentTarget.parentElement).find(".details").show(30);
    // .css("display", "block");
  },
  chartData: function (store) {
    var labels = ["Avg", "Surprise", "Flies %", "Mice %", "Roach %", "Best", "Worst"];
    var data = [store.calc.average, store.calc.first_average, store.calc.flies_percentage, store.calc.mice_percentage, store.calc.roach_percentage, store.calc.best, store.calc.worst];

    var dataset = {
      labels: labels,
      datasets: [
        {
          label: "",
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
  collapse: function(e) {
    $(e.currentTarget.parentElement).find(".wrapper").css("display", "none");
    $(e.currentTarget.parentElement).find(".fa-plus").css("display", "inline");
    $(e.currentTarget).css("display", "none");
    $(e.currentTarget.parentElement).find(".details").hide(30);
  },
  zipcodeInput: function (e) {
    e.preventDefault();
    var zipcode = e.currentTarget.value;
    if (e.currentTarget.id !== "zipcode") zipcode = e.currentTarget.id;
    this.setState({ zipcode: zipcode });
    if (this.parse) clearInterval(this.parse);
    this.parse = setInterval(this.updateList, 1500)
  },

  _onStoreChange: function () {
    this.setState({ most: StoreStore.getMost() });
  },
  expandAll: function (e) {
    e.preventDefault();
    var $root = $(e.currentTarget).parent().children();
    $root.find(".details").show(50);
    $root.find(".wrapper").css("display", "flex");
    $root.find(".fa-plus").css("display", "none");
    $root.find(".fa-minus").show(0);
  },
  collapseAll: function (e) {
    e.preventDefault();
    var $root = $(e.currentTarget).parent().children();
    $root.find(".details").hide(100);
    $root.find(".wrapper").hide(100);
    $root.find(".fa-minus").hide();
    $root.find(".fa-plus").show(0);
  },
  updateList: function () {
    clearInterval(this.parse);
    ApiUtil.fetchMost(this.state);
  },
  resultChange: function(e) {
    var result = 50;
    var input = e.currentTarget.value;

    if (input !== "" ) result = input;
    this.setState({ result: result });
  },
  queryHandler: function (e) {
    $(".most-drop-down").show(30);
  },
  paginationHandler: function () {
    var page = (this.state.pagination === 50 ? 10 : this.state.pagination + 10);
    this.setState({ pagination: page });
    setTimeout(function() {
      this.updateList();
    }.bind(this), 200);
  },
  setGrade: function (store) {
        imageObject = {
          A: "http://i.imgur.com/8PkvwVo.jpg",
          B: "http://i.imgur.com/pt3dIsE.jpg",
          C: "http://i.imgur.com/NUoquVG.jpg",
          P: "http://i.imgur.com/fksRyj5.jpg",
          Z: "http://i.imgur.com/fksRyj5.jpg"
        };

          return imageObject[store.calc.grade];
  },
  changeQuery: function (name, e) {
    e.preventDefault();
    this.setState({ queryText: name, query: e.currentTarget.id, most: []})
    this.updateList($.extend(this.state, {query: e.currentTarget.id}));
    $('.most-drop-down').hide();

  },
  render: function () {

    setTimeout(function () {
      $('.wrapper').hide()
    }, 0);

    $('.most-drop-down').hide();

    var mostList = <div className="most-loading"><i className="fa fa-circle-o-notch fa-spin most-spin"></i></div>  ;
    if (this.state.most.length > 1) {
      mostList = StoreStore.getMost().map(function (store, index) {
        var data = this.chartData(store);
        var options = { scaleShowGridLines: false, barStrokeWidth: 0.5};
        var ref = Math.random();
        var barChart = <BarChart ref={ref} className="mini-chart" width={700} height={125} data={data} options={options} />;
        var image = <img src={this.setGrade(store)}/>;
        // setTimeout(function () {
        //   this.chartUpdate(ref);
        // }.bind(this), 2000);
        return <div key={index}><i onClick={this.expand} className="fa fa-plus fa-border"></i>
        <i onClick={this.collapse} className="fa fa-minus fa-border"></i>
      <a href={"#/rest/" + store.id} store={store}>{store.name}</a>

        <span className="fa-stack most-stack ">
            <i className="fa fa-square fa-stack-2x"></i>
            <span className="fa-stack-1x most-text">{store.calc[this.state.query]}</span>
            </span>
            <br/>
    <span className="expanded-details-row wrapper">
      <div className="google-image-holder details">
        {image}

      </div>
      <div className="address details">

            <span className="details"><i className="fa fa-building fa-border"></i>{store.building} {store.street} </span> <br/>
            <span className="details"><i className="fa fa-building fa-border fa-hide"></i><a href="#" id={store.boro} onClick={this.boroInput}>{store.boro}, NY</a> <a href="#" onClick={this.zipcodeInput} id={store.zipcode}>{store.zipcode}</a></span><br/>
            <span className="details"><i className="fa fa-phone fa-border"></i>{this.formatPhone(store.phone)} </span><br/>
            <span className="details"><i className="fa fa-cutlery fa-border"></i> <a href="#" id={store.cuisine_type} onClick={this.cuisineInput}>{store.cuisine_type}</a> </span>
  </div>


  <div>
    {barChart}
  </div>
    </span>
  </div>;

        }.bind(this));
    }


    // <h2>Browse</h2>
    return (
      <div className="most-holder">
        <div>
        <div className="filter-by">
          <h3>  Filter by:
                          <input className="zipcode" onChange={this.zipcodeInput} type="text" value={this.state.zipcode} placeholder="Zipcode"/> {this.state.autoZip}
                     <input id="cuisine_type"  onChange={this.cuisineInput} type="text" value={this.state.cuisine_type} placeholder="Cuisine"/>
                        <input id="boro" onChange={this.boroInput} type="text" value={this.state.boro} placeholder="Boro"/>

                          </h3>

          <h3>Restaurants with the <div onClick={this.toggleBest} className="worst">{this.state.best}</div>
          <div onClick={this.queryHandler} className="worst">{this.state.queryText}
            <div className="most-drop-down">
              <a id="score" onClick={this.changeQuery.bind(this, "Aggregate Score")} href="#">Aggregate</a>
              <a id="average" onClick={this.changeQuery.bind(this, "Average Score")} href="#">Average</a>
              <a id="first_average" onClick={this.changeQuery.bind(this, "Unannounced Average Score")} href="#">Surprise Average</a>
              <a id="worst" onClick={this.changeQuery.bind(this, "Inspection Score")} href="#">One-time Score</a>
              <a id="mice_percentage" onClick={this.changeQuery.bind(this, "percentage of Mice")} href="#">% of Mice</a>  <a id="mice" onClick={this.changeQuery.bind(this, "Number of Mice")} href="#"># of Mice</a>
              <a id="roach_percentage" onClick={this.changeQuery.bind(this,"Percentage of Roaches")} href="#">% of Roaches</a>  <a id="roaches" onClick={this.changeQuery.bind(this, "Number of Roaches")} href="#"># of Roaches</a>
              <a id="flies_percentage" onClick={this.changeQuery.bind(this, "Percentage of Flies")} href="#">% of Flies</a> <a id="flies" onClick={this.changeQuery.bind(this, "Number of Flies")} href="#"># of Flies </a>
            </div>
          </div>
        <br/>Results: <div onClick={this.paginationHandler} className="worst">{this.state.pagination}
        </div>
         </h3>


      </div>

    <hr/>
    </div>

    <div className="filter-links" key="filter-links">

        {mostList}
    </div>
    </div>
    );
  }
});
// <span className="worst" onClick={this.expandAll}>Expand</span> &nbsp;<span className="worst" onClick={this.collapseAll}>Collapse</span><hr/>
// <input type="text" onChange={this.resultChange}/>
//
// <span className="top-sentence">Returning <span className="editable" contentEditable="true">50</span> results.</span><p/>
//

module.exports = Most;
