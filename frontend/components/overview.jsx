var React = require('react');
var Map = require('./map.jsx');
var Comparison = require('./comparison.jsx');

var Overview = React.createClass({
  formatName: function (string) {
    return string.toLowerCase().split(" ").map(function(word) {
      return word[0].toUpperCase() + word.slice(1);
    }).join(" ");
  },
  percentageCalc: function (num, div) {
    return (num > 0 ? Math.round((num / div) * 100) + "%" : "0")
  },
  translate(number) {
    if (number <= 13) return "an A";
    if (number <= 27) return "a B";
    return "a C";
  },
  propsData: function () {
    var calc = this.props.store.calc;
    var data = {};
    data.average = calc.average;
    data.worst = calc.worst;
    data.best = calc.best;
    data.first_average = calc.first_average;
    data.name = this.formatName(this.props.store.name);
    data.bestDate = new Date(calc.best_date);
    data.worstDate = new Date(calc.worst_date);
    data.flies = this.percentageCalc(calc.flies, calc.inspections);
    data.mice = this.percentageCalc(calc.mice, calc.inspections);
    data.roaches = this.percentageCalc(calc.roaches, calc.inspections);
    return data;
  },
  render: function () {

    var data = this.propsData();

    return (
      <span>
        <span className="store-name">{data.name} Overview</span><p/>

        <i className="fa fa-user"></i>{data.name} has an average inspection score of {data.average}, the equivalent of {this.translate(data.average)}. <br/>
        <i className="fa fa-user-secret"></i>Its average score for unannounced inspections is {data.first_average}, or {this.translate(data.first_average)}.<br/>
        <i className="fa fa-bug"></i>Of those {data.inspections} inspections,  {data.mice} found mice, <strong className="emphasis">{data.flies}</strong> found flies, and {data.roaches} found roaches.<br/>
        <i className="fa fa-calendar-times-o"></i>Its worst inspection was {data.worst} on {data.worstDate.toDateString()}.<br/>
        <i className="fa fa-calendar-check-o"></i>Its best inspection was {data.best} on {data.bestDate.toDateString()}.<p/>

    <span className="store-name"><strong className="overview-emphasis">Analyze</strong></span><br/>
        BY <a href="#" onClick={this.analyzeBy}>{this.props.store.cuisine_type.trim() + " Cuisine"}</a>  <a href="#">{this.props.store.zipcode}</a>  <a href="#">{this.props.store.boro[0] + this.props.store.boro.slice(1).toLowerCase()}</a><br/>
      <div className="comparison">
        <Comparison store={this.props.store}/>
      </div>
  </span>
);
  }

});

module.exports = Overview;
