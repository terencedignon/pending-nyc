var React = require('react');
var Map = require('./map.jsx');
var Comparison = require('./comparison.jsx');

var Overview = React.createClass({
  formatName: function (string) {
    return string.trim().toLowerCase().split(" +").map(function(word) {
      return word[0].toUpperCase() + word.slice(1);
    }.bind(this)).join(" ");
  },
  percentageCalc: function (num, div) {
    return (num > 0 ? Math.round((num / div) * 100) + "%" : "0")
  },
  translate: function (number) {
    if (number <= 13) return "an A";
    if (number <= 27) return "a B";
    return "a C";
  },
  propsData: function () {
    var calc = this.props.store.calc;

    var data = {};
    data.average = calc.average;
    data.worst = calc.worst;
    data.inspections = calc.inspections;
    data.best = calc.best;
    data.last = this.props.store.inspections[0].score;
    data.first_average = calc.first_average;
    data.name = this.formatName(this.props.store.name);
    data.bestDate = new Date(calc.best_date);
    data.worstDate = new Date(calc.worst_date);
    data.flies = this.percentageCalc(calc.flies, calc.inspections);
    data.mice = this.percentageCalc(calc.mice, calc.inspections);
    data.roaches = this.percentageCalc(calc.roaches, calc.inspections);


    data.total = Math.round((data.last + data.average + data.worst + data.best + ((calc.flies / calc.inspections) * 100) + ((calc.mice / calc.inspections) * 100) + ((calc.roaches / calc.inspections) * 100) + data.first_average) / 8);

    return data;
  },

  showUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "block");
  },
  hideUnannounced: function (e) {
    $(e.currentTarget).find('.unannounced').css("display", "none");
  },

  iconParse: function (grade) {
    if (grade instanceof Array) {
      for (var i = 0; i < grade.length; i++) {
        var num = grade[i];
        if (num.includes("%")) num = num.slice(0, -1);

        if (num >= 25) {

          return "thumbs-o-down";
      }
    }
    return "thumbs-o-up";
  }
      if (grade <= 13) {
        return "thumbs-o-up";
      } else if (grade <= 27) {
        return "minus fa-border";
      } else {
        return "thumbs-o-down";
      }
  },

  render: function () {

    var data = this.propsData();



  //   <span className="store-name"><strong className="overview-emphasis">Analyze</strong></span><br/>
  //   BY <a href="#" onClick={this.analyzeBy}>{this.props.store.cuisine_type.trim() + " Cuisine"}</a>  <a href="#">{this.props.store.zipcode}</a>  <a href="#">{this.props.store.boro[0] + this.props.store.boro.slice(1).toLowerCase()}</a><br/>
  // <div className="comparison">
  //   <Comparison store={this.props.store}/>
  // </div>

    return (
      <span className="overview-holder">
        <span className="store-name">{this.props.store.name} Overview: <span className="question-highlight">{data.total}
          <div className="legend"><span className="a">A:</span> <span className="range">0-13</span>&nbsp;
            <span className="b">B:</span> <span className="range">14-27</span>&nbsp;
              <span className="c">C:</span> <span className="range">28 and up</span></div>
        <span className="unannounced">An average of best, worst, average, surprise average, and percentage of infestations </span></span></span><p/>
        <span className="inspection-detail">


          <i className={"fa fa-" + this.iconParse(data.last)}></i>Most recent: {data.last}, {this.translate(data.last)}. </span><br/>


    <i className={"fa fa-" + this.iconParse(data.average)}></i>
      Average: {data.average}, {this.translate(data.average)} <br/>
    <i className={"fa fa-" + this.iconParse(data.first_average)}></i>Average <span onMouseOver={this.showUnannounced} onMouseOut={this.hideUnannounced} className="question-highlight">unannounced inspection
            <span className="unannounced">The Health Department conducts unannounced inspections of restaurants at least once a year.</span>
          </span>: {data.first_average}, {this.translate(data.first_average)}.<br/>
        <i className={"fa fa-" + this.iconParse([data.mice, data.roaches, data.flies])}></i>Of {data.inspections} inspections,  {data.mice} found mice, {data.flies} found flies, and {data.roaches} found roaches.<br/>
        <i className={"fa fa-" + this.iconParse(data.worst)}></i>Worst: {data.worst} on {data.worstDate.toDateString()}.<br/>
        <i className={"fa fa-" + this.iconParse(data.best)}></i>Best: {data.best} on {data.bestDate.toDateString()}.<p/>
  </span>
);
  }

});

module.exports = Overview;
