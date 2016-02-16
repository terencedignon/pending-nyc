var React = require('react');

var Map = React.createClass({
  componentDidMount: function () {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
    var panorama;
  panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view'),
      {
        position: {lat: 37.869260, lng: -122.254811},
        pov: {heading: 165, pitch: 0},
        zoom: 1
      });
  },
  render: function () {
    return (
      <div>
    <div id="map"></div>
    <div id="street-view"></div>
    </div>

  );
}

});

module.exports = Map;
