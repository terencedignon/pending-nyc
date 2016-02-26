var React = require('react');

var Violations = React.createClass({
  getInitialState: function () {
    return { expanded: true, onlyCritical: false, message: "Collapse All" };
  },
  toggle: function (e) {
    e.preventDefault();
    var expanded = !this.state.expanded;
    var message;
    if (expanded) {
      message = "Expand";
    } else {
      message = "Collapse";
    }
    this.setState({ expanded: expanded, message: message });
  },
  toggleCritical: function () {
    this.setState ({ onlyCritical: !this.state.onlyCritical});
  },
  render: function () {
    var violationList = this.props.inspections.map(function(inspection) {
      date = new Date(inspection.inspection_date);
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

    return(
      <div>
          <a href="#" onClick={this.toggle}>{this.state.message}</a>
          <a href="#" onClick={this.toggleCritical}>Only Critical</a>
        {violationList}
      </div>
    );
  }
});

module.exports = Violations;
