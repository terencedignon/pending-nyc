var React = require('react');
var StoreStore = require('../stores/store_store.js');
var ApiUtil = require('../util/api_util.js');
var MapStore = require('../stores/map_store.js');

var Map = React.createClass({
  getInitialState: function () {
    return { markers: [], newMarkers: []};
  },
  componentDidMount: function () {

    this.storeListener = StoreStore.addListener(this._onStoreChange);
    this.mapListener = MapStore.addListener(this._onMapChange);
    var coordinates = {lat: Number(this.props.lat), lng: Number(this.props.lng)};
    map = new google.maps.Map(document.getElementById('map'), {
      center: coordinates,
  
      zoom: 16,
      styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
    });

  google.maps.event.addListener(map, 'tilesloaded', function () {
    var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.props.cuisine_type}
    ApiUtil.fetchMap(options);
  }.bind(this));

  google.maps.event.addListener(map, 'idle', function() {
      var options = {bounds: map.getBounds().toJSON(), cuisine_type: this.props.cuisine_type}
      ApiUtil.fetchMap(options);
    }.bind(this));

  //
  // var panorama;
  // panorama = new google.maps.StreetViewPanorama(
  //   document.getElementById('street-view'),
  //   {
  //     position: coordinates,
  //     disableDefaultUI: true,
  //     streetViewControl: false,
  //     pov: {heading: 165, pitch: 0},
  //     zoom: 1
  //   });

},

componentWillUnmount: function () {
  this.storeListener.remove();
  this.mapListener.remove();
},
_onMapChange: function () {
  this.setState({ markers: [] });
  var newMarkers = [];

  MapStore.all().forEach(function(marker) {
    var grade;
    var hex;
    var text = "FFF";
    var shadow = "_withshadow";

  if (marker.camis === this.props.camis) {
      grade = marker.calc.average;
      hex = "FFF";
      shadow = "";
      text = "FFF";
  }
  else if (marker.calc.average <= 13) {
      grade = marker.calc.average;
      text = "0056ac";
    } else if (marker.calc.average <= 27) {
      grade = marker.calc.average;
      hex = "49ac42";
    } else {
      grade = marker.calc.average;
      hex="fa9828";
    }


    var coordinates = {lat: Number(marker.lat), lng: Number(marker.lng) };
    var newMarker = new google.maps.Marker({
      position: coordinates,
      map: map,
      icon: "https://chart.googleapis.com/chart?chst=d_map_pin_letter" + shadow + "&chld=" +
        grade + "|" + hex + "|" + text,
      title: marker.name,
    });


    newMarkers.push(newMarker);
  }.bind(this));

  this.state.markers.forEach(function(marker) {
    marker.setMap(null)
  });

  this.setState({ markers: newMarkers});


},
_onStoreChange: function () {
  // this.setState({map: StoreStore.getMap()});

},

  render: function () {
    // <div id="street-view"></div>

    return (
      <div>

    <div id="map"></div>
    </div>

  );
}

});

module.exports = Map;
