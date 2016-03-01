var React = require('react');

var About = React.createClass({
  render: function () {
      return (
        <div className="about">
        <h1>Pending.nyc is an in-depth look at NYC publicly available restaurant inspection grades.</h1>
        <img src="https://bmj2k.files.wordpress.com/2011/02/ratings1.jpg"/>
        <h3>Starting in July 2010, New York City has required restaurants to post letter grades that correspond to scores received from sanitary inspections. An inspection score of 0-13 is an A, 14-27 points is a B, and 28 or more points is a C. Grade cards must be posted where they can easily be seen by people passing by.</h3>

  </div>
    );
  }

});

module.exports = About;
