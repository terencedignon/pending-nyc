var React = require('react');

var Violations = React.createClass({
  getInitialState: function () {
    return { expanded: false, onlyCritical: false, message: "Expand" };
  },
  toggle: function (e) {
    e.preventDefault();
    var expanded = !this.state.expanded;
    var message;
    if (expanded) {
      message = "Collapse";
    } else {
      message = "Expand";
    }
    this.setState({ expanded: expanded, message: message });
  },
  toggleCritical: function (e) {
    e.preventDefault();
    this.setState ({ onlyCritical: !this.state.onlyCritical});
  },
  render: function () {
    var violationList;
    if (this.state.expanded) {
      violationList = this.props.inspections.map(function(inspection) {
        var date = new Date(inspection.inspection_date);
        return <ul key={Math.random()}><h3>Inspection Date: {date.getMonth() + "/" + (date.getYear() + 1900) }<br/>
            Score: {inspection.score}
        </h3>{ inspection.violations.map(function(violation) {
          if (violation.critical) {
          return <li key={Math.random()} className="critical"><div className="critical-box"></div>{violation.description.split(".")[0] + "."}</li>;
          } else if (!this.state.onlyCritical) {
              return <li key={Math.random()} className="not-critical">{violation.description}</li>;
              }

          }.bind(this)) }</ul>
      }.bind(this));
    } else {
      violationList = <div></div>;
    }

    return(
      <div>
          <a href="#" onClick={this.toggle}>{this.state.message}</a>
          <a href="#" onClick={this.toggleCritical}>{this.state.criticalMessage}</a>
        {violationList}
      </div>
    );
  }
});

module.exports = Violations;
